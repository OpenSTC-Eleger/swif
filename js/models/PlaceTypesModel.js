/******************************************
* Place Type Model
*/
app.Models.PlaceType = Backbone.RelationalModel.extend({
	

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