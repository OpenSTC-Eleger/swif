/******************************************
* Request Model
*/
app.Models.Task = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'project.task',	
	
	url: "/#taches/:id",
	
//	currentTask:this,

	defaults:{
		id:0,
		effective_hours:0,
		total_hours: 0,
		remaining_hours: 0,
		state: null,
		user_id: null,
		date_end: null,
		date_start: null,
		currentTask: null,
	},
	
//	getCurrentTask : function() {
//        return this.get('currentTask');
//    },
	
    getId : function() {
        return this.get('id');
    },
    setId: function(value) {
    	if( value == 'undefined') return;
        this.set({ id : value });
    },
    getState : function() {
        return this.get('state');
    },
    setState : function(value) {
    	if( value == 'undefined') return;
        this.set({ state : value });
    },    
    getUserId : function() {
        return this.get('user_id');
    },
    setUserId : function(value) {
    	if( value == 'undefined') return;
        this.set({ user_id : value });
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



    /** Model Parser
    */
    parse: function(response) {
    	
    	//Au moment de la sauvegarde openerp enregistre les dates en UTC
		//A la lecture on  convertit en GMT+1
//    	var date_start = new Date(Date.parse(response.date_start));
//    	var date_end = new Date(Date.parse(response.date_end));
//    	
//    	var utc_date_start = date_start.getTime() + (date_start.getTimezoneOffset() * 60000);
//    	var new_date_start = new Date(utc_date_start + (3600000*+2));
//    	 
//    	var utc_date_end = date_end.getTime() + (date_end.getTimezoneOffset() * 60000);
//    	var new_date_end= new Date(utc_date_end + (3600000*+2));
//    	
//    	
//    	response.date_start = new_date_start;
//    	response.date_end = new_date_end;
    	//this.setDateStart(new_date_start);
    	//this.setDateEnd(new_date_end);

        return response;
    },
    
//    reload: function(){
//		app.collections.tasks.fetch({ 
//			success: function(){					    	
//				app.collections.interventions.fetch({ 
//					success: function(){
//				 		app.collections.teams.fetch({
//			                success: function(){				 			
//				 				Console.debug("Tasks reloaded")
//					 		}					 
//				 		});
//			        }
//			   });
//		 	}					 
//		});
//    },
//    
//    saveReTest: function(id,data,options) { 
//    	that.options = options;
//    	var self = that
//		app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), {
//			success: function() {
//				that.reload()
//			}
//			complete: function() {
//				
//			}
//		});
//	},
    
	/** Save Model
		*/
	saveTest: function(id,data,options) { 
		app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), options);
	},
	
	save: function(id,data,closeModal, view, strRoute) { 
		app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), {
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
					 	app.collections.tasks.fetch({  
					 		success: function(){
						 		app.collections.interventions.fetch({
					                success: function(){				 			
						 				if( strRoute ) {
											route = Backbone.history.fragment;
											Backbone.history.loadUrl(route);
										}
										else if (view)
											view.render();
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
		this.setState( params.state );
		this.setUserId( params.user_id );
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


}, {

// Request State Initialization //
state:  [        
	{
        value       : 'draft',
        color       : 'important',
        traduction  : '',
    },
    {
        value       : 'open',
        color       : 'info',
        traduction  : '',
    },
    {
        value       : 'pending',
        color       : 'warning',
        traduction  : '', 
    },
    {
        value       : 'done',
        color       : 'success',
        traduction  : '',   
    },
    {
        value       : 'cancelled',
        color       : '',
        traduction  : '',  
    }
]

});