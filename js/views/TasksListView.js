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
		
		'click .btn.addTask'            : 'displayModalAddTask',
		'submit #formAddTask'         	: 'saveTask',   

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
		
		var tasks = app.collections.tasks.toJSON();
		
//		tasks = _.sortBy(tasks, function(item){ 
//			return [-item.state,-item.date_start]; 
//		});
		
		
		// Retrieve the year - If not exist in the URL set as the current year //
		if(typeof(this.options.yearSelected) == 'undefined'){
			yearSelected = moment().year();
		}
		else{
			yearSelected = this.options.yearSelected;	
		}

		// Retrieve the week of the year - - If not exist in the URL set as the current week ////
		if(typeof(this.options.weekSelected) == 'undefined'){
			weekSelected = moment().week();
		}
		else{
			weekSelected = this.options.weekSelected;
		}
		
		var momentDate = moment().year(yearSelected).week(weekSelected);



		//TODO ajouter le DST et le manager du service de l'utilisateur
		var tasksUser = _.filter(tasks, function(task){	
			var intervention = task.intervention; 

    		var belongsToOfficer = (task.user_id[0] == officer_id)
    		if( task.teamWorkingOn != null && task.teamWorkingOn.manager_id!=null )
					belongsToOfficer = belongsToOfficer || (task.teamWorkingOn.manager_id[0] == officer_id);

    		var belongsToServiceManager = false;

    		var interCondition = false;
    		if( intervention!=null ) {
    			//keep only  interventions : tscheduled('cloturée') , pending ('En cours')
//    			interCondition = intervention.state==app.Models.Intervention.state[1].value
//    				||	intervention.state==app.Models.Intervention.state[3].value;

				var service = intervention.service_id;//!=null?intervention.service_id.toJSON():null;
				var userServices = app.models.user.toJSON().service_ids;
				if ( service && userServices )
					belongsToServiceManager = app.models.user.isManager() &&         										
    												$.inArray(service[0], userServices)!=-1;
			}


    		return (	//Tâches de l'agent
    					( belongsToOfficer || app.models.user.isDST() || belongsToServiceManager )
//    					&& 
//    					(
//    						//Tâches ouvertes (plannifiés) ou en cours
//    						task.state!=app.Models.Task.state[3].value //pas à l'état brouillon(planification)'
//    						//|| task.state==app.Models.Task.state[2].value                                                  	
//    					)  
//    					&& 
//    					(
//    						//L'intervention de la tâche doit être planifiée ou en cours'
//    						interCondition
//    					 )
    			   );
        });

    	//var tasks = app.collections.tasks.getTasksByOfficer(officer_id);

        // Retrieve the number of validated Interventions //
//        var tasksPending = _.filter(tasksUser, function(item){         		
//        	return item.attributes.state == app.Models.Task.state[2].value; 
//        });

		// Create table for each day //
		var mondayTasks =[]; 	var tuesdayTasks =[];
		var wednesdayTasks =[]; var thursdayTasks =[];
		var fridayTasks =[]; 	var saturdayTasks =[]; 
		var sundayTasks =[];

		var nbPendingTasks = 0;


		// Fill the tables with the tasks //
		_.each(tasksUser, function(task, i){

			if(momentDate.clone().isSame(task.date_start, 'week')){
				
				if(momentDate.clone().day(1).isSame(task.date_start, 'day')){
					mondayTasks.push(task);
				}
				else if(momentDate.clone().day(2).isSame(task.date_start, 'day')){
					tuesdayTasks.push(task);
				}
				else if(momentDate.clone().day(3).isSame(task.date_start, 'day')){
					wednesdayTasks.push(task);
				}
				else if(momentDate.clone().day(4).isSame(task.date_start, 'day')){
					thursdayTasks.push(task);
				}
				else if(momentDate.clone().day(5).isSame(task.date_start, 'day')){
					fridayTasks.push(task);
				}
				else if(momentDate.clone().day(6).isSame(task.date_start, 'day')){
					saturdayTasks.push(task);
				}
				else if(momentDate.clone().day(7).isSame(task.date_start, 'day')){
					sundayTasks.push(task);
				}

				// Retrieve the number of Open Task //
				if(task.state == app.Models.Task.state[0].value){
					nbPendingTasks++;
				}
			}
		});

		var tasksUserFiltered = [
			{'day': momentDate.clone().day(1), 'tasks': mondayTasks},
			{'day': momentDate.clone().day(2), 'tasks': tuesdayTasks},
			{'day': momentDate.clone().day(3), 'tasks': wednesdayTasks},
			{'day': momentDate.clone().day(4), 'tasks': thursdayTasks},
			{'day': momentDate.clone().day(5), 'tasks': fridayTasks},
			{'day': momentDate.clone().day(6), 'tasks': saturdayTasks},
			{'day': momentDate.clone().day(7), 'tasks': sundayTasks}
		];


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		

			var template = _.template(templateData, {
				lang: app.lang,
				nbPendingTasks: nbPendingTasks,
				tasksPerDay: tasksUserFiltered,
				momentDate: momentDate
			});
			
			$(self.el).html(template);
			
			app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), collection: app.collections.categories})
			app.views.selectListAssignementsView.clearAll();
			app.views.selectListAssignementsView.addEmptyFirst();
			app.views.selectListAssignementsView.addAll();


			$(".datepicker").datepicker({
    			format: 'dd/mm/yyyy',
    			weekStart: 1,
    			autoclose: true,
    			language: 'fr'
    		});

			$('.timepicker-default').timepicker({showMeridian:false, modalBackdrop:true});
			$('*[rel="tooltip"]').tooltip({placement: "right"});
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
    
	/** Display the form to add a new Task
		*/
	displayModalAddTask: function(e){
			
		app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: $("#taskEquipmentAdd"), collection: app.collections.equipments})
		app.views.selectListEquipmentsView.clearAll();
		app.views.selectListEquipmentsView.addEmptyFirst();
		app.views.selectListEquipmentsView.addAll();
			
		var mStartDate = moment();
		var mEndDate = moment();	
			
    	$("#startDate").val( mStartDate.format('L') );
    	$("#endDate").val( mEndDate.format('L') );    	
		var tempStartDate = moment( mStartDate );
		tempStartDate.hours(8);
		tempStartDate.minutes(0);
		$("#startHour").timepicker( 'setTime', tempStartDate.format('LT') );
		var tempEndDate = moment( mEndDate );
		tempEndDate.hours(18);
		tempEndDate.minutes(0);
		$("#endHour").timepicker('setTime', tempEndDate.format('LT') );
			
		$('#modalAddTask .modal-body').css("height", "550px");
        $('#modalAddTask').modal();
	},
	

    /** Save the Task
    */
	saveTask: function(e){
		var self = this;

		e.preventDefault();
		
		var mNewDateStart =  new moment( $("#startDate").val(),"DD-MM-YYYY")
								.add('hours',$("#startHour").val().split(":")[0] )
								.add('minutes',$("#startHour").val().split(":")[1] );
		var mNewDateEnd =  new moment( $("#endDate").val(),"DD-MM-YYYY")
								.add('hours',$("#endHour").val().split(":")[0] )
								.add('minutes',$("#endHour").val().split(":")[1] );
		var planned_hours = mNewDateEnd.diff(mNewDateStart, 'hours', true);
		 
		input_category_id = null;	    
	    if( app.views.selectListAssignementsView != null ) {
	    	 var selectItem = app.views.selectListAssignementsView.getSelected();
	    	 if( selectItem ) {
	    		 input_category_id = app.views.selectListAssignementsView.getSelected().toJSON().id;
	    	 }
	    }	    	
	     
	     input_equipment_id = null;
	     if( app.views.selectListEquipmentsView != null ) {
	    	 var selectItem = app.views.selectListEquipmentsView.getSelected();
	    	 if( selectItem ) {
	    		 input_equipment_id = selectItem.toJSON().id
	    	 }
	     }
	     
	     
	     var params = {
	         user_id:  app.models.user.getUID(),
	         date_start: mNewDateStart,
	         date_end: mNewDateEnd,
	         state: app.Models.Task.state[1].value,
	         equipment_id: input_equipment_id,
	         name: this.$('#taskName').val(),
	         km: this.$('#equipmentKmAdd').val(),
	         oil_qtity: this.$('#equipmentOilQtityAdd').val(),
	         oil_price: this.$('#equipmentOilPriceAdd').val(),
	         category_id: input_category_id,	         
		     planned_hours: planned_hours,
		     effective_hours: planned_hours,
		     remaining_hours: 0,
	     };
	     //TODO : test
	     app.models.task.save(0,params,$('#modalAddTask'), null, "taches");
   	},
    
    //Task not finished
    setModalTimeSpent: function(e) {    	
    	this.getTask(e);
    	var task = this.model.toJSON();
    	$('.timepicker-default').timepicker({showMeridian:false, modalBackdrop:true});

    	$('#infoModalTimeSpent').children('p').html(task.name);
		$('#infoModalTimeSpent').children('small').html(task.notes);
		$('.timepicker-default').timepicker({showMeridian:false});

		$('#eventTimeSpent').val(this.secondsToHms(task.remaining_hours*60));
		$('#modalTimeSpent .modal-body').css("height", "300px");
		$('#eventTimeRemaining').val("00:00");
		
		app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: $("#taskEquipmentSpent"), collection: app.collections.equipments})
		app.views.selectListEquipmentsView.clearAll();
		app.views.selectListEquipmentsView.addEmptyFirst();
		app.views.selectListEquipmentsView.addAll();
    },
    
    
    saveTimeSpent: function(e) {
    	e.preventDefault();
    	
    	var task = this.model.toJSON();

    	var timeArray = $('#eventTimeSpent').val().split(':');
    	var hours = parseInt(timeArray[0]) + (timeArray[1]!="00" ? parseInt(timeArray[1])/60 : 0)
    	var newDateEnd = moment(task.date_start).add('hours', 1);	
    	//newDateEnd.add('hours',hours,true);
    	
    	timeArray = $('#eventTimeRemaining').val().split(':');
    	var remaining_hours = parseInt(timeArray[0]) + (timeArray[1]!="00" ? parseInt(timeArray[1])/60 : 0);
    	
    	input_equipment_id = null;
	     if( app.views.selectListEquipmentsView != null ) {
	    	 var selectItem = app.views.selectListEquipmentsView.getSelected();
	    	 if( selectItem ) {
	    		 input_equipment_id = selectItem.toJSON().id
	    	 }
	     }
    	
    	
    	taskParams = {
    	    name: task.name?task.name:0,
    	    project_id: task.project_id!=null?task.project_id[0]:null,
    	    parent_id: task.id,
    	    equipment_id: input_equipment_id,
    	    km: this.$('#equipmentKmSpent').val(),
	        oil_qtity: this.$('#equipmentOilQtitySpent').val(),
	        oil_price: this.$('#equipmentOilPriceSpent').val(),
		    state: app.Models.Task.state[1].value,
		    effective_hours: hours,
		    planned_hours: task.planned_hours,
            remaining_hours: 0,
			user_id: task.user_id?task.user_id[0]:0,
			team_id: task.team_id?task.team_id[0]:0,
			date_start: task.date_start.toDate(),
			date_end: newDateEnd.toDate(),
		};
    	
    	var self = this;
    	self.task = task;
    	self.hours = hours;
    	self.remaining_hours = remaining_hours;
    	app.models.task.saveTest(0,taskParams,{
				success: function(){
    				taskParams = {
    		  		    state: app.Models.Task.state[2].value,
    		            planned_hours: self.remaining_hours,
    		            remaining_hours: self.remaining_hours,
    		            equipment_id: input_equipment_id,
    		  			user_id: null,
    		  			team_id:null,
    		  			date_end: null,
    		  			date_start: null,
    		  		};

    		  		

    		  		taskWorkParams = {
    		      			 name: task.name,
    		      	         date: new Date(),
    		      	         task_id: task.id,
    		      	         hours: self.hours,
    		      	         user_id: task.user_id!=null?task.user_id[0]:null,
    		      	         team_id: task.team_id!=null?task.team_id[0]:null,
    		      	         company_id: task.company_id!=null?task.company_id[0]:null,
    		      	};
    		  		
    		  		var newInterState = null;
    		  		if( task && task.intervention ) {
    		  			inter = task.intervention;
    		  			newInterState = inter.state;
    		  			if( task.intervention.state!=app.Models.Intervention.state[5].value ) {
    		  				newInterState = app.Models.Intervention.state[3].value;
    		  			}
    		  		}    		
    		  		
    		  		self.saveNewStateTask(taskParams, taskWorkParams,$('#modalTimeSpent'),newInterState);
				}
			});
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
    	$('.timepicker-default').timepicker({showMeridian:false, modalBackdrop:true});
    	
    	$('#infoModalTaskDone').children('p').html(task.name);
		$('#infoModalTaskDone').children('small').html(task.notes);
		
		$('#modalTaskDone .modal-body').css("height", "300px");
		$('#eventTimeDone').val(this.secondsToHms(task.remaining_hours*60));
		
		app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: $("#taskEquipmentDone"), collection: app.collections.equipments})
		app.views.selectListEquipmentsView.clearAll();
		app.views.selectListEquipmentsView.addEmptyFirst();
		app.views.selectListEquipmentsView.addAll();
    },

    saveTaskDone: function(e) {
    	e.preventDefault();

		var that = this;
		that.state = app.Models.Intervention.state[2].value;		
		var tasks = this.model.toJSON().intervention.tasks;
		_.each(tasks.models, function (task, i) {
			if( that.model.id!= task.id && ( task.toJSON().state == app.Models.Task.state[0].value
				 || task.toJSON().state == app.Models.Task.state[2].value) )
				that.state = app.Models.Intervention.state[3].value;
		});
		
		var timeArray = $('#eventTimeDone').val().split(':');
    	var hours = parseInt(timeArray[0]) + (timeArray[1]!="00" ? parseInt(timeArray[1])/60 : 0);
    	
    	 input_equipment_id = null;
	     if( app.views.selectListEquipmentsView != null ) {
	    	 var selectItem = app.views.selectListEquipmentsView.getSelected();
	    	 if( selectItem ) {
	    		 input_equipment_id = selectItem.toJSON().id
	    	 }
	     }

		taskParams = {
		    state: app.Models.Task.state[1].value,
		    equipment_id: input_equipment_id,
		    remaining_hours: 0,
	        km: this.$('#equipmentKmDone').val(),
	        oil_qtity: this.$('#equipmentOilQtityDone').val(),
	        oil_price: this.$('#equipmentOilPriceDone').val(),
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
    	
		var newInterState = null;
		if( this.model && this.model.intervention ) {
			inter = this.model.intervention;
			newInterState = inter.state;
			if( this.model.intervention.state!=app.Models.Intervention.state[5].value ) {
				newInterState = that.state;
			}
		}    		
    	
		this.saveNewStateTask(taskParams, taskWorkParams,$('#modalTaskDone'),newInterState);
    },
    
    //Task not beginning
    taskNotDone: function(e) {
		e.preventDefault();
		this.getTask(e);
		taskParams = {
			state: app.Models.Task.state[3].value,		        
			//remaining_hours: 0,
			//planned_hours: 0,
			user_id: null,
			team_id:null,
			date_end: null,
			date_start: null,
		};
		
		var newInterState = null;
		if( this.model && this.model.intervention ) {
			inter = this.model.intervention;
			newInterState = inter.state;
			if( this.model.intervention.state!=app.Models.Intervention.state[5].value ) {
				newInterState = app.Models.Intervention.state[3].value;
			}
		}
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