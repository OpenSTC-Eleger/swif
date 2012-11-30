/******************************************
* Place Model
*/
app.Models.ClaimerType = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.partner.type',
	
	url: "/type-demandeurs/:id",


	relations: [{
		type: Backbone.HasMany,
		key: 'claimers',
		relatedModel: 'app.Models.Claimer',
		collectionType: 'app.Collections.Claimers',
		includeInJSON: true,
//		reverseRelation: {
//			key: 'type_id',
//			includeInJSON: true,
//		}
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
