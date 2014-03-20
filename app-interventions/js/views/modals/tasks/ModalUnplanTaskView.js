/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'genericModalView',
	'advancedSelectBoxView',

	'interventionModel',
	'taskModel',


], function(app, GenericModalView, AdvancedSelectBoxView, InterventionModel, TaskModel){


	'use strict';

	/******************************************
	* Place Modal View
	*/
	var modalUnplanTaskView =  GenericModalView.extend({


		templateHTML: '/templates/modals/tasks/modalUnplanTask.html',



		// The DOM events //
		events: function(){
			return _.defaults({
				'click #btnRemoveTask': 'removeTaskFromSchedule'
			},
				GenericModalView.prototype.events
			);
		},


		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			this.modal = $(this.el);

			// Intervention Model in the Left column //
			this.interModel = this.options.interModel;

			this.render();
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang     : app.lang,
					task     : self.model,
					TaskModel: TaskModel
				});

				self.modal.html(template);
				self.modal.modal('show');
			});

			return this;
		},


		/** Remove the Task from the Calendar
		*/
		removeTaskFromSchedule: function(e){

			var self = this;
			// Set the button in loading State //
			$(e.target).button('loading');

			//Cancel absent task (no intervention)
			if(( TaskModel.status[this.model.toJSON().state].key === TaskModel.status.absent.key ) ){
				this.model.destroy({wait: true})
				.done(function(){
					self.modal.modal('hide');
				})
				.fail(function(){
					console.error(e);
				})
				.always(function(){
					// Reset the button state //
					$(e.target).button('reset');
				});
			}
			//Template task unplanned
			else if(!_.isNull(this.interModel) && !_.isUndefined(this.interModel)  && ( InterventionModel.status[this.interModel.toJSON().state].key === InterventionModel.status.template.key ) ){

				//remove template task
				this.model.destroy({wait: true})
					.done(function(){
						//re-fetch intervention
						$.when(  self.interModel.fetch() )
							.done(function(){
								self.modal.modal('hide');
							});
					})
					.fail(function(){
						console.error(e);
					})
					.always(function(){
						// Reset the button state //
						$(e.target).button('reset');
					});
			}
			//others tasks to unplanned
			else
			{
				//Set Task fields
				var params = {
					state     : TaskModel.status.draft.key,
					user_id   : false,
					team_id   : false,
					date_end  : false,
					date_start: false,
				};
				//Update task and intervention
				this.model.save(params, {patch: true, silent: false})
					.done(function() {
						var ajaxRequests = [self.model.fetch({ data : {fields : self.model.fields} } )];

						if( !_.isUndefined(self.interModel) ){
							//Add ajax request for update intervention
							ajaxRequests.push(self.interModel.fetch());
						}

						$.when( ajaxRequests )
							.done(function(){
								self.modal.modal('hide');
							})
							.fail(function(e){
								console.error(e);
							});
					})
					.always(function(){
						// Reset the button state //
						$(e.target).button('reset');
					});
			}
		}


	});

	return modalUnplanTaskView;

});