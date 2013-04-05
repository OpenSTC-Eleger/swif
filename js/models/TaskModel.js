/******************************************
* Request Model
*/
app.Models.Task = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'project.task',	
	
	url: "/#taches/:id",


//	relations: [
//	   {
//			type: Backbone.HasMany,
//			key: 'works',
//			relatedModel: 'app.Models.TaskWork',
//			collectionType: 'app.Collections.TaskWorks',
//			includeInJSON: true,
//			reverseRelation: {
//				key: 'task',
//				includeInJSON: 'id',
//			},
//		},		
//	],

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
    getProjectId : function() {
        return this.get('project_id');
    },
    setProjectId : function(value) {
    	if( value == 'undefined') return;
        this.set({ project_id : value });
    },
    getUserId : function() {
        return this.get('user_id');
    },
    setUserId : function(value) {
    	if( value == 'undefined') return;
        this.set({ user_id : value });
    },
    getTeamId : function() {
        return this.get('team_id');
    },
    setTeamId : function(value) {
    	if( value == 'undefined') return;
        this.set({ team_id : value });
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


//	relations: [
//	{
//		// Create a cozy, recursive, one-to-one relationship
//		type: Backbone.HasOne,
//		key: 'project_id',
//		relatedModel: 'app.Models.Intervention',
//		includeInJSON: true,
//		reverseRelation: {
//			key: 'tasks'
//		}
//	}],
	

	/** Model Initialization
	*///
	initialize: function (model) {
	   	console.log("Request task Initialization");
	},

	parseDate: function(s) {
	  var re = /^(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)$/;
	  var m = re.exec(s);
	  //PYF : using UTC time 
	  return m ? new Date(Date.UTC(parseInt(m[1],10), parseInt(m[2]-1,10), parseInt(m[3],10), 
		  parseInt(m[4],10), parseInt(m[5],10), parseInt(m[6],10))) : null;
//	  return m ? new Date(parseInt(m[1],10), parseInt(m[2]-1,10), parseInt(m[3],10), 
//			  parseInt(m[4],10), parseInt(m[5],10), parseInt(m[6],10)) : null;
	},


    /** Model Parser
    */
    parse: function(response) {
		
		if( response.date_start ) {
			//var user = app.models.user.toJSON();		
			response.date_start = moment(this.parseDate(response.date_start));
			//response.date_start = moment.utc((this.parseDate(response.date_start)));
			//.add('hours', 1);				
		}		
		
		if( response.date_end ) 
			response.date_end = moment(this.parseDate(response.date_end));	
			//response.date_end = moment.utc((this.parseDate(response.date_end)));	
			
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
				console.log('ERROR - Unable to save the Request - RequestDetailsView.js');
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
        value       : 'open',
        color       : '#3a87ad', //'info',
        traduction  : '',
    },
    {
        value       : 'done',
        color       : '#468847', //'success',
        traduction  : '',   
    },
    {
        value       : 'pending',
        color       : '#333', //muted',
        traduction  : '', 
    },
	{
        value       : 'draft',
        color       : 'lightgreen', //purple
        traduction  : '',
    },
    {
        value       : 'cancelled',
        color       : '#b94a48', //'//important',
        traduction  : '',  
    },
    {
        value       : 'absent',
        color       : '#c3325f', //purple
        traduction  : '',  
    }
]

});