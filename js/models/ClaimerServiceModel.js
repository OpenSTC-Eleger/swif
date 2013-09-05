/******************************************
* Claimer Service Model
*/
app.Models.ClaimerService = app.Models.GenericModel.extend({
 

	fields   : ['id', 'actions', 'name', 'complete_name', 'service_names', 'site_parent_id', 'surface'],
	
	urlRoot  : '/api/openstc/sites',

		

    /** Check if the Service is a technical service
    */
    isTechnical: function() {
        return this.get('technical');
    },

});