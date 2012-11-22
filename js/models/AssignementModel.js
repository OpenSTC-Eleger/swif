/******************************************
* Assignement Request Model
*/
openstm.Models.Assignement = Backbone.RelationalModel.extend({
    
	model_name : 'openctm.intervention.assignement',	
	
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
