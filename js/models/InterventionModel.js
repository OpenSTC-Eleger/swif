/******************************************
* Place Model
*/
app.Models.Intervention = Backbone.RelationalModel.extend({
    
	model_name : 'project.project',	
	
	url: "/#demandes-dinterventions/:id",

	
	relations: [
	   {
			type: Backbone.HasMany,
			key: 'tasks',
			relatedModel: 'app.Models.Task',
			collectionType: 'app.Collections.Tasks',
			includeInJSON: true,
			reverseRelation: {
				key: 'intervention',
				includeInJSON: ['id','name','state','tasks','service_id'],
			},
		},		
		{
			type: Backbone.HasOne,
			key: 'service_id',
			relatedModel: 'app.Models.ClaimerService',
			collectionType: 'app.Collections.ClaimerServices',
			includeInJSON: ['id']
		}
	],

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Intervention Model initialization');
        this.fetchRelated('tasks');


        app.Models.Intervention.state[0].traduction = app.lang.toScheduled;
        app.Models.Intervention.state[1].traduction = app.lang.planningFenced;
        app.Models.Intervention.state[2].traduction = app.lang.pending;
        app.Models.Intervention.state[3].traduction = app.lang.closed;
        app.Models.Intervention.state[4].traduction = app.lang.cancelled;
    },
    
    /** Model Parser */
    parse: function(response) {    	
        return response;
    },


	//save method with all redondant code
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
		        	if( view ) {
		                if(app.collections.interventions == null ){
		                    app.collections.interventions = new app.Collections.Interventions();
		                }		        		
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
		        }
		    },
		    error: function () {
				console.log('ERROR - Unable to save the Request - RequestDetailsView.js');
		    }, 
		});
	},
	
	//When save intervention and just after save task (TaskListView L.187 et L.190) postgres send this error:
	//TransactionRollbackError: could not serialize access due to concurrent update
	//We must wait intervention save callback before save task
	saveWithCallback: function(id,data,options) { 
		app.saveOE(id, data, this.model_name, app.models.user.getSessionID(), options);
	},


}, {

    // Request State Initialization //
    state:  [        
    	{
            value       : 'toscheduled',
            color       : 'warning',
            traduction  : '',
        },
        {
            value       : 'scheduled',
            color       : 'success',
            traduction  : '',
        },
        {
            value       : 'pending',
            color       : 'info',
            traduction  : '', 
        },
        {
            value       : 'closing',
            color       : '',
            traduction  : '',   
        },
        {
            value       : 'cancelled',
            color       : 'important',
            traduction  : '',  
        }
    ]

});
