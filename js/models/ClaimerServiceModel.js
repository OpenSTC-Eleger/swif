/******************************************
* Assignement Request Model
*/
app.Models.ClaimerService = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.service',	
	
	url: "/#demandeurs-services/:id",

	relations: [
            {
				type: Backbone.HasMany,
				key: 'asksBelongsto',
				relatedModel: 'app.Models.Request',
				//collectionType: 'app.Collections.Requests',
				//includeInJSON: true,
		        reverseRelation: {
					type: Backbone.HasOne,
		            key: 'belongsToService',
		            includeInJSON: ['id','name'],
		            // 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
		        }
            },
      ],

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Claimer Service Request Model initialization');
        //this.fetchRelated('asksBelongsto');
        //this.fetchRelated('belongsToService');
    },
    
    /** Model Parser */
    parse: function(response) {    	
        return response;
    },


});
