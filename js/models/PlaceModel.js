/******************************************
* Place Model
*/
app.Models.Place = Backbone.RelationalModel.extend({
	
	model_name : 'openstc.site',	
    
	url: "/#places/:id",

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Place Model initialization');
    },


});