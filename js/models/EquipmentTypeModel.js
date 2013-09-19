/******************************************
* Equipment Model
*/
app.Models.EquipmentType = app.Models.GenericModel.extend({
    
	model_name : 'product.category',
	
	urlRoot: "/api/openstc/equipment_categories",

	/** Model Initialization
	*/
	initialize: function(){
		//console.log('Equipment Model initialization');
	},


});