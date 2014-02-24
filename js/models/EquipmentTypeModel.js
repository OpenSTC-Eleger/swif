/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericModel'

], function(GenericModel){

	'use strict';


	/******************************************
	* Equipment Model
	*/
	var EquipmentTypeModel = GenericModel.extend({

		urlRoot: '/api/openstc/equipment_categories',

		fields : ['id', 'name', 'is_equipment', 'is_vehicle'],


		/** Model Initialization
		*/
		initialize: function(){
			//console.log('Equipment Model initialization');
		}

	});

	return EquipmentTypeModel;

});