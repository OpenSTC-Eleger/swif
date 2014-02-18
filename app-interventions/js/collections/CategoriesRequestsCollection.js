define([
	'genericCollection',
	'categoryRequestModel'

], function(GenericCollection, CategoryRequestModel){

	'use strict';


	/******************************************
	* Request Categorie Collection - Intervention classification for budget
	*/
	var CategoriesRequestsCollection = GenericCollection.extend({

		model        : CategoryRequestModel,

		url          : '/api/openstc/intervention_categories',

		fields       : ['id', 'name', 'code', 'actions'],

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Categorie collection Initialization');
		},

	});

	return CategoriesRequestsCollection;

});