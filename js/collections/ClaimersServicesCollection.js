/******************************************
* Claimers Services Collection
*/
app.Collections.ClaimersServices = app.Collections.GenericCollection.extend({

	model        : app.Models.ClaimerService,

	url          : '/api/openstc/departments',

	fields       : ['id', 'category_ids', 'code', 'manager_id', 'name', 'service_id', 'technical', 'user_ids'],

	default_sort : { by: 'name', order: 'ASC' },



	/** Collection Initialization
	*/
	initialize : function() {
		//console.log('Claimer Services collection Initialization');
	},

});