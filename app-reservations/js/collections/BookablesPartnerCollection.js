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