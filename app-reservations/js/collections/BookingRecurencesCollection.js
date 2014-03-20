/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'genericCollection',
	'bookingRecurrenceModel'

], function(app, GenericCollection, BookingRecurrenceModel){

	'use strict';

	/******************************************
	* Reservations Collection
	*/
	var bookingRecurrences = GenericCollection.extend({

		model : BookingRecurrenceModel,

		url   : '/api/openresa/booking_recurrences',

		fields: ['id', 'name', 'possible_actions'],


		/** Collection Sync
		*/
		sync: function(method, model, options){

			options.data.fields = this.fields;

			return $.when(this.count(options), Backbone.sync.call(this,method,this,options));
		}

	});

	return bookingRecurrences;

});