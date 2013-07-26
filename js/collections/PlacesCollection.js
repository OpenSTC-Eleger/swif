/******************************************
* Places Collection
*/
app.Collections.Places = app.Collections.GenericCollection.extend({

	model      : app.Models.Place,

	fields     : ["id", "name", "complete_name", "type", "service_ids", "service_names", "site_parent_id", "width", "lenght", "surface"],


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
		})

		return  deferred;
	},


});