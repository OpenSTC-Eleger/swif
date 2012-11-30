/******************************************
* Sites Collection
*/
app.Collections.Assignements = Backbone.Collection.extend({

    model: app.Models.Assignement,

    // Model name in the database //
    model_name : 'openstc.intervention.assignement',
    
   	url: "assignement",
   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Request assignement collection Initialization');
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
