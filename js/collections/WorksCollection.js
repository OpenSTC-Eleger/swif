/******************************************
* Sites Collection
*/
app.Collections.Works = Backbone.Collection.extend({

    model: app.Models.Work,

    // Model name in the database //
    model_name : 'openstc.team.users.rel',

    url: "works",

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Works collection Initialization');
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
