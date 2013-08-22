/******************************************
* Teams Collection
*/
app.Collections.Teams = app.Collections.GenericCollection.extend({

	model        : app.Models.Team,

	fields       : ['id', 'name', 'actions', 'manager_id', 'service_names', 'user_names'],

	default_sort : { by: 'name', order: 'ASC' },

	url          : '/api/openstc/teams',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Teams collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options){

		if(_.isUndefined(options.data)) {
			options.data = {};
		}
		options.data.fields = this.fields;

		return $.when(this.count(options), Backbone.sync.call(this, method, this, options));
	},

});
