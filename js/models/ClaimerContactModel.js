/******************************************
* Claimer Contact Model
*/
app.Models.ClaimerContact = Backbone.RelationalModel.extend({
    
	// Model name in the database //
	model_name : 'res.partner.address',	
	
	url: "/#demandeurs-contacts/:id",
	
    

	/** Model Initialization
	*/
    initialize: function(){

    },


//TODO remove
//    /** Model Parser
//    */
//    parse: function(response) {
//        return response;
//    },
    

// TODO remove
//    /** Save Officer
//	*/
//	save: function(data, id, options) {
//		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(),options);
//	},
//

//TODO remove
//	/** Delete claimer contact
//	*/
//	delete: function (options) {
//		app.deleteOE(
//			[[this.get("id")]],
//			this.model_name,
//			app.models.user.getSessionID(),
//			options
//		);
//	}

});
