/******************************************
* Places Collection
*/
app.Collections.Places = app.Collections.STCCollection.extend({

	model      : app.Models.Place,
	
	model_name : 'openstc.site',
	
	fields     : ["code", "complete_name", "id", "lenght", "name", "service", "service_ids", "site_parent_id", "surface", "type", "width"],


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Place collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options){

		var deferred = $.Deferred();

		$.when(this.count(), app.readOE(this.model_name, app.models.user.getSessionID(), options, this.fields))
		.done(function(){
			deferred.resolve();
		})

		return  deferred;
	},



	/** Collection Parse
	*/
	parse: function(response) {
		return response.result.records;
	},


});
