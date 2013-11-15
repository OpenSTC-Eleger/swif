define([
	'genericModel'

], function(GenericModel){

	'user strict';


	/******************************************
	* Equipment Model
	*/
	var EquipmentTypeModel = GenericModel.extend({
	    
		urlRoot: "/api/openstc/equipment_categories",

		fields : ['id', 'name', 'is_equipment', 'is_vehicle'],


		/** Model Initialization
		*/
		initialize: function(){
			//console.log('Equipment Model initialization');
		},

	});

return EquipmentTypeModel;

});