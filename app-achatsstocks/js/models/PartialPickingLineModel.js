define([
	'app',
	'appHelpers',
	'genericModel',
	


], function(app, AppHelpers, GenericModel){

	'use strict';
	
	/******************************************
	* Booking Model
	*/
	return GenericModel.extend({
		
		urlRoot: '/api/open_achats_stock/partial_picking_lines',

		fields: ['id', 'product_id', 'quantity'],
		
		readonlyFields: ['actions', 'id'],
				
		getId: function(){
			return this.get('id');
		},
		
		initialize: function(){

		},
	
	
	}, {
		// Request State Initialization //
		status : {},
		
			// Actions of the requests //
		}
	);
});