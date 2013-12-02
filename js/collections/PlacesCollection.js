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

		fields       : ['id', 'actions', 'name', 'complete_name', 'service_names', 'site_parent_id', 'surface','internal_booking','external_booking','service_bookable_ids', 'service_bookable_names','partner_type_bookable_ids', 'partner_type_bookable_names'],

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function (options) {
			//console.log('Place collection Initialization');
		}

	});

return PlacesCollection;

});