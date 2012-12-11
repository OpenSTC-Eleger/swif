/******************************************
* Requests List View
*/
app.Views.TasksListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'tasksListCheck',
	
	numberListByPage: 25,


    // The DOM events //
    events: {
    	'click .taskDone' 		: 'taskDone',
    	'click a.taskNotDone' 	: 'taskNotDone',
    		
    	'click .buttonTimeSpent'		: 'setModalTimeSpent',
    	'submit #formTimeSpent'    		: 'saveTimeSpent',
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
		
		var tasks = app.collections.tasks
        var tasksUser = _.filter(tasks.models, function(item){
        	userId = item.attributes.user_id
        	if( userId )        		
        		return item.attributes.user_id[0] == officer_id; 
        	else
        		return false;
        });
		
    	//var tasks = app.collections.tasks.getTasksByOfficer(officer_id);
    	
        // Retrieve the number of validated Interventions //
        var tasksPending = _.filter(tasksUser, function(item){ 
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
			var tasksList = new app.Collections.Tasks(tasksPending).toJSON();
			var template = _.template(templateData, {
				lang: app.lang,
				nbTasks: nbTasks,
				tasks: tasksList,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,

			});
			$(self.el).html(template);

		});

		$(this.el).hide().fadeIn('slow');
		
        return this;
    },
    
    setModalTimeSpent: function(e) {
    	this.getTask(e);
    	var task = this.model.toJSON();
		$('#eventTimeSpent').val(task.effective_hours);
		$('#eventTimeRemaining').val(task.remaining_hours);
    },
    
    saveTimeSpent: function(e) {
    	e.preventDefault();
		params = {
		    state: app.Models.Task.state[2].value,
            effective_hours: $('#eventTimeSpent').val(),
            remaining_hours: $('#eventTimeRemaining').val(),
			user_id: null,
			date_end: null,
			date_start: null,
		};
		
		this.saveNewStateTask(params,$('#modalTimeSpent'));
    },
    
    getTask: function(e) {
		var href = $(e.target);

		// Retrieve the ID of the request //	
		this.pos = href.parents('tr').attr('id');
		this.taskId = e.currentTarget.id;
		this.model = app.collections.tasks.get(this.taskId);
		
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

	saveNewStateTask: function(params,element) {
		var self = this;
		self.params = params;
		self.element = element;
		this.model.save(params, {
				    success: function (data) {
					        console.log(data);
					        if(data.error){
					    		app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					        }
					        else{					        	
					            console.log('NEW STATE TASK SAVED');
					            if( self.element!= null )
					            	self.element.modal('hide');
					            self.model.update(params);
					            app.collections.tasks.models[self.pos] = self.model;
					            self.render();		            
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