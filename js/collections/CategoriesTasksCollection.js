/******************************************
* Categories Collection - Task categories
*/

// fields = ["code", "complete_name", "id", "name", "parent_id", "service_ids"]

app.Collections.CategoriesTasks = app.Collections.GenericCollection.extend({

	model: app.Models.CategoryTask,

	// Model name in the database //
	model_name : 'openstc.task.category',
	
	url: '/api/openstc/task_categories',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Categories collection Initialization');
	},

	/** Comparator for ordering collection
	*/
	comparator: function(item) {
		return item.get('complete_name');
	},

});
