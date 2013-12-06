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

		url   : "/api/openresa/bookables",
		
		fields : ['id', 'name', 'product_image', 'qty_available', 'type_prod', 'color', 'categ_id'],
	
	});

	return BookablesCollection;
})