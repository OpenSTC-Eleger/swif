/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'moment-timezone',
	'moment-timezone-data',

	'taskModel',
	'userModel',
	'interventionModel',
	'taskRecurrenceModel',
	
	'modalDeleteView',
	'modalCancelTaskView',
	'modalRecurrenceTaskView',

], function(app, AppHelpers, moment , MomentTimezoneData, TaskModel, UserModel, InterventionModel, TaskRecurrenceModel, ModalDeleteView, ModalCancelTaskView, ModalRecurrenceTaskView){

	'use strict';


	/******************************************
	* Row Intervention Task View
	*/
	var itemPlanningInterTaskView = Backbone.View.extend({

		tagName     : 'li',

		templateHTML : '/templates/items/itemPlanningInterTask.html',

		className   : function(){
			var elementClass = 'external-event';

			if(this.model.getState() != TaskModel.status.draft.key){
				elementClass += ' disabled';
			}

			if(this.model.getState() == TaskModel.status.done.key ) {
				elementClass += ' isCheck';
			}

			return elementClass;
		},

		// The DOM events //
		events       : {

			'click a.modalDeleteTask'    : 'displayModalDeleteTask',
			'click a.buttonCancelTask'   : 'displayModalCancelTask',
			'click a.modalRecurrenceDetails'		: 'displayModalRecurrenceDetails'
		},

		/** View Initialization
		*/
		initialize : function() {
			this.model.off();
			this.id = this.model.id;

			//this.listenTo(this.model, 'change', this.change);
			this.listenTo(this.model, 'destroy', this.destroyTask);
		},

		destroyTask: function(model){
			//remove model
			this.remove();
			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.taskDeleteOk);
		},

		/** When the model ara updated //
		*/
		change: function(){
			this.render();

			AppHelpers.highlight($(this.el));

		},


		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var model = self.model.toJSON();

				var template = _.template(templateData, {
					lang               : app.lang,
					task               : model,
					TaskModel          : TaskModel,
					taskClass          : self.getIconClass(),
					recurrenceClass    : model.recurrence_id ? 'fa fa-refresh' : '',
					dataOriginalTitle  : self.getDataOriginalTitle(),
					AppHelpers         : AppHelpers,
				});

				$(self.el).html(template);

				// Set the Tooltip / Popover //$(self.el).html(template);
				$('*[data-toggle="tooltip"]').tooltip();
				$('*[rel="popover"]').popover({trigger: 'hover'});

				//Ask update modals
				$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
				$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });

				$('#equipmentsDone, #equipmentsListDone').sortable({
					connectWith         : 'ul.sortableEquipmentsList',
					dropOnEmpty         : true,
					forcePlaceholderSize: true,
					forceHelperSize     : true,
					placeholder         : 'sortablePlaceHold',
					containment         : '.equipmentsDroppableAreaDone',
					cursor              : 'move',
					opacity             : '.8',
					revert              : 300,
					receive: function(){
					}

				});

				// Set the focus to the first input of the form //
				$('#modalDeleteTask, #modalTask, #modalCancelTask').on('shown', function() {
					$(this).find('input, textarea').first().focus();
				});

				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });


				//Add draggable task if not planned yet
				if( !$(self.el).hasClass('disabled') ) {
					var el = $(self.el);

					var eventObject = {
						state          : model.state,
						id             : model.id,
						title          : model.name,
						project_id     : model.project_id[0],
						planned_hours  : model.planned_hours,
						total_hours    : model.total_hours,
						effective_hours: model.effective_hours,
						remaining_hours: model.remaining_hours,
					};

					// Store the Event Object in the DOM element so we can get to it later //
					el.data('eventObject', eventObject);

					// Make the event draggable using jQuery UI //
					el.draggable({
						zIndex        : 9999,
						//revert      : true,
						revert        : false,
						revertDuration: 500,
						appendTo      : '#app',
						opacity       : 0.8,
						scroll        : false,
						cursorAt      : { top: 0, left: 0 },
						helper: function(){
							return $('<p class="well well-sm">'+eventObject.title+'</p>');
						},
						reverting: function() {
							console.log('reverted');
						},
					});
				}
			});
			return this;
		},

		/**
		 * Get Icon class (it depends on state value)
		 */
		getIconClass: function() {
			var taskClass ='';
			if (this.model.affectedTo()!==false) {
				taskClass ='fa ' + this.model.affectedTo('logo');
			}
			else if( this.model.getState()==TaskModel.status.draft.key) {
				taskClass ='fa fa-chevron-right';
			}
			else if(this.model.getState()==TaskModel.status.open.key){
				taskClass ='fa fa-clock-o';
			}
			return taskClass;
		},


		/** Adapts Title class
		*/
		getDataOriginalTitle: function() {
			var dateStart = this.model.getDateStart();
			if( dateStart!==false ) {
				dateStart = moment(dateStart).tz(app.current_user.getContext().tz);
				dateStart.add('minutes',-dateStart.zone());
			}
			var dataOriginalTitle = '';
			if( dateStart!==false ){
				dataOriginalTitle = dateStart.format('LLL');
			}
			
			if( _.isBlank(dataOriginalTitle) ){
				dataOriginalTitle = this.model.affectedTo()?this.model.affectedTo():'';
			}
			else{
				dataOriginalTitle +=  ' - ' +  this.model.affectedTo();
			}
			return dataOriginalTitle;
		},


		/** Display modal Add to delete task
		*/
		displayModalDeleteTask: function(e){
			e.preventDefault();
			new ModalDeleteView({el: '#modalDeleteTask', model: this.model, modalTitle: app.lang.viewsTitles.deleteTask, modalConfirm: app.lang.warningMessages.confirmDeleteTask});
		},



		/** Display modal Add to cancel task
		*/
		displayModalCancelTask: function(e) {
			e.preventDefault();
			new ModalCancelTaskView({el: '#modalCancelTask', model: this.model});
		},
		
		displayModalRecurrenceDetails: function(e){
			e.preventDefault();
			new ModalRecurrenceTaskView({
				el:'#modalRecurrenceDetails',
				model: new TaskRecurrenceModel({id:this.model.getAttribute('recurrence_id',[false,''])[0]})
			});
		}


	});


	return itemPlanningInterTaskView;

});