/******************************************
* Requests List View
*/
app.Views.TasksListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'tasksListCheck',
	
	numberListByPage: 25,


    // The DOM events //
    events: {
    	'click a.taskDone' 		: 'taskDone',
    	'click a.taskNotDone' 	: 'taskNotDone'
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


		var officer = app.models.user;  
		var officer_id = officer.get('uid');
    	var tasks = app.collections.tasks.getTasksByOfficer(officer_id);
    	
        // Retrieve the number of validated Interventions //
        var tasksPending = _.filter(tasks.models, function(item){ 
        	return item.attributes.state == app.Models.Task.state[2].value; 
        });
        var nbTasks = _.size(tasksPending);
        
		//var tasks = app.collections.tasks.models;
		var len = nbTasks;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);
		
	  
		

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
	  
			var template = _.template(templateData, {
				lang: app.lang,
				nbTasks: nbTasks,
				tasks: (new app.Collections.Tasks(tasksPending)).toJSON(),
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,

			});
		
			$(self.el).html(template);

		});

		$(this.el).hide().fadeIn('slow');
		
        return this;
    },
    
    getTask: function(e) {
		var href = $(e.target);

		// Retrieve the ID of the request //	
		this.pos = href.parents('tr').attr('id');
		this.model = app.collections.tasks.models[this.pos];
		
    },
    
    taskDone: function(e) {
    	event.preventDefault();
		params = {
		        state: app.Models.Task.state[3].value,
		};
		this.getTask(e);
		this.saveNewStateTask(params,null);
    	
    },
    
    taskNotDone: function(e) {
		e.preventDefault();
		params = {
		        state: app.Models.Task.state[2].value,
				user_id: null,
				date_end: null,
				date_start: null,
		};
		this.getTask(e);
		this.saveNewStateTask(params,null);

	},

	saveNewStateTask: function(params,el) {
		var self = this;
		self.params = params;
		self.el = el;
		this.model.save(params, {
				    success: function (data) {
					        console.log(data);
					        if(data.error){
					    		app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					        }
					        else{					        	
					            console.log('NEW STATE TASK SAVED');
					            if( self.el!= null )
					            	self.el.modal('hide');

					            self.model.update(params);
					            app.collections.tasks.models[self.pos] = self.model;
					            self.initialize();
/*							 	app.collections.tasks.fetch({  
					                success: function(){						 		
										//route = Backbone.history.fragment;
										//app.router.navigate(route,  {'trigger': true, replace: true});	
										self.initialize();
							 		}				 
						 		});	*/				            
					        }
					    },
					    error: function () {
							console.log('ERROR - Unable to valid the Request - RequestsListView.js');
					    },           
					},false);
	},

    preventDefault: function(event){
    	event.preventDefault();
    },

});