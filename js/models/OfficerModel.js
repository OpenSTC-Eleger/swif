/******************************************
* Place Model
*/
openstm.Models.Officer = Backbone.RelationalModel.extend({
    
	model_name: "res.users",
	
	url: "/#officers/:id",
	
	relations: [{
		type: Backbone.HasMany,
		key: 'tasks',
		relatedModel: 'openstm.Models.Task',
		collectionType: 'openstm.Collections.Tasks',
		includeInJSON: true,
	}],

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Officer Model initialization');
        this.fetchRelated('tasks');
    },
    
    /** Model Parser
    	    */
    parse: function(response) {
        return response;
    },

});