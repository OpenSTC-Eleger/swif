/******************************************
* Officers Collection
*/
app.Collections.Officers = app.Collections.GenericCollection.extend({

	model : app.Models.Officer,

	url   : '/api/open_object/users',

	fields: ["complete_name", "contact_id", "date", "firstname", "current_group", "id", "isDST", "isManager", "lastname", "login", "name", "phone", "service_id", "service_ids", "user_email"],

	default_sort : { by: 'name', order: 'ASC' },


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Requests collection Initialization');
	}

});