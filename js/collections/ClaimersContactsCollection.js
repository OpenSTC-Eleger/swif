/******************************************
* Claimers Contacts Collection
*/
openstm.Collections.ClaimersContacts = Backbone.Collection.extend({

    model : openstm.Models.ClaimerContact,

    // Model name in the database //
    model_name : 'res.partner.address',

    url: "demandeurs-contacts",   
    
    /** Collection Initialization
    */
    initialize : function() {
        console.log('Claimer Contact collection initialize');
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
