/******************************************
* Places Collection
*/
app.Collections.Places = app.Collections.GenericCollection.extend({

	model        : app.Models.Place,

	fields       : ['id', 'actions', 'name', 'complete_name', 'service_names', 'site_parent_id', 'surface'],

	default_sort : { by: 'name', order: 'ASC' },

	url          : '/api/openstc/sites',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Place collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options){

		options.data.fields = this.fields;

		return $.when(this.count(options), Backbone.sync.call(this, method, this, options));
	},

});