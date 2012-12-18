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
    
	save: function(data,options) { 
    	app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(), options);
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
