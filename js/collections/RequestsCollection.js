/******************************************
* Requests Collection
*/
app.Collections.Requests = app.Collections.GenericCollection.extend({

	model        : app.Models.Request,

	url          : '/api/openstc/intervention_requests',

	fields       : ["id", "name", "actions", "tooltip", "create_date", "create_uid", "date_deadline", "description", "manager_id", "note", "partner_address", "partner_id", "partner_phone", "partner_service_id", "partner_type", "partner_type_code", "people_name", "people_email", "people_phone", "refusal_reason", "service_id", "site1", "site_details", "state"],

	// Model name in the database //
	model_name   : 'openstc.ask',

	default_sort : { by: 'id', order: 'DESC' },


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Requests collection Initialization');
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
	}

});