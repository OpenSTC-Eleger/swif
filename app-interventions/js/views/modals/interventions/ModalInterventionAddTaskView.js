/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'taskModel',
	'categoriesTasksCollection',
	'officersCollection',
	'teamsCollection',
	'claimersCollection',

	'genericModalView',
	'advancedSelectBoxView',
	'multiSelectBoxUsersView',

	'moment-timezone',
	'moment-timezone-data',
	'bsTimepicker',

], function(app, TaskModel, CategoriesTasksCollection, OfficersCollection, TeamsCollection, ClaimersCollection, GenericModalView, AdvancedSelectBoxView, MultiSelectBoxUsersView, moment){

	'use strict';


	/******************************************
	 * Intervention Details View
	 */
	var ModalInterventionAddTaskView = GenericModalView.extend({


		templateHTML: '/templates/modals/interventions/modalInterventionAddTask.html',


		// The DOM events //
		events: function() {
			return _.defaults({
				'submit #formAddTask'   : 'saveTask',
			},

			GenericModalView.prototype.events);
		},



		/** View Initialization
		 */
		initialize: function (params) {
			this.options = params;
			if( _.isUndefined( this.model )){
				this.model = new TaskModel();
			}
			this.modal = $(this.el);
			this.render();
		},


		/** Display the view
		 */
		render: function () {
			//self.collection = this.collection;
			var self = this;
			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData, {lang: app.lang});

				self.modal.html(template);
				self.modal.modal('show');

				$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});

				// Display only categories in dropdown belongs to intervention //
				var interJSON = self.options.inter.toJSON();
				app.views.advancedSelectBoxCategoriesInterventionAddTaskView = new AdvancedSelectBoxView({ el: $('#taskCategory'), url: CategoriesTasksCollection.prototype.url });

				if(interJSON.service_id.length > 0){
					app.views.advancedSelectBoxCategoriesInterventionAddTaskView.setSearchParam({field: 'service_ids.id',operator: '=','value': interJSON.service_id[0]}, true);
				}

				app.views.advancedSelectBoxCategoriesInterventionAddTaskView.render();
				
				// Create the view to select the user who have done the task //
				self.multiSelectBoxUsersView = new MultiSelectBoxUsersView({el: '.multiSelectUsers', serviceID: self.options.inter.getService('id')});
				self.multiSelectBoxUsersView.off().on('userType-change', function(){ self.serviceCostSection(); });
			});

			return this;
		},



		getIdInDopDown: function(view) {
			if( view && view.getSelected() ){
				return view.getSelected().toJSON().id;
			}
			else{
				return 0;
			}
		},



		/** Save the Task
		*/
		saveTask: function(e){
			var self = this;

			e.preventDefault();


			var duration = $('#taskHour').val().split(':');
			var mDuration = moment.duration ( { hours:duration[0], minutes:duration[1] });

			var params = {
				project_id: this.options.inter.toJSON().id,
				//equipment_id: input_equipment_id,
				name: this.$('#taskName').val(),
				category_id: app.views.advancedSelectBoxCategoriesInterventionAddTaskView.getSelectedItem(),
				planned_hours: mDuration.asHours(),
			};

			var res = self.multiSelectBoxUsersView.getUserType();
			if(res.type == TeamsCollection.prototype.key){
				params.user_id = false;
				params.partner_id = false;
				params.team_id = res.value;
			}
			else if(res.type == OfficersCollection.prototype.key){
				params.team_id = false;
				params.partner_id = false;
				params.user_id = res.value;
			}
			else if(res.type == ClaimersCollection.prototype.key){
				params.team_id = false;
				params.user_id = false;
				params.partner_id = res.value;
			}

			this.model.save(params, {silent: true}).done(function(data){
				self.model.setId(data, {silent: true});
				self.model.fetch().done(function(){
					if(!_.isUndefined(self.options.tasks)){
						self.options.tasks.add(self.model);
					}
				});

				//force re-calculation asynchronously of intervention to update functional fields (planned_hours for example)
				self.options.inter.fetch();
				$('#modalAddTask').modal('hide');
			})
			.fail(function(e){
				console.log(e);
			});
		},
		
		/** Function trigger when the user type change
		* If the user type == provider the field service cost price appear
		*/
		serviceCostSection: function(){
			var t = this.multiSelectBoxUsersView.getUserType();

			if(t.type == ClaimersCollection.prototype.key){
				$('#serviceCostSection').stop().slideDown();
			}
			else{
				$('#serviceCostSection').stop().slideUp();
			}

		}

	});

	return ModalInterventionAddTaskView;
});