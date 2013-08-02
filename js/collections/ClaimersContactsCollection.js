/******************************************
* Claimers Contacts Collection
*/

// fields = ["email", "function", "id", "livesIn", "mobile", "name", "partner_id", "phone", "street", "type", "user_id", "zip"]

app.Collections.ClaimersContacts = app.Collections.GenericCollection.extend({

	model : app.Models.ClaimerContact,

	url: "/api/open_object/partner_addresses",

	/** Collection Initialization
	*/
	initialize : function() {
		//console.log('Claimer Contact collection initialize');
	},

	/** Comparator for ordering collection
	 */
	comparator: function(item) {
		return item.get("name");
	},


});
