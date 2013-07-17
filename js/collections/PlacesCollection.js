/******************************************
* Places Collection
*/
app.Collections.Places = app.Collections.GenericCollection.extend({

	model      : app.Models.Place,

	model_name : 'openstc.site',

	fields     : ["id", "name", "complete_name", "type", "service_ids", "site_parent_id", "width", "lenght", "surface"],


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Place collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options){

		var deferred = $.Deferred();

		$.when(this.count(options), app.readOE(this.model_name, app.models.user.getSessionID(), options, this.fields))
		.done(function(){
			deferred.resolve();
		})

		return  deferred;
	},



	/** Collection Parse
	*/
	parse: function(response, options) {
		this.reset(response);
		return response.result.records;
	},


});