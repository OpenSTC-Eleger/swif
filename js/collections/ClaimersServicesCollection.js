/******************************************
* Claimers Services Collection
*/
openstm.Collections.ClaimersServices = Backbone.Collection.extend({

    model : openstm.Models.ClaimerService,

    // Model name in the database //
    model_name : 'openctm.service',

    url: "demandeurs-services",   
    
    /** Collection Initialization
    */
    initialize : function() {
        console.log('Claimer Service collection initialize');
    },


    /** Collection Sync
    */
    sync: function(method, model, options) {
    	openstm.readOE(this.model_name, openstm.models.user.getSessionID(), options);
    },


    /** Collection Parse
    */
    parse: function(response) {
        return response.result.records;
    }

});
