/******************************************
* Row Intervention Task View
*/
app.Views.ItemInterventionTaskView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemInterventionTask',
	
	className   : 'row-nested-objects',

	// The DOM events //
	events       : {


		'click a.modalDeleteTask'   		: 'displayModalDeleteTask',
		
		'click a.buttonCancelTask'			: 'displayModalCancelTask',

		'click a.printTask'					: 'print',

		'click .buttonTaskDone, .buttonNotFinish' : 'displayModalTaskDone',

	},



	/** View Initialization
	*/
	initialize : function() {
		//this.model.off();

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);
		this.listenTo(this.model, 'destroy', this.destroyTask);
		this.inter = this.options.inter;
	},

	destroyTask: function(model){
		var self = this;
		this.inter.fetch().done(function(){
			if(self.inter.toJSON().tasks.length > 0){
				app.Helpers.Main.highlight($(self.el)).always(function(){
					self.remove();
				})

			}
			else{
				self.remove();
			}
		});
		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.taskDeleteOk);
		
		

	},

	/** When the model ara updated //
	*/
	change: function(model){
		var self = this;

		this.render();

		app.Helpers.Main.highlight($(this.el))

		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.taskUpdateOk);

	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

		 
			var template = _.template(templateData, {
				lang                   : app.lang,
				interventionsState     : app.Models.Intervention.status,
				task					: self.model.toJSON(),
			});

			$(self.el).html(template);

			// Set the Tooltip / Popover //$(self.el).html(template);
			$('*[data-toggle="tooltip"]').tooltip();
			$('*[rel="popover"]').popover({trigger: 'hover'});

			// Set the focus to the first input of the form //
			$('#modalDeleteTask, #modalAddTask, #modalCancelTask').on('shown', function (e) {
				$(this).find('input, textarea').first().focus();
			})
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

		});
		return this;
	},


	/** Print a Task or an Intervention
	*/
	print: function(e){
		e.preventDefault();
		var self = this;
		
		var selectedTaskJSON = this.model.toJSON();

		// Get the inter of the Task //
		var inter = app.views.interventions.collections.interventions.get(selectedTaskJSON.project_id[0]);
		var interJSON = inter.toJSON();

		// Hide the print Inter section //
		$('#printTask div.forInter').hide();
		$('#printTask div.forTask').show();
		$('.field').html('');

		$('#taskLabel').html(selectedTaskJSON.name + ' <em>('+selectedTaskJSON.category_id[1]+')</em>');
		$('#taskPlannedHour').html(app.Helpers.Main.decimalNumberToTime(selectedTaskJSON.planned_hours, 'human'));
		
		var deferred = $.Deferred();
		deferred.always(function(){
			$('#interName').html(interJSON.name);
			$('#interDescription').html(interJSON.description);
			$('#interService').html(!interJSON.service_id?'':interJSON.service_id[1]);

			$('#interDateCreate').html(moment(interJSON.create_date).format('LL'));
			console.info(interJSON);
			console.log(interJSON);
			if(interJSON.date_deadline != false){
				$('#interDeadline').html(' / ' + moment(interJSON.date_deadline).format('LL'));
			}
			if(interJSON.has_equipment){
				//display location (openstc.site) info
				$('#printPlaceLabel').css({display:'inline-block'});
				$('#interPlace').css({display:'inline-block'});
				
				//fill data with equipment and location
				$('#interPlaceOrEquipment').html(interJSON.equipment_id[1]);
				$('#interPlace').html(interJSON.site1[1]);
				$('#printPlaceOrEquipmentLabel').html(app.lang.equipment + ':');
				$('#printPlaceLabel').html(app.lang.location + ':');
				
			}
			else{
				//hide location info (keeping only site info on placeOrEquipment field)
				$('#printPlaceLabel').css({display:'none'});
				$('#interPlace').css({display:'none'});
				
				//fill data of site1
				$('#interPlaceOrEquipment').html(interJSON.site1[1]);
				$('#printPlaceOrEquipmentLabel').html(app.lang.place + ':');
			}
			
			$('#interPlaceMore').html(interJSON.site_details);

			$('#printTask').printElement({
				leaveOpen	: true,
				printMode	: 'popup',
				overrideElementCSS:[
					{ href:'css/vendors/print_table.css', media: 'all'}
				]
			});
		});
		if(!interJSON.ask_id){
			
			$('#claimentName').html(interJSON.create_uid[1]);
			deferred.resolve();
		}else{
			//retrieve ask associated, if exist
			var ask = new app.Models.Request();
			ask.setId(interJSON.ask_id[0]);
			ask.fetch().done(function(){
				var askJSON = ask.toJSON();
				if(askJSON.partner_id != false){
					$('#claimentName').html(askJSON.partner_id[1]+' - '+ !askJSON.partner_address?'':askJSON.partner_address[1]);
					$('#claimentPhone').html(askJSON.partner_phone);
					
				}
				else{
					$('#claimentName').html(askJSON.people_name);
					$('#claimentPhone').html(askJSON.people_phone);
				}
	
				$('#claimentType').html(askJSON.partner_type[1]);
				deferred.resolve();
			})
			.fail(function(e){
				console.log(e);
				deferred.reject();
			});
		}
		

	},

	/** Prepare Modals
	*/
	displayModalDeleteTask: function(e){
		e.preventDefault();
		var name = this.model.toJSON().name;
		new app.Views.ModalDeleteView({el: '#modalDeleteTask', model: this.model, modalTitle: app.lang.viewsTitles.deleteTask, modalConfirm: app.lang.warningMessages.confirmDeleteTask});
	},

	displayModalTaskDone: function(e){
		e.preventDefault();
		var button = $(e.target);
		var self = this;
		var taskDone = false;
		// Display or nor the Remaining Time Section //
		if(button.hasClass('buttonNotFinish') || button.hasClass('iconButtonNotFinish')){
//			$('#remainingTimeSection').show();
		}
		else{
			taskDone = true
//			$('#remainingTimeSection').hide();
		}
		new app.Views.ModalTaskDoneView({el:'#modalTaskDone', model: this.model, inter: this.inter, taskDone: taskDone, tasks: self.options.tasks});
	},
	
	displayModalCancelTask: function(e) {
		e.preventDefault();
		new app.Views.ModalCancelTaskView({el: '#modalCancelTask', model: this.model});
	},

});