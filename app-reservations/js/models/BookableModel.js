/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericModel',

], function(GenericModel){

	'use strict';


	/******************************************
	* Booking Model
	*/
	var BookableModel = GenericModel.extend({

		urlRoot: '/api/openresa/bookables',

		fields : ['id', 'name', 'product_image', 'qty_available', 'type_prod', 'color', 'categ_id', 'block_booking'],

		searchable_fields: [
			{ key: 'id',        type: 'numeric' },
			{ key: 'name',      type: 'text' },
			{ key: 'type_prod', type: 'text' }
		],

		//method to retrieve attribute with standard return form
		getAttribute: function(key,default_value){
			var val = this.get(key);

			if(_.isUndefined(default_value)){
				default_value = false;
			}
			if(!_.isUndefined(val) && val !== '' && val !== false && val !== null){
				return val;
			}
			else{
				return default_value;
			}
		},

		getQtyAvailable: function(){
			return this.get('qty_available');
		},

		getProductImage: function(){
			return this.get('product_image');
		},

		getType: function(action){
			var type = this.get('type_prod');

			var returnVal;
			switch(action){
				case 'logo':
					if(type == 'site'){
						returnVal = '<i class="fa fa-map-marker"></i>';
					}
					else{
						returnVal = '<i class="fa fa-wrench"></i>';
					}
					break;
				default:
					returnVal = type;
			}

			return returnVal;

		},

		getColor: function(){
			if(this.get('color') !== false){
				return this.get('color');
			}
			else{
				return '#0BA4D8';
			}
		}


	});

	return BookableModel;
});