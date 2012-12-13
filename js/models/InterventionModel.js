/******************************************
* Place Model
*/
app.Models.Intervention = Backbone.RelationalModel.extend({
    
	model_name : 'project.project',	
	
	url: "/#demandes-dinterventions/:id",

	
	relations: [{
		type: Backbone.HasMany,
		key: 'tasks',
		relatedModel: 'app.Models.Task',
		collectionType: 'app.Collections.Tasks',
		includeInJSON: true,
//		reverseRelation: {
//			key: 'project_id',
//			includeInJSON: true,
//		}
	}],

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Intervention Model initialization');
        this.fetchRelated('tasks');
    },
    
    /** Model Parser */
    parse: function(response) {    	
        return response;
    },
    
	save: function(data,options) { 
    	app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(), options);
	},


});
