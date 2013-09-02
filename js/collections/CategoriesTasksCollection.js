/******************************************
* Categories Tasks collection
*/
app.Collections.CategoriesTasks = app.Collections.GenericCollection.extend({

	model        : app.Models.CategoryTask,

	fields       : ['id', 'name', 'code', 'parent_id', 'service_names', 'actions'],

	default_sort : { by: 'name', order: 'ASC' },

	url          : '/api/openstc/task_categories',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Categories Tasks Initialization');
	}

});