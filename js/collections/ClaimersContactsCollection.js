/******************************************
* Claimers Contacts Collection
*/
app.Collections.ClaimersContacts = Backbone.Collection.extend({

    model : app.Models.ClaimerContact,

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
    	app.readOE(this.model_name, app.models.user.getSessionID(), options);
    },


    /** Collection Parse
    */
    parse: function(response) {
        return response.result.records;
    },
    
	/** Comparator for ordering collection
     */
    comparator: function(item) {
 	  return item.get("name");
 	},

});
