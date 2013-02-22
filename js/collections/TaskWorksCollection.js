/******************************************
* Sites Collection
*/
app.Collections.TaskWorks = Backbone.Collection.extend({

    model: app.Models.TaskWork,

    // Model name in the database //
    model_name : 'project.task.work',

    url: "times",


    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Task Works collection Initialization');
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
    
    
    /** Comparator for ordering collection
     */
    comparator: function(item) {
	  return item.get("name");
	},


});
