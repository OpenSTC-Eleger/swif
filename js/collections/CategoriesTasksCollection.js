/******************************************
* Categories Collection - Task categories
*/
app.Collections.CategoriesTasks = app.Collections.STCCollection.extend({

	model: app.Models.CategoryTask,

	// Model name in the database //
	model_name : 'openstc.task.category',
	
	url: 'categories',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Categories collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		var fields = ["code", "complete_name", "id", "name", "parent_id", "service_ids"];

		return app.readOE( this.model_name, app.models.user.getSessionID(), options, fields);
	},



	/** Collection Parse
	*/
	parse: function(response) {    	
		return response.result.records;
	},


	
	/** Comparator for ordering collection
	*/
	comparator: function(item) {
		return item.get('complete_name');
	},

});
