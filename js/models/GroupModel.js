/******************************************
* Group Model - User group OpenERP
*/
app.Models.Group = Backbone.RelationalModel.extend({
    
	model_name : 'res.groups',	
	
	url: "/groups/:id",



	/** Model Initialization
	*/
    initialize: function(){
        console.log('Intervention Model initialization');
    },
    


    /** Model Parser
    */
    parse: function(response) {    	
        return response;
    },
});