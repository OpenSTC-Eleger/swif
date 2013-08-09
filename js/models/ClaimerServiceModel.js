/******************************************
* Claimer Service Model
*/
app.Models.ClaimerService = Backbone.RelationalModel.extend({
 

	fields   : ['id', 'actions', 'name', 'complete_name', 'service_names', 'site_parent_id', 'surface'],
	
	urlRoot  : '/api/openstc/sites',

		
	/** Model Initialization
	*/
    initialize: function(){
        //console.log('Claimer Service Request Model initialization');
    },


    /** Check if the Service is a technical service
    */
    isTechnical: function() {
        return this.get('technical');
    },


    /** Model Parser
     */
    parse: function(response) {    	
        return response;
    },



    /** Save Model
	*/
	save: function(data,options) { 
		app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(),options);
	},



	/** Destroy service
	*/
	destroy: function (options) {	
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	}

});
