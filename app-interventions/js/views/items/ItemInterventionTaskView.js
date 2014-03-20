/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'interventionModel',
	'taskModel',
	'requestModel',

	'modalDeleteView',
	'modalCancelTaskView',
	'modalTaskDoneView',
	'moment',

], function(app, AppHelpers, InterventionModel, TaskModel, RequestModel, ModalDeleteView, ModalCancelTaskView, ModalTaskDoneView, moment){

	'use strict';


	/******************************************
	* Row Intervention Task View
	*/
	var ItemInterventionTaskView = Backbone.View.extend({

		tagName     : 'tr',

		templateHTML : '/templates/items/itemInterventionTask.html',

		className   : 'row-nested-objects',

		// The DOM events //
		events       : {

			'click a.modalDeleteTask'                : 'displayModalDeleteTask',

			'click a.buttonCancelTask'               : 'displayModalCancelTask',

			'click a.printTask'                      : 'print',

			'click .buttonTaskDone, .buttonNotFinish': 'displayModalTaskDone',
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'sync', this.change);
			this.listenTo(this.model, 'destroy', this.destroyTask);
			this.inter = this.options.inter;
			this.tasks = this.options.tasks;
		},

		destroyTask: function(model){
			var self = this;
			self.remove();
			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.taskDeleteOk);
		},

		/** When the model ara updated //
		*/
		change: function(){

			this.render();

			AppHelpers.highlight($(this.el));

			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.taskUpdateOk);
		},


		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang              : app.lang,
					interventionsState: InterventionModel.status,
					tasksState        : TaskModel.status,
					task              : self.model.toJSON(),
					AppHelpers        : AppHelpers,
					moment            : moment
				});

				$(self.el).html(template);

				// Set the Tooltip / Popover //$(self.el).html(template);
				$('*[data-toggle="tooltip"]').tooltip();
				$('*[rel="popover"]').popover({trigger: 'hover'});

				// Set the focus to the first input of the form //
				$('#modalDeleteTask, #modalAddTask, #modalCancelTask').on('shown', function() {
					$(this).find('input, textarea').first().focus();
				});

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

			var selectedTaskJSON = this.model.toJSON();

			// Get the inter of the Task //
			var inter = app.views.interventions.collection.get(selectedTaskJSON.project_id[0]);
			var interJSON = inter.toJSON();

			// Hide the print Inter section //
			$('#printTask div.forInter').hide();
			$('#printTask div.forTask').show();
			$('.field').html('');

			$('#taskLabel').html(selectedTaskJSON.name + ' <em>('+selectedTaskJSON.category_id[1]+')</em>');
			$('#taskPlannedHour').html(AppHelpers.decimalNumberToTime(selectedTaskJSON.planned_hours, 'human'));

			var deferred = $.Deferred();
			deferred.always(function(){
				$('#interName').html(interJSON.name);
				$('#interDescription').html(interJSON.description);
				$('#interService').html(!interJSON.service_id?'':interJSON.service_id[1]);

				//$('#interDateCreate').html(moment(interJSON.create_date).format('LL'));
				console.info(interJSON);
				console.log(interJSON);
				/*if(interJSON.date_deadline != false){
					$('#interDeadline').html(' / ' + moment(interJSON.date_deadline).format('LL'));
				}*/
				if(interJSON.has_equipment){
					//display location (openstc.site) info
					//$('#printPlaceLabel').css({display:'inline-block'});
					$('#interPlace').css({display:'inline-block'});

					//fill data with equipment and location
					$('#interPlaceOrEquipment').html(interJSON.equipment_id[1]);
					$('#interPlace').html(interJSON.site1[1]);
					//$('#printPlaceOrEquipmentLabel').html(app.lang.equipmentOrVehicle + ':');
					//$('#printPlaceLabel').html(app.lang.location + ':');

				}
				else{
					//hide location info (keeping only site info on placeOrEquipment field)
					//$('#printPlaceLabel').css({display:'none'});
					$('#interPlace').css({display:'none'});

					//fill data of site1
					$('#interPlaceOrEquipment').html(interJSON.site1[1]);
					//$('#printPlaceOrEquipmentLabel').html(app.lang.place + ':');
				}

				$('#interPlaceMore').html(interJSON.site_details);

				$('#printTask').printElement({
					leaveOpen	: true,
					printMode	: 'popup',
					overrideElementCSS:[
						{ href:'style/vendors/print_table.css', media: 'all'}
					]
				});
			});
			if(!interJSON.ask_id){

				$('#claimentName').html(interJSON.create_uid[1]);
				deferred.resolve();
			}else{
				//retrieve ask associated, if exist
				var ask = new RequestModel();
				ask.setId(interJSON.ask_id[0]);
				ask.fetch().done(function(){
					var askJSON = ask.toJSON();
					if(askJSON.partner_id !== false){
						$('#claimentName').html(askJSON.partner_id[1]+' - '+ !askJSON.partner_address?'':askJSON.partner_address[1]);
						$('#claimentPhone').html(askJSON.partner_phone);

					}
					else{
						$('#claimentName').html(askJSON.people_name);
						$('#claimentPhone').html(askJSON.people_phone);
					}

					if(!_.isUndefined(askJSON.partner_type) && askJSON.partner_type !== false){
						$('#claimentType').html(askJSON.partner_type[1]);
					}
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
			new ModalDeleteView({el: '#modalDeleteTask', model: this.model, modalTitle: app.lang.viewsTitles.deleteTask, modalConfirm: app.lang.warningMessages.confirmDeleteTask});
		},


		displayModalTaskDone: function(e){
			e.preventDefault();
			var button = $(e.target);

			var taskDone;
			// Display or nor the Remaining Time Section //
			if(button.hasClass('buttonNotFinish') || button.hasClass('iconButtonNotFinish')){
	//			$('#remainingTimeSection').show();
				taskDone = false;
			}
			else{
				taskDone = true;
	//			$('#remainingTimeSection').hide();
			}
			new ModalTaskDoneView({el:'#modalTaskDone', model: this.model, inter: this.inter, taskDone: taskDone, tasks: this.tasks});
		},


		displayModalCancelTask: function(e) {
			e.preventDefault();
			new ModalCancelTaskView({el: '#modalCancelTask', model: this.model, inter:this.inter});
		}

	});

	return ItemInterventionTaskView;
});
