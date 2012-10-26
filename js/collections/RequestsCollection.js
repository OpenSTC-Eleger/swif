/******************************************
* Requests Collection
*/
openstm.Collections.Requests = Backbone.Collection.extend({

    model: openstm.Models.Request,

    // Model name in the database //
    model_name : 'openctm.ask',

    
    
    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Requests collection Initialization');
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {	
    	openstm.readOE( this.model_name , openstm.models.user.getSessionID(), options);
    },



    /** Collection Parse
    */
    parse: function(response) {
        return response.result.records;
    }

});
