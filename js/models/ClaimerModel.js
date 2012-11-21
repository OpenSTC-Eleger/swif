/******************************************
* Claimer Model
*/
openstm.Models.Claimer = Backbone.RelationalModel.extend({
    
	// Model name in the database //
	model_name : 'res.partner',	
	
	url: "/#demandeurs/:id",

	relations: [
	{
		// Create a cozy, recursive, one-to-one relationship
		type: Backbone.HasOne,
		key: 'type_id',
		relatedModel: 'openstm.Models.ClaimerType',
		includeInJSON: true,
		reverseRelation: {
			key: 'claimers'
		}
	}],
	
    
	/** Model Initialization
	*/
    initialize: function(){
        console.log('Claimer Model initialization');
    },

    /** Model Parser
    */
    parse: function(response) {
        return response;
    },

});
