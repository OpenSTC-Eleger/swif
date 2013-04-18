/******************************************
* Assignement Request Model - Intervention classification for budget
*/
app.Models.Assignement = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.intervention.assignement',	
	
	url: "/#assignement/:id",

	relations: [
        {
			type: Backbone.HasMany,
			key: 'asksAssigned',
			relatedModel: 'app.Models.Request',
			//collectionType: 'app.Collections.Requests',
			//includeInJSON: true,
	        reverseRelation: {
				type: Backbone.HasOne,
	            key: 'belongsToAssignement',
	            includeInJSON: 'id',
	            // 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
	        }
        },
      ],



	/** Model Initialization
	*/
    initialize: function(){
        console.log('Assignement Request Model initialization');
    },
    


    /** Model Parser */
    parse: function(response) {    	
        return response;
    },


});
