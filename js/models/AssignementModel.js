/******************************************
* Assignement Request Model
*/
app.Models.Assignement = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.intervention.assignement',	
	
	url: "/#assignement/:id",

	

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Assignement Request Model initialization');
    },
    
    /** Model Parser */
    parse: function(response) {    	
        return response;
    },


});
