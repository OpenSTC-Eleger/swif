/******************************************
* Claimers Types Collection
*/

// fields = ["claimers", "code", "id", "name"]

app.Collections.ClaimersTypes = app.Collections.GenericCollection.extend({

    model: app.Models.ClaimerType,

    url: '/api/open_object/partner_types',

    /** Collection Initialization
    */
    initialize: function (options) {
    	//console.log('Claimer type collection Initialization');
    },

	/** Comparator for ordering collection
    */
    comparator: function(item) {
 	  return item.get("name");
 	},


});
