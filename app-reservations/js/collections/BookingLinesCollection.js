define([
	'app', 
	'genericCollection',
	'bookingLineModel'

], function(app, GenericCollection, BookingLineModel){

	'use strict';


	/******************************************
	* Reservations Collection
	*/
	var bookingLines = GenericCollection.extend({
	
		model : BookingLineModel,
		
		url   : "/api/openresa/booking_lines",
		
		fields : ['id', 'name', 'reserve_product', 'qte_dispo', 'qte_reserves', 'pricelist_amount','dispo'],
	
		/** Collection Sync
		*/
		sync: function(method, model, options){
	
			options.data.fields = this.fields;
	
			return $.when(this.count(options), Backbone.sync.call(this,method,this,options));
		}
	
	});

	return bookingLines;

});