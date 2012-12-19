/******************************************
* Requests List View
*/
app.Views.TaskDetailsView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'taskDetails',
	
	numberListByPage: 25,


    // The DOM events //
    events: {
    	'submit #formTask'			: 'saveTask',
    },

	

	/** View Initialization
	*/
	initialize: function (model, create) {
	    this.model = model;
	    this.create = create;
	    
	    this.model.bind('update:intervention', this.updateInter, this);
    },

	/** Display the view
	*/
    render: function () {
		var self = this;

		// Change the page title //
        app.router.setPageTitle(app.lang.viewsTitles.tasksDetail);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');
		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang: app.lang,
				task: self.model.toJSON(),
			});
			$(self.el).html(template);
		});

		$(this.el).hide().fadeIn('slow');
		
        return this;
    },
    
    updateInter: function (task) {
    	intervention = task.toJSON().intervention;
    	console.debug("BINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDINGBINDING");
    	
    	app.models.intervention.save(intervention.id, {state: 'toscheduled'}, null, null, "#taches");
    	
    	
    },
    
    /** Save the request
	 */
    saveTask: function (e) {
	     
    	e.preventDefault();
	    var self = this;
	    app.models.task.save(this.model.id, {name: this.$('#taskName').val()}, null, null, "#taches");
	    console.debug("SAVE REQUEST");
	    
	},


    preventDefault: function(event){
    	event.preventDefault();
    },

});