/******************************************
* Interventions Collection
*/
app.Collections.Interventions = app.Collections.STCCollection.extend({

	model: app.Models.Intervention,

	// Model name in the database //
	model_name : 'project.project',
	
	url: "demandes-dinterventions",



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Interventions collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		var fields = ["active", "ask", "cancel_reason", "complete_name", "contact_id", "create_date", "create_uid", "overPourcent", "tooltip", "date_deadline", "date_start", "description", "effective_hours", "id", "name", "partner_id", "planned_hours", "progress_rate", "service_id", "site1", "site_details", "state", "tasks", "total_hours", "user_id"];
		
		return app.readOE( this.model_name ,  app.models.user.getSessionID(), options, fields);
	},



	/** Collection Parse
	*/
	parse: function(response) {    	
		return response.result.records;
	},



	/** Comparator for ordering collection
	*/
	comparator: function(item) {
		var mCreateDate = moment(item.get('create_date'))
		item.set({'create_date': mCreateDate});
		return -item.get('create_date');
	},	


});
