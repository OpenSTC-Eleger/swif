define([
	'genericCollection',
	'claimerContactModel'

], function(GenericCollection, ClaimerContactModel){



	/******************************************
	* Claimers Contacts Collection
	*/
	var ClaimersContactsCollection = GenericCollection.extend({

		model       : ClaimerContactModel,
		
		url         : "/api/open_object/partner_addresses",
		
		fields      : ['id', 'name', 'email', 'function', 'livesIn', 'mobile', 'partner_id', 'phone', 'street', 'type', 'user_id', 'zip', 'city'],
		
		default_sort: { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize : function() {
			//console.log('Claimer Contact collection Initialization');
		},

	});

return ClaimersContactsCollection;

});