/******************************************
* Officers Collection
*/
app.Collections.Officers = app.Collections.GenericCollection.extend({

	model: app.Models.Officer,

	 fields : ["complete_name", "contact_id", "context_lang", "context_tz", "date", "firstname", "groups_id", "id", "isDST", "isManager", "lastname", "login", "name", "phone", "service_id", "service_ids", "tasks", "team_ids", "user_email"],

	url: '/api/open_object/users',

	// Model name in the database //

	
	
	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Requests collection Initialization');
	},


	/** Comparator for ordering collection
	*/
	comparator: function(item) {
		var lastname = item.get('name');
		if ( lastname )
			return lastname.toUpperCase();
	},
	

});
