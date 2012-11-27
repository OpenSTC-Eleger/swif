/******************************************
* Requests List View
*/
app.Views.TasksView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'tasksCheck',
	calendarView: 'agendaDay',


    // The DOM events //
    events: {
		//'click li.active'		: 'preventDefault',
		//'click li.disabled'		: 'preventDefault'
    },

	

	/** View Initialization
	*/
    initialize: function () {
		this.render();
    },



	/** Display the view
	*/
    render: function () {
		var self = this;

		// Change the page title //
        //app.router.setPageTitle(app.lang.viewsTitles.requestsList);

        // Change the active menu item //
        //app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

        // Change the Grid Mode of the view //
        //app.views.headerView.switchGridMode('fluid');


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
	  
			var template = _.template(templateData, {
				lang: app.lang,
				officer: app.models.user.toJSON(),

			});
		
			$(self.el).html(template);
			 self.initCalendar();

		});

	
		//$(this.el).hide().fadeIn('slow');
        return this;
    },

    	
    initCalendar: function() {
	
    		var self = this;
    		officer = app.models.user;  
    		officer_id = officer.get('uid');
	    	tasks = app.collections.tasks.getTasksByOfficer(officer_id);	    	
	    	self.events = self.getEvents(tasks.toJSON());
	    	new app.Views.EventsView(self,tasks,officer_id).render();
		    
	
    },
    
    getEvents: function(tasks) {
    	events = [];
    	_.each(tasks, function (task, i){
    		var event = { id: task.id, title: task.name, 
    		              start: task.date_start, end: task.date_end, 
    		              total_hours: task.total_hours,
    		              remaining_hours: task.remaining_hours,
    		              allDay:false};
    		events.push(event);
    	});
    	return events;
    },


    preventDefault: function(event){
    	event.preventDefault();
    },




});