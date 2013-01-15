/******************************************
* Assignement Request Model
*/
app.Models.ClaimerService = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.service',	
	
	url: "/#demandeurs-services/:id",

	relations: [ {
		type: Backbone.HasMany,
		key: 'asksBelongsto',
		relatedModel: 'app.Models.Request',
		//collectionType: 'app.Collections.Requests',
		includeInJSON: ['id','name'],
		reverseRelation: {
			type: Backbone.HasOne,
			key: 'belongsToService',
			includeInJSON: ['id','name'],
			// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
		}
	},
//    		{
//    			type: Backbone.HasMany,
//    			key: 'manager_id',
//    			relatedModel: 'app.Models.Officer',
//    			collectionType: 'app.Collections.Officers',
//    			includeInJSON: ['id']
//    		},
      ],

	
	/** Model Initialization
	*/
    initialize: function(){
        console.log('Claimer Service Request Model initialization');
        //this.fetchRelated('asksBelongsto');
        //this.fetchRelated('belongsToService');
    },


    /** Model Parser
     */
    parse: function(response) {    	
        return response;
    },

    /** Save Model
	*/
	save: function(data,options) { 
		app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(),options);
	},

	/** Destroy service
	*/
	destroy: function (options) {	
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	}





});
