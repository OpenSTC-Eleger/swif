/******************************************
* Sites Collection
*/
openstm.Collections.Assignements = Backbone.Collection.extend({

    model: openstm.Models.Assignement,

    // Model name in the database //
    model_name : 'openctm.intervention.assignement',
    
   	url: "assignement",
   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Request assignement collection Initialization');
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
    },

});
