/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'bsSwitch',

	'tasksCollection',

	'interventionModel',
	'itemPlanningInterTaskView',
	'modalInterventionAddTaskView',

], function(app, AppHelpers, bootstrapSwitch, TasksCollection, InterventionModel, ItemPlanningInterTaskView,  ModalInterventionAddTaskView){

	'use strict';


	/******************************************
	* Row Intervention Task List View
	*/
	var itemPlanningInterTaskListView = Backbone.View.extend({

		tagName     : 'tr',

		templateHTML : '/templates/items/itemPlanningInterTaskList.html',

		// The DOM events //
		events       : {
			'switch-change .calendarSwitch': 'scheduledInter',
			'click .btn.addTask'           : 'displayModalAddTask',
		},



		/** View Initialization
		*/
		initialize : function() {
		},


		/** When the model has updated //
		*/
		change: function(){
			var self = this;
			//Update Inter model
			self.model.fetch();
			AppHelpers.highlight($(this.el));
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang             : app.lang,
					intervention     : self.model.toJSON(),
					InterventionModel: InterventionModel
				});

				$(self.el).html(template);

				$('#switch-'+self.model.id).bootstrapSwitch();

				$(self.el).addClass('row-nested-objects-collapse').attr('id','collapse_' + self.model.toJSON().id);

				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

				// Render tasks
				if (!_.isUndefined(self.tasksCollection)) {
					$('#row-nested-objects').empty();
					_.each(self.tasksCollection.models, function (task) {
						var itemPlanningInterTaskView = new ItemPlanningInterTaskView({model: task});
						$(self.el).find('#row-nested-objects').append(itemPlanningInterTaskView.render().el);
						self.tasksCollection.off();
						self.listenTo(task, 'destroy', self.change);
						self.listenTo(task, 'change', self.change);
					});

				}
			});

			return this;
		},



		/** Fetch tasks
		*/
		fetchData: function () {
			var self = this;
			var deferred = $.Deferred();
			self.tasksCollection = new TasksCollection();
			if( self.model.get('tasks')!== false ) {
				self.tasksCollection.fetch({silent: true, data: {filters: {0: {'field': 'id', 'operator': 'in', 'value': self.model.get('tasks')}}}}).done(function(){
					deferred.resolve();
				});
			}
			return deferred;
		},



		/** To Plan/unplanned Intervention
		*/
		scheduledInter: function(e) {

			var intervention = $(e.target);
			//var id = _(intervention.parents('.accordion-body').attr('id')).strRightBack('_');

			var params = { state: InterventionModel.status.open.key, };

			// Retrieve the new status //
			if(intervention.bootstrapSwitch('state')){
				params = { state: InterventionModel.status.scheduled.key, };
			}

			this.model.save(params,{patch:true, wait: true}).done(function(){
				//self.model.fetch();
			})
			.fail(function(e){
				console.log(e);
			});
		},



		/** Display modal Add task
		*/
		displayModalAddTask: function(e){
			e.preventDefault();
			var self = this;
			new ModalInterventionAddTaskView({el: '#modalAddTask', inter: self.model});
		},

	});


	return itemPlanningInterTaskListView;

});