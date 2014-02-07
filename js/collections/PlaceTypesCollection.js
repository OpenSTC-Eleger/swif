define([
	'genericCollection'

], function(GenericCollection){

	'use strict';


	/******************************************
	* Place Type Collection
	*/
	var PlaceTypesCollection = GenericCollection.extend({

		url  : '/api/openstc/site_categories',


		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Sites types collection Initialization');
		},

	});

	return PlaceTypesCollection;

});
