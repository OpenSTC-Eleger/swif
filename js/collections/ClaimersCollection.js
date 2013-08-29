/******************************************
* Claimers Collection
*/

// fields = ["address", "category_id", "contract_ids", "id", "email", "name", "phone", "service_id", "task_ids", "technical_service_id", "technical_site_id", "title", "type_id", "user_id"]

app.Collections.Claimers = app.Collections.GenericCollection.extend({

	model : app.Models.Claimer,

	url: "/api/open_object/partners",
	


	/** Collection Initialization
	*/
	initialize : function() {
	},

});
