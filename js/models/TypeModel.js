/******************************************
* Assignement Request Model
*/
app.Models.Type = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.site.type',	
	
	url: "/#type/:id",
      
    defaults:{
	},


	/** Model Initialization
	*/
    initialize: function(){
        console.log('Type Request Model initialization');
    },



    /** Model Parser
    */
    parse: function(response) {    	
        return response;
    },
    
    update: function(params) {
	},
    
    /** Save Model
	*/
	save: function(data,options) { 
		app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(),options);
	},



	/** Delete category
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
