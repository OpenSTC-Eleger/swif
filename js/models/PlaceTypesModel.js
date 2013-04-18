/******************************************
* Place Type Model
*/
app.Models.PlaceType = Backbone.RelationalModel.extend({
	
	model_name : 'openstc.site.type',	
    
	url: "/#placeTypes/:id",


	/** Model Initialization
	*/
    initialize: function(){
        console.log('Place type Model initialization');
    },

    
    /** Model Parser 
    */
    parse: function(response) {    	
        return response;
    },
    


});