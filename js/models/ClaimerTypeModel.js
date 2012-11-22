/******************************************
* Place Model
*/
openstm.Models.ClaimerType = Backbone.RelationalModel.extend({
    
	model_name : 'openctm.partner.type',
	
	url: "/type-demandeurs/:id",


	relations: [{
		type: Backbone.HasMany,
		key: 'claimers',
		relatedModel: 'openstm.Models.Claimer',
		collectionType: 'openstm.Collections.Claimers',
		includeInJSON: true,
		reverseRelation: {
			key: 'type_id',
			includeInJSON: true,
		}
	}],

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Claimer Type Model initialization');
        this.fetchRelated('claimers');
    },

    /** Model Parser */
    parse: function(response) {    	
        return response;
    },

});
