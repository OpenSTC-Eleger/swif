/******************************************
* Claimers Contacts Collection
*/
app.Collections.ClaimersContacts = app.Collections.GenericCollection.extend({

	model       : app.Models.ClaimerContact,
	
	url         : "/api/open_object/partner_addresses",
	
	fields      : ['id', 'name', 'email', 'function', 'livesIn', 'mobile', 'partner_id', 'phone', 'street', 'type', 'user_id', 'zip', 'city'],
	
	default_sort: { by: 'name', order: 'ASC' },



	/** Collection Initialization
	*/
	initialize : function() {
		//console.log('Claimer Contact collection Initialization');
	},

});