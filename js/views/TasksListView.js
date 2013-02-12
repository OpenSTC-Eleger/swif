/******************************************
* Requests List View
*/
app.Views.TasksListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'tasksListCheck',
	
	numberListByPage: 25,


    // The DOM events //
	events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',

		//'click .taskDone' 			: 'taskDone',
		'click a.taskNotDone' 			: 'taskNotDone',

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
			var task = item.toJSON();
			var intervention = task.intervention; 
        		
    		var belongsToOfficer = (task.user_id[0] == officer_id)
    		if( task.teamWorkingOn != null && task.teamWorkingOn.manager_id!=null )
					belongsToOfficer = belongsToOfficer || (task.teamWorkingOn.manager_id[0] == officer_id);
    		
    		var belongsToServiceManager = false;
    		
    		var interCondition = false;
    		if( intervention!=null ) {
    			//keep only  interventions : toscheduled ('A planifier'), scheduled('cloturée') , pending ('En cours')
    			interCondition = intervention.state==app.Models.Intervention.state[0].value
    				||	intervention.state==app.Models.Intervention.state[1].value
					|| intervention.state==app.Models.Intervention.state[2].value 
					|| intervention.state==app.Models.Intervention.state[5].value  //'template'
										
				var service = intervention.service_id;//!=null?intervention.service_id.toJSON():null;
				var userServices = app.models.user.toJSON().service_ids;
				if ( service && userServices )
					belongsToServiceManager = app.models.user.isManager() &&         										
    												$.inArray(service[0], userServices)!=-1;
			}


    		return (	//Tâches de l'agent
    					( belongsToOfficer || app.models.user.isDST() || belongsToServiceManager )
    					&& 
    					(
    						//Tâches ouvertes (plannifiés) ou en cours
    						task.state==app.Models.Task.state[1].value
    						|| task.state==app.Models.Task.state[2].value                                                  	
    					 )  
    					&& 
    					(
    						//L'intervention de la tâche doit être planifiée ou en cours'
    						interCondition
    					 )
    			   ); 
        });
		
    	//var tasks = app.collections.tasks.getTasksByOfficer(officer_id);
    	
        // Retrieve the number of validated Interventions //
//        var tasksPending = _.filter(tasksUser, function(item){         		
//        	return item.attributes.state == app.Models.Task.state[2].value; 
//        });
        var nbTasks = _.size(tasksUser);
        
        
        
		//var tasks = app.collections.tasks.models;
		var len = nbTasks;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);
		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			//var tasksList = new app.Collections.Tasks(tasksUser).toJSON();
			var taskList = []
			_.each(tasksUser , function (task, i){
				taskList.push(task.toJSON())
			});

			console.log(taskList);

			var template = _.template(templateData, {
				lang: app.lang,
				nbTasks: nbTasks,
				tasks: taskList,
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
		//this.taskId = href.data('taskid');
		this.model = app.collections.tasks.get(this.pos);
    },
    
    //Task not finished
    setModalTimeSpent: function(e) {    	
    	this.getTask(e);
    	var task = this.model.toJSON();

    	$('#infoModalTimeSpent').children('p').html(task.name);
		$('#infoModalTimeSpent').children('small').html(task.notes);
		$('.timepicker-default').timepicker({showMeridian:false});

		$('#eventTimeSpent').val(this.secondsToHms(task.remaining_hours*60));
		$('#eventTimeRemaining').val("00:00");
    },
    
    saveTimeSpent: function(e) {
    	e.preventDefault();
    	
    	var timeArray = $('#eventTimeSpent').val().split(':');
    	var hours = parseInt(timeArray[0]) + (timeArray[1]!="00" ? parseInt(timeArray[1])/60 : 0)
    	
    	timeArray = $('#eventTimeRemaining').val().split(':');
    	var remaining_hours = parseInt(timeArray[0]) + (timeArray[1]!="00" ? parseInt(timeArray[1])/60 : 0)
    	
		taskParams = {
		    state: app.Models.Task.state[2].value,
            planned_hours: remaining_hours,
            remaining_hours: remaining_hours,
			user_id: null,
			team_id:null,
			date_end: null,
			date_start: null,
		};

		var task = this.model.toJSON();

		taskWorkParams = {
    			 name: task.name,
    	         date: new Date(),
    	         task_id: task.id,
    	         hours: hours,
    	         user_id: task.user_id!=null?task.user_id[0]:null,
    	         team_id: task.team_id!=null?task.team_id[0]:null,
    	         company_id: task.company_id[0]
    	};

		var newInterState = app.Models.Intervention.state[0].value;
		this.saveNewStateTask(taskParams, taskWorkParams,$('#modalTimeSpent'),newInterState);
    },
    
    secondsToHms : function (d) {
		d = Number(d);	
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s); 
	},
    
    //Task done
    setModalTaskDone: function(e) {
    	this.getTask(e);
    	var task = this.model.toJSON();
    	
    	$('#infoModalTaskDone').children('p').html(task.name);
		$('#infoModalTaskDone').children('small').html(task.notes);
		$('.timepicker-default').timepicker({showMeridian:false});

		$('#eventTime').val(this.secondsToHms(task.remaining_hours*60));
    },

    saveTaskDone: function(e) {
    	e.preventDefault();

		var that = this;
		that.state = app.Models.Intervention.state[3].value;		
		var tasks = this.model.toJSON().intervention.tasks;
		_.each(tasks.models, function (task, i) {
			if(task.toJSON().state == app.Models.Task.state[1].value
				 || task.toJSON().state == app.Models.Task.state[2].value)
				that.state = app.Models.Intervention.state[2].value;	
		});
		
		var timeArray = $('#eventTime').val().split(':');
    	var hours = parseInt(timeArray[0]) + (timeArray[1]!="00" ? parseInt(timeArray[1])/60 : 0)

		taskParams = {
		    state: app.Models.Task.state[3].value,
		    remaining_hours: 0,
		};
		
		var task = this.model.toJSON();
		
    	taskWorkParams = {
    			 name: task.name,
    	         date: new Date(),
    	         task_id: task.id,
    	         hours: hours,
    	         user_id: task.user_id!=null?task.user_id[0]:null,
    	         team_id: task.team_id!=null?task.team_id[0]:null,
    	         company_id: task.company_id[0]
    	};

		var newInterState = that.state;
		this.saveNewStateTask(taskParams, taskWorkParams,$('#modalTaskDone'),newInterState);
    },
    
    //Task not beginning
    taskNotDone: function(e) {
		e.preventDefault();
		this.getTask(e);
		taskParams = {
			state: app.Models.Task.state[1].value,		        
			//remaining_hours: 0,
			//planned_hours: 0,
			user_id: null,
			team_id:null,
			date_end: null,
			date_start: null,
		};
		var newInterState = app.Models.Intervention.state[0].value;		
		this.saveNewStateTask(taskParams,null,null,newInterState);

	},

	//Save task with new times
	saveNewStateTask: function(taskParams, taskWorkParams, element, newInterState) {
		var self = this;
		self.taskParams = taskParams;
		self.taskWorkParams = taskWorkParams;
		self.element = element;
		
		// why 'saveWithCallback' and note 'save' on model
		//When save intervention and just after save task (TaskListView L.187 et L.190) postgres send this error:
		//TransactionRollbackError: could not serialize access due to concurrent update
		//We must wait intervention save callback before save task
		
		app.models.intervention.saveWithCallback(this.model.toJSON().intervention.id, {
			state:newInterState },
			{
				//TODO save task work with callback
				success: function (data) {		
					if( self.taskWorkParams!=null )
					{
						app.models.taskWork.save(0, taskWorkParams,
						{
							success: function (data) {
								app.models.task.save(self.model.id, self.taskParams, self.element, self, "#taches");
							}
						});
					}
					else
						app.models.task.save(self.model.id, self.taskParams, self.element, self, "#taches");
				}		
			});
	},

    preventDefault: function(event){
    	event.preventDefault();
    },

});