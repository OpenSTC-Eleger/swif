/******************************************
* Reservations Collection
*/
app.Collections.Bookings = app.Collections.GenericCollection.extend({

	model : app.Models.Booking,
	
	url   : "/api/openresa/bookings",
	
	fields: ['id', 'name', 'prod_id', 'checkin', 'checkout', 'partner_id', 'create_date', 'state', 'state_num', 'actions', 'reservation_line', 'resource_names', 'resource_quantities', 'all_dispo', 'recurrence_id', 'is_template'],

	default_sort: { by: '', order: '' },
	
	/** Collection Sync
	*/
	sync: function(method, model, options){

		options.data.fields = this.fields;

		return $.when(this.count(options), Backbone.sync.call(this,method,this,options));
	}

});