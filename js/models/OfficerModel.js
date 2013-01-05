/******************************************
* Place Model
*/
app.Models.Officer = Backbone.RelationalModel.extend({
    
	model_name: "res.users",
	
	url: "/#officers/:id",
	
	relations: [{
			type: Backbone.HasMany,
			key: 'tasks',
			relatedModel: 'app.Models.Task',
			collectionType: 'app.Collections.Tasks',
			includeInJSON: true,
		},
//		{
//			type: Backbone.HasMany,
//			key: 'team_ids',
//			relatedModel: 'app.Models.Team',
//			collectionType: 'app.Collections.Teams',
//			includeInJSON: 'id',
			//TODO : team.users_ids nécessaire ?? : team.user_ids
//			reverseRelation: {
//				type: Backbone.HasMany,
//				key: 'user_ids'
//				includeInJSON: ['id'],
//			}		
//		}	
	],

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Officer Model initialization');
        this.fetchRelated('tasks');
    },
    
    /** Model Parser
    	    */
    parse: function(response) {
        return response;
    },

});