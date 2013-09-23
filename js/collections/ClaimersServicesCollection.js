/******************************************
* Claimers Services Collection
*/
app.Collections.ClaimersServices = app.Collections.GenericCollection.extend({

	model        : app.Models.ClaimerService,

	url          : '/api/openstc/departments',

	fields       : ['id', 'name', 'code', 'service_id', 'technical', 'manager_id', 'actions'],

	default_sort : { by: 'name', order: 'ASC' },



	/** Collection Initialization
	*/
	initialize : function() {
		//console.log('Claimer Services collection Initialization');
	},

});