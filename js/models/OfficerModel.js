/******************************************
* Place Model
*/
app.Models.Officer = Backbone.RelationalModel.extend({
    
	model_name: "res.users",
	
	url: "/#officers/:id",
	
	relations: [{
		type: Backbone.HasMany,
		key: 'tasks',
		relatedModel: 'app.Models.Task',
		collectionType: 'app.Collections.Tasks',
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