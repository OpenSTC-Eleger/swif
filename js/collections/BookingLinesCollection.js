/******************************************
* Reservations Collection
*/
app.Collections.BookingLines = app.Collections.GenericCollection.extend({

	model : app.Models.Booking,
	
	url   : "/api/openresa/booking_lines",
	
	fields: ['id', 'name', 'reserve_product'],

	/** Collection Sync
	*/
	sync: function(method, model, options){

		options.data.fields = this.fields;

		return $.when(this.count(options), Backbone.sync.call(this,method,this,options));
	}

});