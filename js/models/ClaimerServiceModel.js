/******************************************
* Claimer Service Model
*/
openstm.Models.ClaimerService = Backbone.RelationalModel.extend({
    
	// Model name in the database //
	model_name : 'openctm.service',	
	
	url: "/#demandeurs-services/:id",

/*	relations: [
	{
		// Create a cozy, recursive, one-to-one relationship
		type: Backbone.HasMany,
		key: '',
		relatedModel: 'openstm.Models.Claimer',
		includeInJSON: true,
		reverseRelation: {
			key: 'service_id'
		}
	}],*/
	
    
	/** Model Initialization
	*/
    initialize: function(){
        console.log('Claimer Service Model initialization');
    },

    /** Model Parser
    */
    parse: function(response) {
        return response;
    },

});
