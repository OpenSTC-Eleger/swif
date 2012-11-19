/******************************************
* Requests List View
*/
openstm.Views.TasksView = Backbone.View.extend({
	
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
        //openstm.router.setPageTitle(openstm.lang.viewsTitles.requestsList);

        // Change the active menu item //
        //openstm.views.headerView.selectMenuItem(openstm.router.mainMenus.manageInterventions);

        // Change the Grid Mode of the view //
        //openstm.views.headerView.switchGridMode('fluid');


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
	  
			var template = _.template(templateData, {
				lang: openstm.lang,
				officer: openstm.models.user.toJSON(),

			});
		
			$(self.el).html(template);
			 self.initCalendar();

		});

	
		//$(this.el).hide().fadeIn('slow');
        return this;
    },

    	
    initCalendar: function() {
	
    		var self = this;
    		officer = openstm.models.user;  
    		officer_id = officer.get('uid');
	    	tasks = openstm.collections.tasks.getTasksByOfficer(officer_id);	    	
	    	self.events = self.getEvents(tasks.toJSON());
	    	new openstm.Views.EventsView(self,tasks,officer_id).render();
		    
	
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