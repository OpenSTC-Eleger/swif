/******************************************
* Requests List View
*/
app.Views.TasksListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'tasksListCheck',
	
	numberListByPage: 25,


    // The DOM events //
    events: {
    	//'click .taskDone' 		: 'taskDone',
    	'click a.taskNotDone' 	: 'taskNotDone',
    		
    	'click .buttonTimeSpent'		: 'setModalTimeSpent',
    	'submit #formTimeSpent'    		: 'saveTimeSpent',
    	
    	'click .buttonTaskDone'			: 'setModalTaskDone',
    	'submit #formTaskDone'    		: 'saveTaskDone',
    },

	

	/** View Initialization
	*/
    initialize: function () {
		
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
		
		//TODO ajouter le DST et le manager du service de l'utilisateur
        var tasksUser = _.filter(tasks.models, function(item){		
        		return (item.attributes.user_id[0] == officer_id); 
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
        
    getTask: function(e) {
		var href = $(e.target);

		// Retrieve the ID of the request //	
		this.pos = href.parents('tr').attr('id');
		this.taskId = e.currentTarget.id;
		this.model = app.collections.tasks.get(this.taskId);
		
    },
    
    //Task not finished
    setModalTimeSpent: function(e) {    	
    	this.getTask(e);
    	var task = this.model.toJSON();
    	
    	$('#infoModalTimeSpent').children('p').html(task.name);
		$('#infoModalTimeSpent').children('small').html(task.notes);
		$('.timepicker-default').timepicker({showMeridian:false});

		$('#eventTimeSpent').val(0);
		$('#eventTimeRemaining').val(task.remaining_hours);
    },
    
    saveTimeSpent: function(e) {
    	e.preventDefault();
    	
    	//TODO : query = query.split('&');
    	
		params = {
		    state: app.Models.Task.state[2].value,
            effective_hours: $('#eventTimeSpent').val(),
            remaining_hours: $('#eventTimeRemaining').val(),
            planned_hours: $('#eventTimeRemaining').val(),
			user_id: null,
			date_end: null,
			date_start: null,
		};
		var newInterState = app.Models.Intervention.state[2].value;
		this.saveNewStateTask(params,$('#modalTimeSpent'),newInterState);
    },
    
    //Task done
    setModalTaskDone: function(e) {
    	this.getTask(e);
    	var task = this.model.toJSON();
    	
    	$('#infoModalTaskDone').children('p').html(task.name);
		$('#infoModalTaskDone').children('small').html(task.notes);
		$('.timepicker-default').timepicker({showMeridian:false});

		$('#eventTime').val(0);
    },
    
    saveTaskDone: function(e) {
    	e.preventDefault();

		var that = this;
		that.state = app.Models.Intervention.state[3].value;		
		var tasks = this.model.toJSON().intervention.tasks;
		_.each(tasks.models, function (task, i) {
			if(task.toJSON().state == app.Models.Task.state[2])
				that.state = app.Models.intervention[2];	
		});
		
		params = {
		    state: app.Models.Task.state[3].value,
            effective_hours: $('#eventTime').val(),
            remaining_hours: 0,
		};
		var newInterState = that.state;
		this.saveNewStateTask(params,$('#modalTaskDone'),newInterState);
    },
    
    //Task not beginning
    taskNotDone: function(e) {
		e.preventDefault();
		params = {
		        state: app.Models.Task.state[2].value,
				user_id: null,
				date_end: null,
				date_start: null,
		};
		var newInterState = app.Models.Intervention.state[0].value;
		this.getTask(e);
		this.saveNewStateTask(params,null,newInterState);

	},

	//Save task with new times
	saveNewStateTask: function(params,element,newInterState) {
		var self = this;
		self.params = params;
		self.element = element;
		
		// why 'saveWithCallback' and note 'save' on model
		//When save intervention and just after save task (TaskListView L.187 et L.190) postgres send this error:
		//TransactionRollbackError: could not serialize access due to concurrent update
		//We must wait intervention save callback before save task
		app.models.intervention.saveWithCallback(this.model.toJSON().intervention.id, {
			state:newInterState },{
				success: function (data) {
					app.models.task.save(self.model.id, self.params, self.element, self, "#taches");
				}
			});
	},

    preventDefault: function(event){
    	event.preventDefault();
    },

});