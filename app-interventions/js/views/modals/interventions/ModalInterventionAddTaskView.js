/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'taskModel',
	'categoriesTasksCollection',

	'genericModalView',
	'advancedSelectBoxView',

	'moment-timezone',
	'moment-timezone-data',
	'bsTimepicker',

], function(app, TaskModel, CategoriesTasksCollection, GenericModalView, AdvancedSelectBoxView, moment){

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
		}

	});

	return ModalInterventionAddTaskView;
});