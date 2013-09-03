/******************************************
* Categories Tasks collection
*/
app.Collections.CategoriesTasks = app.Collections.GenericCollection.extend({

	model        : app.Models.CategoryTask,

	url          : '/api/openstc/task_categories',

	fields       : ['id', 'name', 'code', 'parent_id', 'service_names', 'actions'],

	default_sort : { by: 'name', order: 'ASC' },



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Categories Tasks Initialization');
	}

});