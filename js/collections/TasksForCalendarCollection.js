/******************************************
* Sites Collection
*/
app.Collections.TasksForCalendar = Backbone.Collection.extend({

    model: app.Models.TaskForCalendar,

    // Model name in the database //
    model_name : 'project.task',

    url: "taskForCalendar",

//	url : function( models ) {
//		return this.url;
//	},
//   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Tasks collection Initialization');
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
