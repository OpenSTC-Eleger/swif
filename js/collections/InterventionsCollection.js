/******************************************
* Interventions Collection
*/
app.Collections.Interventions = app.Collections.STCCollection.extend({

	model: app.Models.Intervention,

	// Model name in the database //
	model_name : 'project.project',
	
	url: "demandes-dinterventions",



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		app.readOE( this.model_name ,  app.models.user.getSessionID(), options);		
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
