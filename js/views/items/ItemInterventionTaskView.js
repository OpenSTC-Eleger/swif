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
				self.highlight().always(function(){
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

		this.highlight().done();

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

	/** Prepare Modals
	*/
	displayModalDeleteTask: function(e){
		e.preventDefault();
		var name = this.model.toJSON().name;
		new app.Views.ModalDeleteView({el: '#modalDeleteTask', model: this.model, modalTitle: app.lang.viewsTitles.deleteTask, modalConfirm: app.lang.warningMessages.confirmDeleteTask});
	},

	displayModalTaskDone: function(e){
		var button = $(e.target);
		var self = this;
		// Retrieve the Task //
		if(!button.is('i')){
			this.selectedTask = this.collections.tasks.get(button.data('taskid'));
		}
		else{
			this.selectedTask = this.collections.tasks.get(button.parent().data('taskid'));	
		}

	

		// Display or nor the Remaining Time Section //
		if(button.hasClass('buttonNotFinish') || button.hasClass('iconButtonNotFinish')){
			$('#remainingTimeSection').show();
		}
		else{
			$('#remainingTimeSection').hide();
		}


		this.selectedTaskJSON = this.selectedTask.toJSON();
		//var intervention = this.collections.interventions.get(this.selectedTaskJSON.project_id[0]).toJSON();
		//var serviceInter = intervention.service_id;


		if( _.isUndefined(this.officersDropDownList) )
			this.officersDropDownList = new app.Collections.Officers( app.models.user.attributes.officers );
		if( _.isUndefined(this.teamsDropDownList) )
			this.teamsDropDownList = new app.Collections.Teams( app.models.user.attributes.teams );


		// Fill Officer List //
		app.views.selectListOfficersTeamsView = new app.Views.DropdownSelectListView({el: $('#selectUsersTeams'), collection: this.officersDropDownList})
		app.views.selectListOfficersTeamsView.clearAll();
		app.views.selectListOfficersTeamsView.addEmptyFirst();
		app.views.selectListOfficersTeamsView.addAll();


		// Set Task Informations //
		$('#infoModalTaskDone').children('p').html(this.selectedTaskJSON.name);
		$('#infoModalTaskDone').children('small').html('<i class="icon-pushpin"></i>&nbsp;' + this.selectedTaskJSON.project_id[1]);


		$("#startDate").val(  moment().format('L') );
		$("#endDate").val( moment().format('L') );

		// Set Task Planned Hour //
		$("#startHour").timepicker('setTime', moment().format('LT') );
		$("#endHour").timepicker('setTime', moment().add('hour', this.selectedTaskJSON.planned_hours).format('LT') );

		
//		// Filter Equipment by service on intervention's task //
		var task_id = this.selectedTask.id;
		
		// Search only vehicles //
		$.ajax({
			url: '/api/openstc/tasks/' + task_id.toString() + '/available_vehicles',
			
			success: function(data){
				// Fill equipment List //
				self.collections.vehicles = new app.Collections.Equipments(data);
				app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: $("#taskEquipmentDone"), collection: self.collections.vehicles})
				app.views.selectListEquipmentsView.clearAll();
				app.views.selectListEquipmentsView.addEmptyFirst();
				app.views.selectListEquipmentsView.addAll();
			}
		});
		
		// Search only materials //
		$('#equipmentsListDone').empty();
		$.ajax({
			url: '/api/openstc/tasks/' + task_id.toString() + '/available_equipments',
			success: function(data){
				// Display the remain materials //
				var nbRemainMaterials = 0;
				for(i in data){
					
					nbRemainMaterials++;
					$('#equipmentsListDone').append('<li id="equipment_'+data[i].id+'"><a href="#"><i class="icon-wrench"></i> '+ data[i].name + '-' + data[i].type + ' </a></li>');
				}
				$('#badgeNbEquipmentsDone').html(nbRemainMaterials);			
			}
		});
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