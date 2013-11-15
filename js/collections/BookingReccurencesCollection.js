/******************************************
* Reservations Collection
*/
app.Collections.BookingRecurrences = app.Collections.GenericCollection.extend({

	model : app.Models.BookingRecurrence,
	
	url   : "/api/openresa/booking_recurrences",
	
	fields: ['id', 'name'],
		
	
	/** Collection Sync
	*/
	sync: function(method, model, options){

		options.data.fields = this.fields;

		return $.when(this.count(options), Backbone.sync.call(this,method,this,options));
	}

});