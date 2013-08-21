/******************************************
* Categories Tasks collection
*/
app.Collections.CategoriesTasks = app.Collections.GenericCollection.extend({

	model        : app.Models.CategoryTask,

	fields       : ['id', 'name', 'code', 'complete_name', 'parent_id', 'service_ids'],

	default_sort : { by: 'name', order: 'ASC' },

	url          : '/api/openstc/task_categories',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Categories Tasks Collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options){

		if(_.isUndefined(options.data)){options.data = {}}
		options.data.fields = this.fields;

		return $.when(this.count(options), Backbone.sync.call(this, method, this, options));
	},

});
