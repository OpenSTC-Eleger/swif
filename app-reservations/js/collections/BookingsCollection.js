/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericCollection',
	'bookingModel'

], function(app, GenericCollection, BookingModel){

	'use strict';

	/******************************************
	* Reservations Collection
	*/
	var bookings = GenericCollection.extend({

		model : BookingModel,

		fields: ['id', 'name', 'checkin', 'checkout', 'partner_id', 'partner_order_id', 'partner_type',
				'contact_phone', 'partner_mail', 'people_name', 'people_phone', 'is_citizen',
				'create_date', 'write_date', 'deleted_at', 'done_at', 'confirm_at', 'cancel_at', 'state', 'state_num', 'actions', 'create_uid', 'write_uid',
				'resources', 'all_dispo', 'recurrence_id', 'is_template', 'note', 'confirm_note', 'cancel_note', 'done_note',
				'pricelist_id', 'invoice_attachment_id', 'amount_total'],

		url   : '/api/openresa/bookings',


		advanced_searchable_fields: [
			{ key: 'state',         label : app.lang.status }
		],

		default_sort: { by: '', order: '' },

		specialCpt : 0,


		/** Get the number of Booking that the user have to deal
		*/
		specialCount: function(){
			var self = this;

			// Construct a domain  //

			var domain = [
				{ field: 'state', operator: '=', value: BookingModel.status.remplir.key }
			];


			return $.ajax({
				url      : this.url,
				method   : 'HEAD',
				dataType : 'text',
				data     : {filters: app.objectifyFilters(domain)},
				success  : function(data, status, request){
					var contentRange = request.getResponseHeader('Content-Range');
					self.specialCpt = contentRange.match(/\d+$/);
				}
			});

		},


		/** Collection Sync
		*/
		sync: function(method, model, options){

			if(_.isUndefined(options.data.fields)){
				options.data.fields = this.fields;
			}

			return $.when(this.count(options), this.specialCount(), Backbone.sync.call(this,method,this,options));
		}

	});

	return bookings;

});