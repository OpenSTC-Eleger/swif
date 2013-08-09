/******************************************
* Categories Tasks collection
*/
app.Collections.CategoriesTasks = app.Collections.GenericCollection.extend({

	model  : app.Models.CategoryTask,
	
	fields : ['id', 'name', 'code', 'complete_name', 'parent_id', 'service_ids'],

	url    : '/api/openstc/task_categories',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Categories collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options){

		options.data.fields = this.fields;

		return $.when(this.count(options), Backbone.sync.call(this, method, this, options));
	},

});
