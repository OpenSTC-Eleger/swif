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
		
		fields: ['id', 'name'],
	
	});
	return BookablesCollection;
})