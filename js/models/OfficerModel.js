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
		{
			type: Backbone.HasMany,
			key: 'service_ids',
			relatedModel: 'app.Models.ClaimerService',
			collectionType: 'app.Collections.ClaimersServices',
			includeInJSON: 'id',	
		},
//		{
//			type: Backbone.HasMany,
//			key: 'team_ids',
//			relatedModel: 'app.Models.Team',
//			collectionType: 'app.Collections.Teams',
//			includeInJSON: 'id',	
//		},
//		{
//			type: Backbone.HasMany,
//			key: 'works',
//			relatedModel: 'app.Models.Work',
//			reverseRelation: {
//				key: 'officer',
//			}
//		},
		

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

	

	/** Delete Officer
	*/
	delete: function (options) {	
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	}

});