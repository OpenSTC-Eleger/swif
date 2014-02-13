define([
	'genericCollection',
	'placeModel'

], function(GenericCollection, PlaceModel){

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
			/*{ key: 'site_parent_id' },
			{ key: 'service_names' },*/
			{ key: 'surface', label: "surface" }
		],


		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Place collection Initialization');

			// Add label to the Advance Search Fields //
			/*this.advanced_searchable_fields[0].label = app.lang.parentPlace;
			this.advanced_searchable_fields[1].label = app.lang.associatedServices;
			this.advanced_searchable_fields[2].label = app.lang.area;*/
		}

	});

	return PlacesCollection;

});