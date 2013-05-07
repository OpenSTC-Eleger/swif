/******************************************
* Claimer Contact Model
*/
app.Models.ClaimerContact = Backbone.RelationalModel.extend({
    
	// Model name in the database //
	model_name : 'res.partner.address',	
	
	url: "/#demandeurs-contacts/:id",

//	relations: [
//	{
//		type: Backbone.HasMany,
//		key: 'partner_id',
//		relatedModel: 'app.Models.Claimer',
//		includeInJSON: true,
//	}],
	
    

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Claimer Contact Model initialization');
        //this.fetchRelated('partner_id');
    },



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },
    
    /** Save Officer
	*/
	save: function(data, id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(),options);
	},
    

	/** Delete claimer contact
	*/
	delete: function (options) {	
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	}

});
