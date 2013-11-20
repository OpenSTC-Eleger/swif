define([
	'genericCollection',
	'absentTypeModel'

], function(GenericCollection, AbsentTypeModel){

	'use strict';


	/******************************************
	* AbsentType Collection - Leave Time Type
	*/
	var AbsentTypesCollection = GenericCollection.extend({

		model       : AbsentTypeModel,

		url         : "/api/openstc/absence_categories",

		fields      : ['id', 'name', 'code', 'description', 'actions'],

		default_sort: { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function (options) {
			//console.log('Place collection Initialization');
		},

	});

return AbsentTypesCollection;

});