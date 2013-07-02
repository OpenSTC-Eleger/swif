/******************************************
* Categories Collection - Task categories
*/
app.Collections.CategoriesTasks = Backbone.Collection.extend({

    model: app.Models.CategoryTask,

    // Model name in the database //
    model_name : 'openstc.task.category',
    
   	url: 'categories',


    /** Collection Sync
    */
    sync: function(method, model, options) {
    	app.readOE( this.model_name ,  app.models.user.getSessionID(), options);
    },



    /** Collection Parse
    */
    parse: function(response) {    	
        return response.result.records;
    },


    
    /** Comparator for ordering collection
    */
    comparator: function(item) {
	  return item.get('complete_name');
	},

});
