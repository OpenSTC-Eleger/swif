/******************************************
* Requests List View
*/
app.Views.TasksView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'tasksListCheck',
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

		var nbTasks = _.size(app.collections.tasks);
		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
	  
			var template = _.template(templateData, {
				lang: app.lang,
				nbTasks: nbTasks,
				tasks: app.collections.tasks.toJSON(),

			});
		
			$(self.el).html(template);

		});

		$(this.el).hide().fadeIn('slow');
		
        return this;
    },




    preventDefault: function(event){
    	event.preventDefault();
    },




});