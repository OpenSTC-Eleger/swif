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
	{
		type: Backbone.HasOne,
		key: 'service_id',
		relatedModel: 'app.Models.ClaimerService',
		includeInJSON: true,
	}
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

});
