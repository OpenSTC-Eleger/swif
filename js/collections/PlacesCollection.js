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

		fields       : ['id', 'actions', 'name', 'complete_name', 'service_names', 'site_parent_id', 'surface'],

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function (options) {
			//console.log('Place collection Initialization');
		}

	});

return PlacesCollection;

});