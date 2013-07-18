/******************************************
* Group Model - User group OpenERP
*/
app.Models.STCGroup = Backbone.RelationalModel.extend({
	
	model_name : 'res.groups',
	
	url: "/groups/:id",



	/** Model Initialization
	*/
	initialize: function(){
		//console.log('STC Group initialization');
	},
	


	/** Model Parser
	*/
	parse: function(response) {
		return response;
	},
});