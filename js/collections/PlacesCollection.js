define([
	'app',

	'genericCollection',
	'placeModel'

], function(app, GenericCollection, PlaceModel){

	'use strict';


	/******************************************
	* Places Collection
	*/
	var PlacesCollection = GenericCollection.extend({

		model        : PlaceModel,

		url          : '/api/openstc/sites',

		fields       : ['id', 'actions', 'name', 'complete_name', 'service_names', 'site_parent_id', 'surface', 'internal_booking','external_booking','service_bookable_ids', 'service_bookable_names','partner_type_bookable_ids', 'partner_type_bookable_names'],

		default_sort : { by: 'name', order: 'ASC' },

		advanced_searchable_fields: [
			{ key: 'surface' }
		],


		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Place collection Initialization');

			// Add label to the Advance Search Fields //
			this.advanced_searchable_fields[0].label = app.lang.area;
		}

	});

	return PlacesCollection;

});