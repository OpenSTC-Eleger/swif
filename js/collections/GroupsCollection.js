/******************************************
* Sites Collection
*/
app.Collections.Groups = Backbone.Collection.extend({

    model: app.Models.Group,

    // Model name in the database //
    model_name : 'res.groups',
    
   	url: "groups",

   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Groups collection Initialization');
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
