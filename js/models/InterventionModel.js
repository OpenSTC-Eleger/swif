/******************************************
* Place Model
*/
openstm.Models.Intervention = Backbone.RelationalModel.extend({
    
	model_name : 'project.project',	
	
	url: "/demandes-dinterventions/:id",

	
	relations: [{
		type: Backbone.HasMany,
		key: 'tasks',
		relatedModel: 'openstm.Models.Task',
		collectionType: 'openstm.Collections.Tasks',
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


});