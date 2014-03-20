/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'taskModel',

	'itemTaskDayView',
	'moment',

], function(app, AppHelpers, TaskModel, ItemTaskDayView, moment){

	'use strict';



	/******************************************
	* Row Intervention View
	*/
	var ItemTaskDayListView = Backbone.View.extend({

		tagName     : 'section',

		templateHTML: '/templates/items/itemTaskDayList.html',

		className   : 'panel panel-default',



		/** View Initialization
		*/
		initialize: function(params) {

			this.options = params;

			// When the model are updated //
			this.listenTo(this.options.tasks, 'change', this.change);
			this.listenTo(this.options.tasks, 'add', this.add);
			this.listenTo(this.options.tasks, 'remove', this.remove);

		},

		initTask: function(model){
			return new ItemTaskDayView({parentDayView: this, model: model, tasks: this.options.tasks});
		},

		//Add new model with other tasks of this day
		add: function(model){
			var newTaskView = this.initTask(model);
			this.accordion.find('tbody').append(newTaskView.render().el);
			AppHelpers.highlight($(newTaskView.el));
			this.partialRender();
		},
		//update global collection and do partialRender of this view
		remove: function(model){
			this.options.parentListView.collections.tasks.remove(model);
			this.partialRender();
		},
		//update global collection and do partialRender of this view
		change: function(model){
			this.options.parentListView.collections.tasks.add(model, {merge: true});
			this.partialRender();
		},

		displayTodayAccordion: function(){
			$(this.el).addClass('border-emphasize border-emphasize-info panel-info');
			this.accordion.addClass('in');
		},



		//Render only Badges and table or alert msg (according presence or not of tasks)
		partialRender: function(){
			//Display table if there is tasks, else display info msg
			if(this.options.tasks.length > 0){
				$(this.el).find('.alert').css('display','none');
				$(this.el).find('.table').css('display','table');
			}
			else{
				$(this.el).find('.alert').css('display','block');
				$(this.el).find('.table').css('display','none');
			}
			//get Nb of pending Tasks
			var pendingTasks = 0;
			_.each(this.options.tasks.models, function(task){
				if(task.toJSON().state == TaskModel.status.open.key){
					pendingTasks++;
				}
			});
			//If there is pending Tasks, we display it with badge, else, we let badge without html content (making it hidden)
			if(pendingTasks > 0){
				$(this.el).find('.badge.pendingTasks').html(pendingTasks.toString());
			}
			else{
				$(this.el).find('.badge.pendingTasks').html('');
			}
			$(this.el).find('.badge.nbTasks').html(this.options.tasks.length.toString());

		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang                    : app.lang,
					pendingTask				: self.options.tasks.length,
					day						: self.options.day
				});

				$(self.el).html(template);

				if(_.isUndefined(this.accordion)){
					self.accordion = $('#accordion_' + self.options.day.day());
				}

				//create itemTaskDay for each task of the day
				_.each(self.options.tasks.models, function(task){
					self.accordion.find('tbody').append(self.initTask(task).render().el);
				});

				self.partialRender();


				if(self.options.day.isSame(moment(), 'day')){
					self.displayTodayAccordion();
				}

			});
			$(this.el).hide().fadeIn('slow');
			return this;
		}


	});

	return ItemTaskDayListView;
});