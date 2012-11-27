/******************************************
* Requests Collection
*/
app.Collections.Officers = Backbone.Collection.extend({

    model: app.Models.Officer,

    // Model name in the database //
    model_name : 'res.users',

    
    
    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Requests collection Initialization');
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {	
    	app.readOE(this.model_name, app.models.user.getSessionID(), options);
    },



    /** Collection Parse
    */
    parse: function(response) {
        return response.result.records;
    }

});
