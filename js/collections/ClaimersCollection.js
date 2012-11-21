/******************************************
* Claimers Collection
*/
openstm.Collections.Claimers = Backbone.Collection.extend({

    model : openstm.Models.Claimer,

    // Model name in the database //
    model_name : 'res.partner',

    url: "demandeurs",   
    
    /** Collection Initialization
    */
    initialize : function() {
        console.log('Claimer collection initialize');
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
