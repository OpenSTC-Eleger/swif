/******************************************
* Assignement Request Model
*/
app.Models.Category = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.task.category',	
	
	url: "/#category/:id",

	relations: [
            {
				type: Backbone.HasMany,
				key: 'tasksAssigned',
				relatedModel: 'app.Models.Task',
		        reverseRelation: {
					type: Backbone.HasOne,
		            key: 'belongsToCategory',
		            includeInJSON: 'id',
		        }
            },
      ],

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Category Request Model initialization');
    },
    
    /** Model Parser */
    parse: function(response) {    	
        return response;
    },


});
