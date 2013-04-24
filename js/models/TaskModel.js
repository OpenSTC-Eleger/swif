/******************************************
* Task Model
*/
app.Models.Task = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'project.task',	
	
	url: "/#taches/:id",


	relations: [
	   {
			type: Backbone.HasMany,
			key: 'equipment_ids',
			relatedModel: 'app.Models.Equipment',
			collectionType: 'app.Collections.Equipments',
			includeInJSON: ['id','name', 'complete_name', 'type'],
		},	
	  ],
	

	defaults:{
		id:0,
		name: null,
		effective_hours:0,
		total_hours: 0,
		remaining_hours: 0,
		state: null,
		user_id: null,
		team_id: null,
		date_end: null,
		date_start: null,
		currentTask: null,
	},
	
    getId : function() {
        return this.get('id');
    },
    setId: function(value) {
    	if( value == 'undefined') return;
        this.set({ id : value });
    },
    getName : function() {
        return this.get('name');
    },
    setName: function(value) {
    	if( value == 'undefined') return;
        this.set({ id : value });
    },
    getState : function() {
        return this.get('name');
    },
    setState : function(value) {
    	if( value == 'undefined') return;
        this.set({ state : value });
    },    
    getInterventionId : function() {
        if(this.get('project_id')){
        	return this.get('project_id');
        }
        else{
        	return '';
        }
    },
    setInterventionId : function(value) {
    	if( value == 'undefined') return;
        this.set({ project_id : value });
    },
	getInterventionName : function() {
        if(this.get('project_id') != false){
        	return this.get('project_id')[1];
        }
        else{
        	return '';
        }
    },
    getUserId : function() {
        return this.get('user_id');
    },
    setUserId : function(value) {
    	if( value == 'undefined') return;
        this.set({ user_id : value });
    },
	getUserName : function() {
        return this.get('user_id')[1];
    },
    getTeamId : function() {
        return this.get('team_id');
    },
    setTeamId : function(value) {
    	if( value == 'undefined') return;
        this.set({ team_id : value });
    },
	getTeamName : function() {
        return this.get('team_id')[1];
    },
    getDateEnd : function() {
        return this.get('date_end');
    },
    setDateEnd : function(value) {
    	if( value == 'undefined') return;
        this.set({ date_end : value });
    },
    getDateStart : function() {
        return this.get('date_start');
    },
    setDateStart : function(value) {
    	if( value == 'undefined') return;
        this.set({ date_start : value });
    },
    getRemainingHours : function() {
        return this.get('remaining_hours');
    },
    setRemainingHours : function(value) {
    	if( value == 'undefined') return;
        this.set({ remaining_hours : value });
    },
    getPlannedHours : function() {
        return this.get('planned_hours');
    },
    setPlannedHours : function(value) {
    	if( value == 'undefined') return;
        this.set({ planned_hours : value });
    },
    getStartEndDateInformations : function(){
		return "Du " + this.getDateStart().format('LLL') + " au " + this.getDateEnd().format('LLL');
    },
	getState : function() {
        return this.get('state');
    },
	


	/** Model Initialization
	*/
	initialize: function (model) {
	   	console.log('Task Model Initialization');

		// Initialization Traduction task state //
		app.Models.Task.state[0].traduction = app.lang.planningFenced;
		app.Models.Task.state[1].traduction = app.lang.finished;
		app.Models.Task.state[2].traduction = app.lang.valid;
		app.Models.Task.state[3].traduction = app.lang.toScheduled;
		app.Models.Task.state[4].traduction = app.lang.cancelled;
	},



	parseDate: function(s) {
	  var re = /^(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)$/;
	  var m = re.exec(s);
	  //PYF : using UTC time 
	  return m ? new Date(Date.UTC(parseInt(m[1],10), parseInt(m[2]-1,10), parseInt(m[3],10), 
		  parseInt(m[4],10), parseInt(m[5],10), parseInt(m[6],10))) : null;
	},



    /** Model Parser
    */
    parse: function(response) {
		
		// Check if the date is a moment() //
		if(!moment.isMoment(response.date_start)){
			if(response.date_start) {
			//var user = app.models.user.toJSON();			
			response.date_start = moment(this.parseDate(response.date_start));
			}
		}

		// Check if the date is a moment() //
		if(!moment.isMoment(response.date_end)){
			if(response.date_end){
				response.date_end = moment(this.parseDate(response.date_end));
			}
		}

		return response;
    },
    


	/** Save Model
	*/
	saveTest: function(id,data,options) { 
		app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), options);
	},


	
	save: function(id,data,closeModal, view, strRoute) { 
		app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), {
            beforeSend: function(){
            	app.loader('display');
        	},
		    success: function (data) {
		        console.log(data);
		        if(data.error){
		    		app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
		        }
		        else{
		        	if( closeModal!= null )
		            	closeModal.modal('hide');
		        	if( view || strRoute ) {
		                if(app.collections.tasks == null ){
		                    app.collections.tasks = new app.Collections.Tasks();
		                }	
		                //TODO fetch tasks & interventions pê pas necessaires car elles st rechargées dans le routeur
					 	app.collections.tasks.fetch({  
					 		success: function(){
						 		app.collections.interventions.fetch({
					                success: function(){				 			
						 				if( strRoute ) {
											//route = Backbone.history.fragment;
											Backbone.history.loadUrl(strRoute);
						 					//app.Router.navigate("planning/"+Backbone.history.fragment,{trigger: true, replace: true})
										}
										else if (view)
											view.render();
							 		},	            		
						 			complete: function(){
				            			app.loader('hide');
				            		}					 
						 		});
					 		}					 
					 	});
					}
		        }
		    },
		    error: function () {
				console.log('ERROR - Unable to save the Request - RequestView.js');
		    }, 
		});
	},



	update: function(params) {
		this.setName( params.name );
		this.setProjectId( params.project_id );
		this.setState( params.state );
		this.setRemainingHours( params.remaining_hours );
		this.setPlannedHours( params.planned_hours );
		this.setUserId( params.user_id );
		this.setTeamId( params.team_id );
		this.setDateEnd( params.date_end );
		this.setDateStart( params.date_start );
	},
	


	destroy: function (options) {
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	},
	

	
	saveTaskDone: function(params, options) {
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "saveTaskDone", app.models.user.getSessionID(), options);
	},


}, {


// Task State Initialization //
state:  [
    {
        value       : 'open', // Scheduled //
        color       : 'info',
        traduction  : '',
    },
    {
        value       : 'done', // Finish //
        color       : 'success',
        traduction  : '',
    },
    {
        value       : 'pending',
        color       : 'default',
        traduction  : '',
    },
	{
        value       : 'draft', // To Schedule //
        color       : 'warning',
        traduction  : '',
    },
    {
        value       : 'cancelled', // cancel //
        color       : 'important',
        traduction  : '',
    },
    {
        value       : 'absent', // Congé //
        color       : 'absent',
        traduction  : '',
    }
]

});