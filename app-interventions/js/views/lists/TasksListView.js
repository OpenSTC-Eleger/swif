/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'tasksCollection',
	'taskModel',
	'officersCollection',
	'officerModel',

	'genericListView',
	'paginationView',
	'advancedSelectBoxView',

	'itemTaskDayListView',
	'modalAddTaskView',
	'modalInterventionAddTaskView',
	'moment',

], function(app, AppHelpers, TasksCollection, TaskModel, OfficersCollection, OfficerModel, GenericListView, PaginationView, AdvancedSelectBoxView,ItemTaskDayListView, ModalAddTaskView, ModalInterventionAddTaskView, moment){

	'use strict';


	/******************************************
	* Task List View
	*/
	var TasksListView = GenericListView.extend({

		el : '#rowContainer',

		templateHTML: '/templates/lists/tasksList.html',

		filters: 'tasksListFilter',

		// The DOM events //
		events: {
			'click .btn.addTask'      : 'displayModalAddTask',
			'change #filterListAgents': 'setFilter',
			'click .linkNextWeek'     : 'goToNextWeek',
			'click .linkPreviousWeek' : 'goToPreviousWeek'
		},

		urlParameters: _.union(GenericListView.prototype.urlParameters, ['year','week']),

		/** View Initialization
		*/
		initialize: function (params) {
			var self = this;

			this.options = params;

			this.userManagableOfficers = [];

			// Get the Managable Officers of the connected user //
			var deferred = $.Deferred();
			deferred = app.current_user.queryManagableOfficers();

			deferred.done(function(){
				_.each(app.current_user.getOfficers(), function(item){
					self.userManagableOfficers.push(item.id);
				});

				app.router.render(self);
			});

		},


		partialRender: function(){

			var pendingTasks = 0;
			_.each(this.collections.tasks.models, function(task){
				if(task.toJSON().state === TaskModel.status.open.key){
					pendingTasks++;
				}
			});
			$('#globalBagePendingTask').html(pendingTasks.toString());

		},



		//listener to dispatch newly created task to corresponding Day
		addTask: function(model){
			var self = this;
			var modelJSON = model.toJSON();
			//get the moment() date_start of the new task
			var momentDateStart = moment(modelJSON.date_start);
			_.each(this.tasksUserFiltered, function(item){
				//if date_start match a corresponding day of current week, add it to collection
				if(item.day.week() == momentDateStart.week() && item.day.day() == momentDateStart.day()){
					item.tasks.add(model);
					self.partialRender();
				}
			});
		},

		//listener to dispatch newly created task to corresponding Day
		removeTask: function(){
			this.partialRender();
		},



		//listener to dispatch newly created task to corresponding Day
		changeTask: function(){
			this.partialRender();
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.tasksList);


			// Retrieve the year - If not exist in the URL set as the current year //
			var year = 0;
			var week = 0;
			if(_.isUndefined(this.options.year)){
				year = moment().year();
			}
			else{
				year = this.options.year;
			}

			// Retrieve the week of the year - - If not exist in the URL set as the current week ////
			if(_.isUndefined(this.options.week)){
				week = moment().week();
			}
			else{
				week = this.options.week;
			}

			var momentDate = moment().year(year).week(week);

			//get only tasks on the current week
			var filter = [{'field':'date_start','operator':'>=','value':momentDate.clone().weekday(0).format('YYYY-MM-DD 00:00:00')},{'field':'date_start','operator':'<=','value':momentDate.clone().weekday(6).format('YYYY-MM-DD 23:59:59')}];
			//Get Selected Agent in filters
			var agent = AppHelpers.getFilterValue(self.options.filter,'user_id');
			//  Collection Task Filter if not null //
			if(!_.isUndefined(agent)){
				filter.push({field: 'user_id.id', operator: 'in', value: [agent.value[0]]});
			}

			//check sort parameter
			if(_.isUndefined(this.options.sort)){
				this.options.sort = TasksCollection.prototype.default_sort;
			}

			self.collections = {};
			self.collections.tasks = new TasksCollection();


			//get taskUser filtered on current week and with optional filter
			$.ajax({
				url: '/api/open_object/users/' + app.current_user.getUID().toString() + '/scheduled_tasks',
				type:'GET',
				data: app.objectifyFilters({'filters':app.objectifyFilters(filter),'fields':self.collections.tasks.fields}),
				success: function(data){
					self.collections.tasks = new TasksCollection(data);
					self.listenTo(self.collections.tasks, 'add', self.addTask);
					self.listenTo(self.collections.tasks, 'remove', self.removeTask);
					self.listenTo(self.collections.tasks, 'change', self.changeTask);

					// Create table for each day //
					var mondayTasks = new TasksCollection();
					var tuesdayTasks = new TasksCollection();
					var wednesdayTasks = new TasksCollection();
					var thursdayTasks = new TasksCollection();
					var fridayTasks = new TasksCollection();
					var saturdayTasks = new TasksCollection();
					var sundayTasks = new TasksCollection();

					var nbPendingTasks = 0;

					// Fill the tables with the tasks //
					_.each(self.collections.tasks.toJSON(), function(task){
						if(momentDate.clone().isSame(task.date_start, 'week')){
							if(momentDate.clone().day(1).isSame(task.date_start, 'day')){
								mondayTasks.add(task);
							}
							else if(momentDate.clone().day(2).isSame(task.date_start, 'day')){
								tuesdayTasks.add(task);
							}
							else if(momentDate.clone().day(3).isSame(task.date_start, 'day')){
								wednesdayTasks.add(task);
							}
							else if(momentDate.clone().day(4).isSame(task.date_start, 'day')){
								thursdayTasks.add(task);
							}
							else if(momentDate.clone().day(5).isSame(task.date_start, 'day')){
								fridayTasks.add(task);
							}
							else if(momentDate.clone().day(6).isSame(task.date_start, 'day')){
								saturdayTasks.add(task);
							}
							else if(momentDate.clone().day(7).isSame(task.date_start, 'day')){
								sundayTasks.add(task);
							}

							// Retrieve the number of Open Task //
							if(task.state == TaskModel.status.open.key){
								nbPendingTasks++;
							}

						}
						// Hack for Sunday Task //
						else {

							if( momentDate.clone().day(7).isSame(task.date_start, 'day') ){
								sundayTasks.add(task);

								// Retrieve the number of Open Task //
								if(task.state == TaskModel.status.open.key){
									nbPendingTasks++;
								}
							}
						}
					});

					self.tasksUserFiltered = [
						{'day': momentDate.clone().day(1), 'tasks': mondayTasks},
						{'day': momentDate.clone().day(2), 'tasks': tuesdayTasks},
						{'day': momentDate.clone().day(3), 'tasks': wednesdayTasks},
						{'day': momentDate.clone().day(4), 'tasks': thursdayTasks},
						{'day': momentDate.clone().day(5), 'tasks': fridayTasks},
						{'day': momentDate.clone().day(6), 'tasks': saturdayTasks},
						{'day': momentDate.clone().day(7), 'tasks': sundayTasks}
					];



					// Retrieve the template //
					$.get(app.menus.openstc+self.templateHTML, function(templateData){

						// Display the filter if the connected user don't have managable Officers //
						var displayFilter = true;
						if(_.isEmpty(self.userManagableOfficers)){
							displayFilter = false;
						}


						var template = _.template(templateData, {
							lang          : app.lang,
							nbPendingTasks: nbPendingTasks,
							momentDate    : momentDate,
							displayFilter : displayFilter
						});

						$(self.el).html(template);

						// Set the Tooltip //
						$('*[data-toggle="tooltip"]').tooltip({container: 'body'});


						//display all seven days of the selected week
						_.each(self.tasksUserFiltered, function(dayTasks){

							var params = { day: dayTasks.day, tasks: dayTasks.tasks, parentListView: self };

							$('#task-accordion').append(new ItemTaskDayListView(params).render().el);
						});


						self.selectListFilterOfficerView = new AdvancedSelectBoxView({ el: $('#filterListAgents'), url: OfficersCollection.prototype.url });
						self.selectListFilterOfficerView.setSearchParam({field: 'id',operator: 'in', value: self.userManagableOfficers}, true);
						self.selectListFilterOfficerView.render();


						//  DropDown Filter set Selected //
						if(!_.isUndefined(agent)){
							$('label[for="filterListAgents"]').removeClass('muted');
							var modelUser = new OfficerModel();
							modelUser.set('id', agent.value[0]);
							modelUser.fetch({silent:true, fields: ['name']}).done(function(){
								self.selectListFilterOfficerView.setSelectedItem([modelUser.toJSON().id, modelUser.toJSON().name]);
							});
						}


						// Set the focus to the first input of the form //
						$('#modalTaskDone, #modalAddTask, #modalTimeSpent').on('shown', function() {
							$(this).find('input, textarea').first().focus();
						});

						$(self.el).hide().fadeIn();
					});

				}
			});

			return this;
		},



		/** Display the form to add a new Task
		*/
		displayModalAddTask: function(){
			new ModalAddTaskView({ el:'#modalAddTask', tasks: this.collections.tasks });
		},



		/** Filter Request
		*/
		setFilter: function(event){
			event.preventDefault();

			var filterValue = this.selectListFilterOfficerView.getSelectedItem();

			// Set the filter in the local Storage //
			if(filterValue !== ''){
				this.options.filter = [{field: 'user_id', operator:'in', value:[filterValue]}];
			}
			else{
				delete this.options.filter;
			}

			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});

		},


		goToPreviousWeek: function(event){
			event.preventDefault();
			//get currentDate and substract week by 1 (use moment to manage cases when we must change the year)
			var year = this.options.year;
			if(_.isUndefined(this.options.year)){
				year = moment().year();
			}
			var week = this.options.week;
			if(_.isUndefined(this.options.week)){
				week = moment().week();
			}
			//apply year and week changes to options and launch urlBuid to update view
			var momentDate = moment().year(year).week(week).subtract('weeks',1);
			this.options.year = momentDate.year();
			this.options.week = momentDate.week();

			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});

		},



		goToNextWeek: function(event){
			event.preventDefault();
			//get currentDate and substract week by 1 (use moment to manage cases when we must change the year)
			var year = this.options.year;
			if(_.isUndefined(this.options.year)){
				year = moment().year();
			}
			var week = this.options.week;
			if(_.isUndefined(this.options.week)){
				week = moment().week();
			}
			//apply year and week changes to options and launch urlBuid to update view
			var momentDate = moment().year(year).week(week).add('weeks',1);
			this.options.year = momentDate.year();
			this.options.week = momentDate.week();

			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
		},

	});

	return TasksListView;

});