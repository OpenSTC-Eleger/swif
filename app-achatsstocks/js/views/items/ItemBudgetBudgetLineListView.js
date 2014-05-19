/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'requestModel',
	'modalRequestView',
	'modalValidRequestView',
	'modalRefuseRequestView',
	'modalConfirmRequestView'


], function(app, AppHelpers, RequestModel, ModalRequestView, ModalValidRequestView, ModalRefuseRequestView, ModalConfirmRequestView){

	'use strict';

	/******************************************
	* Row Budget View
	*/
	var ItemBudgetBudgetLineListView = Backbone.View.extend({

		tagName     : 'tr',

		templateHTML: '/templates/items/itemInterventionTaskList.html',


		// The DOM events //
		events       : {
			//'click .btn.addTask'      : 'displayModalAddTask',
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



		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang     : app.lang,
					budget   : self.model
				});

				$(self.el).html(template);

				$(self.el).addClass('row-nested-objects-collapse').attr('id','collapse_' + self.model.toJSON().id);
				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

				self.updateList();

				// Render tasks
				/*if (!_.isUndefined(self.tasksCollection)) {
					$('#row-nested-objects').empty();
					_.each(self.tasksCollection.models, function (task) {
						var itemInterventionTaskView = new ItemInterventionTaskView({model: task, inter:self.model, tasks:self.tasksCollection});
						$(self.el).find('#row-nested-objects').append(itemInterventionTaskView.render().el);
						self.listenTo(task, 'change', self.change);
						self.listenTo(task, 'destroy', self.destroyTask);
					});
				}*/

			});

			return this;
		},



		/** Fetch tasks
		*/
		fetchData: function () {
			var self = this;
			var deferred = $.Deferred();
			self.tasksCollection = new TasksCollection();
			if( self.model.get('todo_tasks')!== false && _.size(self.model.get('todo_tasks'))>0 ) {
				self.tasksCollection.fetch({silent: true,data: {filters: {0: {'field': 'id', 'operator': 'in', 'value': self.model.get('todo_tasks')}}}}).done(function(){
					deferred.resolve();
				});
			}
			return deferred;
		}


	});

	return ItemBudgetBudgetLineListView;

});