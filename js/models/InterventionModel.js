/******************************************
* Place Model
*/
app.Models.Intervention = Backbone.RelationalModel.extend({
    
	model_name : 'project.project',	
	
	url: "/#demandes-dinterventions/:id",

	
	relations: [{
		type: Backbone.HasMany,
		key: 'tasks',
		relatedModel: 'app.Models.Task',
		collectionType: 'app.Collections.Tasks',
		includeInJSON: true,
//		reverseRelation: {
//			key: 'project_id',
//			includeInJSON: true,
//		}
	}],

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Intervention Model initialization');
        this.fetchRelated('tasks');
    },
    
    /** Model Parser */
    parse: function(response) {    	
        return response;
    },
    
//	save: function(id,data,options) { 
//    	app.saveOE(id, data, this.model_name, app.models.user.getSessionID(), options);
//	},
	
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


}, {

// Request State Initialization //
state:  [        
	{
        value       : 'toscheduled',
        color       : 'important',
        traduction  : '',
    },
    {
        value       : 'scheduled',
        color       : 'info',
        traduction  : '',
    },
    {
        value       : 'pending',
        color       : 'warning',
        traduction  : '', 
    },
    {
        value       : 'closing',
        color       : 'success',
        traduction  : '',   
    },
    {
        value       : 'canceled',
        color       : '',
        traduction  : '',  
    }
]

});
