/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'genericModalView',
	'modalRecurrenceTaskItemView',
	
	'taskRecurrenceModel',
	'tasksCollection',
	
	'moment',
	'moment-timezone',
	'moment-timezone-data'

], function(app, GenericModalView, ModalRecurrenceTaskItemView, TaskRecurrenceModel, TasksCollection){

	'use strict';



	/******************************************
	* Intervention Details View
	*/
	var ModalInterventionRecurrenceTaskView = GenericModalView.extend({


		templateHTML: '/templates/modals/interventions/modalTaskRecurrence.html',


		// The DOM events //
		events: function() {
			return _.defaults({
				
			},
			GenericModalView.prototype.events);

		},



		/** View Initialization
		 */
		initialize: function (params) {
			this.options = params;
			this.modal = $(this.el);
			var self = this;
			if(_.isUndefined(this.model)){
				this.model = new TaskRecurrenceModel();
			}
			this.tasksCollection = new TasksCollection();
			this.model.fetch().done(function(){
				self.tasksCollection.fetch({data: {filters: {1: {field:'recurrence_id.id', operator:'=', value:self.model.get('id')}}}
				}).done(function(){
					self.render();
				});
			});
		},


		/** Display the view
		 */
		render: function () {

			var self = this;
			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang: app.lang,
					recurrence: self.model
				});
				
				self.modal.html(template);
				
				self.tasksCollection.each(function(task){
					var itemView = new ModalRecurrenceTaskItemView({model:task});
					$('.tasks-items').append(itemView.el);
				});
				
				self.modal.modal('show');
				
			});

			return this;
		}
	});
	return ModalInterventionRecurrenceTaskView;
});