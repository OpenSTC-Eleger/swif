/******************************************
* Task List View
*/
app.Views.TasksListView = Backbone.View.extend({
	
	el : '#rowContainer',

	templateHTML: 'tasksList',

	filters: 'tasksListFilter',

	numberListByPage: 25,


	// The DOM events //
	events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',
		'click ul.sortable li'			: 'preventDefault',
		
		'click .btn.addTask'            : 'displayModalAddTask',
		
		'change #filterListAgents' 		: 'setFilter'


	},

	/** View Initialization
	*/
	initialize: function () {

	},
	
	partialRender: function(){
		
		var pendingTasks = 0;
		_.each(this.collections.tasks.models, function(task, i){
			if(task.toJSON().state == app.Models.Task.status.open.key){
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
		_.each(this.tasksUserFiltered, function(item, i){
			//if date_start match a corresponding day of current week, add it to collection
			if(item.day.week() == momentDateStart.week() && item.day.day() == momentDateStart.day()){
				item.tasks.add(model);
				self.partialRender();
			}
		});
	},
	
	//listener to dispatch newly created task to corresponding Day
	removeTask: function(model){
		this.partialRender();
	},
	
	//listener to dispatch newly created task to corresponding Day
	changeTask: function(model){
		this.partialRender();
	},

	/** Display the view
	*/
	render: function () {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.tasksList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');

		//var officer = app.models.user.getUID();
		var officer_id = app.models.user.getUID();
		
		// Retrieve the year - If not exist in the URL set as the current year //
		if(_.isNull(this.options.yearSelected)){
			yearSelected = moment().year();
		}
		else{
			yearSelected = this.options.yearSelected;	
		}

		// Retrieve the week of the year - - If not exist in the URL set as the current week ////
		if(_.isNull(this.options.weekSelected)){
			weekSelected = moment().week();
		}
		else{
			weekSelected = this.options.weekSelected;
		}

		var momentDate = moment().year(yearSelected).week(weekSelected);

		//get only tasks on the current week
		var filter = [{'field':'date_start','operator':'>=','value':momentDate.clone().weekday(1).format('YYYY-MM-DD 00:00:00')},{'field':'date_start','operator':'<=','value':momentDate.clone().weekday(6).format('YYYY-MM-DD 23:59:59')}];
		
		
		//  Collection Task Filter if not null //
		if(sessionStorage.getItem(this.filters) != null){
			filter.push({'field':'user_id.id','operator':'=','value':sessionStorage.getItem(self.filters)});
		}
		
		self.collections = {};
		self.collections.tasks = new app.Collections.Tasks();
		
		
		//get taskUser filtered on current week and with optional filter in sessionStorage
		$.ajax({
			url: '/api/open_object/users/' + app.models.user.getUID().toString() + '/scheduled_tasks',
			type:'GET',
			data: app.objectifyFilters({'filters':app.objectifyFilters(filter),'fields':self.collections.tasks.fields}),	
			success: function(data){
				self.collections.tasks = new app.Collections.Tasks(data);
				self.listenTo(self.collections.tasks, 'add', self.addTask);
				self.listenTo(self.collections.tasks, 'remove', self.removeTask);
				self.listenTo(self.collections.tasks, 'change', self.changeTask);
				$.when(
					//app.collections.equipments.fetch(),
					//app.collections.categoriesTasks.fetch()
				)
				.done(function(){
					
					// Create table for each day //
					var mondayTasks = new app.Collections.Tasks(); 	var tuesdayTasks =new app.Collections.Tasks();
					var wednesdayTasks = new app.Collections.Tasks(); var thursdayTasks =new app.Collections.Tasks();
					var fridayTasks = new app.Collections.Tasks(); 	var saturdayTasks =new app.Collections.Tasks(); 
					var sundayTasks =new app.Collections.Tasks();
	
					var nbPendingTasks = 0;
	
					// Fill the tables with the tasks //
					_.each(self.collections.tasks.toJSON(), function(task, i){
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
							if(task.state == app.Models.Task.status.open.key){
								nbPendingTasks++;
							}
	
						}
						// Hack for Sunday Task //
						else {
	
							if( momentDate.clone().day(7).isSame(task.date_start, 'day') ){					
								sundayTasks.add(task);
	
								// Retrieve the number of Open Task //
								if(task.state == app.Models.Task.status.open.key){
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
					$.get("templates/" + self.templateHTML + ".html", function(templateData){
	
	
						var officersDropDownList = new app.Collections.Officers( app.models.user.attributes.officers );
		
						var template = _.template(templateData, {
							lang: app.lang,
							nbPendingTasks: nbPendingTasks,
							momentDate: momentDate,
							displayFilter: _.size(officersDropDownList) > 0
						});
						
						$(self.el).html(template);
						
						//display all seven days of the selected week
						_.each(self.tasksUserFiltered, function(dayTasks, i){
							$('#task-accordion').append(new app.Views.ItemTaskDayListView({day: dayTasks.day, tasks: dayTasks.tasks, parentListView: self}).render().el);
						});
	
						if(officersDropDownList != null){
							app.views.selectListFilterOfficerView = new app.Views.DropdownSelectListView({el: $("#filterListAgents"), collection: officersDropDownList})
							app.views.selectListFilterOfficerView.clearAll();
							app.views.selectListFilterOfficerView.addEmptyFirst();
							app.views.selectListFilterOfficerView.addAll();
						}
	
						// Collapse border style //
						$('.accordion-toggle').click(function(){
							if($(this).parents('.accordion-group').hasClass('collapse-selected')){
								$(this).parents('.accordion-group').removeClass('collapse-selected');
							}else{
								$(this).parents('.accordion-group').addClass('collapse-selected');	
							}
			    		})
	
	
			    		//  DropDown Filter set Selected //
						if(sessionStorage.getItem(self.filters) != null){
							$('label[for="filterListAgents"]').removeClass('muted');
							app.views.selectListFilterOfficerView.setSelectedItem(sessionStorage.getItem(self.filters));
						}
	
	
			    		// Set the focus to the first input of the form //
						$('#modalTaskDone, #modalAddTask, #modalTimeSpent').on('shown', function (e) {
							$(this).find('input, textarea').first().focus();
						})
						$(self.el).hide().fadeIn();
					});
				})
				.fail(function(e){
					console.error(e);
				});
                               
                              
			},
			error: function(code){

			}
		});

		return this;
	},		

	/** Display the form to add a new Task
	*/
	displayModalAddTask: function(e){
		new app.Views.ModalAddTaskView({el:'#modalAddTask',tasks: this.collections.tasks});

	},

	/** Filter Tasks
	*/
	setFilter: function(event){
		event.preventDefault();

		var filterValue = $(event.target).val();

		// Set the filter in the local Storage //
		if(filterValue != ''){
			sessionStorage.setItem(this.filters, filterValue);
		}
		else{
			sessionStorage.removeItem(this.filters);
		}

		this.render();
	},

	preventDefault : function(event) {
		event.preventDefault();
	},

});