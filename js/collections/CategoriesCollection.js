/******************************************
* Categories Collection
*/
app.Collections.Categories = Backbone.Collection.extend({

    model: app.Models.Category,

    // Model name in the database //
    model_name : 'openstc.task.category',
    
   	url: "categories",
   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Categories collection Initialization');
    },



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

});
