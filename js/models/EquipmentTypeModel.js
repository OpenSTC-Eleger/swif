/******************************************
* Equipment Model
*/
app.Models.EquipmentType = app.Models.GenericModel.extend({
    
	urlRoot: "/api/openstc/equipment_categories",

	fields : ['id', 'name', 'is_equipment', 'is_vehicle'],


	/** Model Initialization
	*/
	initialize: function(){
		//console.log('Equipment Model initialization');
	},


});