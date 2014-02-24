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
	var BookablesPartnerCollection = GenericCollection.extend({

		model : BookableModel,

		partnerId : '',

		url: function(){
			return '/api/openresa/partners/'+this.partnerId+'/bookables';
		},

		fields: ['id', 'name', 'product_image', 'qty_available', 'type_prod', 'color', 'categ_id'],

	});

	return BookablesPartnerCollection;
});