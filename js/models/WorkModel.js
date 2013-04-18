/******************************************
* Work Model
*/
app.Models.Work = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'openstc.team.users.rel',	
	
	url: '/#work/:id',



	/** Model Initialization
	*/
	initialize: function (model) {
	   	console.log('Work Model Initialization');
	},



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },

});