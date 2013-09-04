/******************************************
* Claimers Collection
*/
app.Collections.Claimers = app.Collections.GenericCollection.extend({

	model       : app.Models.Claimer,
	
	url         : "/api/open_object/partners",
	
	fields      : ['id', 'name', 'address', 'category_id', 'contract_ids', 'email', 'phone', 'service_id', 'task_ids', 'technical_service_id', 'technical_site_id', 'title', 'type_id', 'user_id'],
	
	default_sort: { by: 'name', order: 'ASC' },
	


	/** Collection Initialization
	*/
	initialize : function() {
		//console.log('Claimer collection Initialization');
	},

});