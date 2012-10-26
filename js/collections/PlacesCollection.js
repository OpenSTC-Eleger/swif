/******************************************
* Sites Collection
*/
openstm.Collections.Places = Backbone.Collection.extend({

    model: openstm.Models.Place,

    // Model name in the database //
    model_name : 'openctm.site',

   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Sites collection Initialization');
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {
    	openstm.readOE( this.model_name ,  openstm.models.user.getSessionID(), options);
    },



    /** Collection Parse
    */
    parse: function(response) {
        return response.result.records;
    }


});
