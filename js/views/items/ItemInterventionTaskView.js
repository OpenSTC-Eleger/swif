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
		'click button.btnDeleteTask'   		: 'deleteTask',
		
		'click a.buttonCancelTask'			: 'displayModalCancelTask',
		'submit #formCancelTask' 			: 'cancelTask',

		'click a.printTask'					: 'print',

		'click .buttonTaskDone, .buttonNotFinish' : 'displayModalTaskDone',
		'submit #formTaskDone'   			: 'taskDone',
		'click a.linkSelectUsersTeams'		: 'changeSelectListUsersTeams',
		'click .linkRefueling'				: 'accordionRefuelingInputs',

	},



	/** View Initialization
	*/
	initialize : function() {
		this.model.off();

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);
	},



	/** When the model ara updated //
	*/
	change: function(model){
		var self = this;

		this.render();

		// Highlight the Row and recalculate the className //
		this.highlight().done(function(){
//			self.$el.attr('class', _.result(self, 'className'));
		});


		// Set the info message for the notification //
//		switch(model.getState()){
//			case app.Models.Request.status.refused.key: 
//				var infoMessage = app.lang.infoMessages.requestRefuseOk;
//			break;
//			case app.Models.Request.status.confirm.key:
//				var infoMessage = app.lang.infoMessages.requestConfirmOk;
//			break;
//			case app.Models.Request.status.valid.key:
//				var infoMessage = app.lang.infoMessages.requestValidOk;
//			break;
//		}


		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+infoMessage);

		// Partial Render //
		app.views.interventions.partialRender();
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
			
			//Ask update modals
			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
			$(".datepicker").datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });
			$('#equipmentsDone, #equipmentsListDone').sortable({
				connectWith: 'ul.sortableEquipmentsList',
				dropOnEmpty: true,
				forcePlaceholderSize: true,
				forceHelperSize: true,
				placeholder: 'sortablePlaceHold',
				containment: '.equipmentsDroppableAreaDone',
				cursor: 'move',
				opacity: '.8',
				revert: 300,
				receive: function(event, ui){
					//self.saveServicesCategories();
				}

			});
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
		$('#taskPlannedHour').html(app.decimalNumberToTime(selectedTaskJSON.planned_hours, 'human'));
		
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
			$('#interPlace').html(interJSON.site1[1]);
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
	

	/** Highlight the row item
	*/
	highlight: function(){
		var self = this;

		$(this.el).addClass('highlight');

		var deferred = $.Deferred();

		// Once the CSS3 animation are end the class are removed //
		$(this.el).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
			function(e) {
				$(self.el).removeClass('highlight');
				deferred.resolve();
		});

		return deferred;
	}


});