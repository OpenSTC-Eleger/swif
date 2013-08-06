/******************************************
* Places Collection
*/
app.Collections.Places = app.Collections.GenericCollection.extend({

	model        : app.Models.Place,

	fields       : ["id", "complete_name", "service_ids", "service_names", "site_parent_id", "surface"],

	default_sort : { by: 'name', order: 'ASC' },

	url: '/api/openstc/sites',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Place collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options){
		var deferred = $.Deferred();

		$.when(this.count(options), Backbone.sync.call(this,method,this,options))
		.done(function(){
			deferred.resolve();
		});

		return  deferred;
	},


	/** Collection Parse
	*/
	parse: function(response, options) {
		this.reset(response);
		return response;
	}


});