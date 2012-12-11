/******************************************
* Requests List View
*/
app.Views.TasksView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'tasksListCheck',
	
	numberListByPage: 25,
	
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
        app.router.setPageTitle(app.lang.viewsTitles.tasksList);

        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var tasks = app.collections.tasks.models;
		var len = tasks.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);
		
        // Retrieve the number of validated Interventions //
        var tasksPending = _.filter(tasks, function(item){ 
        	return item.attributes.state == app.Models.Task.state[2].value; 
        });
        var nbTasks = _.size(tasksPending);
		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
	  
			var template = _.template(templateData, {
				lang: app.lang,
				nbTasks: nbTasks,
				tasks: (new app.Collections.Tasks(tasksPending)).toJSON(),
				requestsState: app.Models.Task.state,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,

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