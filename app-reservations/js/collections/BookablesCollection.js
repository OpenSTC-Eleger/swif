/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'bookableModel'

], function(GenericCollection, BookableModel){

	'use strict';


	/******************************************
	* Bookables Collection
	*/
	var BookablesCollection = GenericCollection.extend({

		model : BookableModel,

		url   : '/api/openresa/bookables',

		fields : ['id', 'name', 'product_image', 'qty_available', 'type_prod', 'color', 'categ_id', 'block_booking'],

	});

	return BookablesCollection;
});