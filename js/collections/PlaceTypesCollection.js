/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

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
