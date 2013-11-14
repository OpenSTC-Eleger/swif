/******************************************
* Reservations Collection
*/
app.Collections.Bookings = app.Collections.GenericCollection.extend({

	model : app.Models.Booking,
	
	url   : "/api/openresa/bookings",
	
	fields: ['id', 'name', 'prod_id', 'checkin', 'checkout', 'partner_id', 'partner_order_id', 'partner_type', 'partner_phone', 'people_name', 'people_email', 'people_phone', 'is_citizen', 'create_date', 'write_date', 'state', 'state_num', 'actions', 'reservation_line', 'create_uid', 'write_uid', 'resource_names', 'resource_quantities', 'all_dispo', 'recurrence_id', 'is_template', 'note', 'partner_invoice_id'],

	default_sort: { by: '', order: '' },
	
	specialCpt : 0,
	
	/** Get the number of Booking that the user have to deal
	*/
	specialCount: function(){
		var self = this;

		// Construct a domain  //

		var domain = [
			{ field : 'state', operator : '=', value : app.Models.Booking.status.remplir.key },
		];
		

		return $.ajax({
			url      : this.url,
			method   : 'HEAD',
			dataType : 'text',
			data     : {filters: app.objectifyFilters(domain)},
			success  : function(data, status, request){
				var contentRange = request.getResponseHeader("Content-Range")
				self.specialCpt = contentRange.match(/\d+$/);
			}
		});
		
	},
	
	/** Collection Sync
	*/
	sync: function(method, model, options){

		options.data.fields = this.fields;

		return $.when(this.count(options), this.specialCount(), Backbone.sync.call(this,method,this,options));
	}

});