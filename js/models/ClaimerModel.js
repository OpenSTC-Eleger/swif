/******************************************
* Claimer Model
*/
app.Models.Claimer = Backbone.RelationalModel.extend({
    
	// Model name in the database //
	model_name : 'res.partner',	
	
	url: "/#demandeurs/:id",

	relations: [
/*	{
		type: Backbone.HasOne,
		key: 'type_id',
		relatedModel: 'app.Models.ClaimerType',
		includeInJSON: true,
		reverseRelation: {
			key: 'claimers'
		}
	},*/
//	{
//		type: Backbone.HasOne,
//		key: 'service_id',
//		relatedModel: 'app.Models.ClaimerService',
//		includeInJSON: true,
//	}
	],
	
	relations: [
        {
			type: Backbone.HasMany,
			key: 'address',
			relatedModel: 'app.Models.ClaimerContact',
			includeInJSON: true,
	        reverseRelation: {
				type: Backbone.HasOne,
	            key: 'livesIn',
	            includeInJSON: true,
	        }
        },
    ],
	
    
	/** Model Initialization
	*/
    initialize: function(){
        console.log('Claimer Model initialization');
        this.fetchRelated('service_id');
    },



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },


	
	/** Delete Claimer
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
