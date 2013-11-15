define([
	'genericCollection',
	'categoryTaskModel'

], function(GenericCollection, CategoryTaskModel){

	'use strict';


	/******************************************
	* Categories Tasks collection
	*/
	var CategoriesTasksCollection = GenericCollection.extend({

		model        : CategoryTaskModel,

		url          : '/api/openstc/task_categories',

		fields       : ['id', 'name', 'code', 'parent_id', 'service_names', 'actions'],

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function (options) {
			//console.log('Categories Tasks Initialization');
		}

	});

return CategoriesTasksCollection;

});