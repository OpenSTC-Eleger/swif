/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'taskModel',

	'tasksCollection',

	'itemInterventionTaskView',
	'modalInterventionAddTaskView'

], function(app, AppHelpers, TaskModel, TasksCollection, ItemInterventionTaskView, ModalInterventionAddTaskView){

	'use strict';


	/******************************************
	* Row Intervention Task List View
	*/
	var ItemInterventionTaskListView = Backbone.View.extend({

		tagName     : 'tr',

		templateHTML: '/templates/items/itemInterventionTaskList.html',


		// The DOM events //
		events       : {
			'change .taskEquipment'   : 'fillDropdownEquipment',
			'click .btn.addTask'      : 'displayModalAddTask',
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
			this.partialRender();
		},

		addTask: function(model){
			var itemTaskView  = new ItemInterventionTaskView({ model: model, inter:this.model, tasks:this.tasksCollection});
			$(this.el).find('#row-nested-objects').append(itemTaskView.el);
			this.tasksCollection.add(model);
			this.listenTo(model, 'change', this.change);
			this.listenTo(model, 'destroy', this.destroyTask);
			this.partialRender();
		},

		destroyTask: function(model){
			this.tasksCollection.remove(model);
			//check if there is tasks, if not, display message infos instead of table
			this.change();
		},

		updateList: function(){
			if(_.size(this.tasksCollection) === 0){
				$(this.el).find('.noTask').css({display:'block'});
				$(this.el).find('.table-nested-objects').css({display: 'none'});
			}
			else{
				$(this.el).find('.noTask').css({display: 'none'});
				$(this.el).find('.table-nested-objects').css({display: 'table'});
			}
		},

		/** Display the view
		*/
		partialRender: function(){
			this.updateList();
			if(this.model.toJSON().actions.indexOf('add_task') === -1){
				$('button.addTask').attr('disabled','disabled');
			}
		},



		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang                : app.lang,
					intervention		: self.model.toJSON(),
				});

				$(self.el).html(template);

				$(self.el).addClass('row-nested-objects-collapse').attr('id','collapse_' + self.model.toJSON().id);
				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

				self.updateList();

				// Render tasks
				if (!_.isUndefined(self.tasksCollection)) {
					$('#row-nested-objects').empty();
					_.each(self.tasksCollection.models, function (task) {
						var itemInterventionTaskView = new ItemInterventionTaskView({model: task, inter:self.model, tasks:self.tasksCollection});
						$(self.el).find('#row-nested-objects').append(itemInterventionTaskView.render().el);
						self.listenTo(task, 'change', self.change);
						self.listenTo(task, 'destroy', self.destroyTask);
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
				self.tasksCollection.fetch({silent: true,data: {filters: {0: {'field': 'id', 'operator': 'in', 'value': self.model.get('tasks')}}}}).done(function(){
					deferred.resolve();
				});
			}
			return deferred;
		},



		/** Add task
		*/
		displayModalAddTask: function(e){
			e.preventDefault();
			var task = new TaskModel();
			this.listenTo(task, 'sync', this.addTask);
			new ModalInterventionAddTaskView({el: '#modalAddTask',  model : task, inter: this.model});
		}

	});

	return ItemInterventionTaskListView;
});