/******************************************
* Requests Collection
*/
app.Collections.Requests = app.Collections.GenericCollection.extend({

	model: app.Models.Request,

	// Model name in the database //
	model_name : 'openstc.ask',

    url: '/api/openstc/intervention_requests',

	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Requests collection Initialization');
	},


//
//	/** Collection Sync
//	*/
//	sync: function(method, model, options) {
//		var fields = ["actions", "belongsToAssignement", "tooltip", "belongsToService", "id", "name", "belongsToSite", "create_date", "create_uid", "date_deadline", "description", "id", "intervention_assignement_id", "intervention_ids", "manager_id", "name", "note", "partner_address", "partner_email", "partner_id", "partner_phone", "partner_service_id", "partner_type", "partner_type_code", "people_email", "people_name", "people_phone", "refusal_reason", "service_id", "site1", "site_details", "state", "write_uid"];
//
//		return app.readOE(this.model_name, app.models.user.getSessionID(), options, fields);
//	},


//
//	/** Collection Parse
//	*/
//	parse: function(response) {
//		return response.result.records;
//	},
	
	

	/** Comparator for ordering collection
	*/
	comparator: function(item) {
		var mCreateDate = moment(item.get('create_date'))
		item.set({'create_date': mCreateDate});
		return -item.get('create_date');
	}

});
