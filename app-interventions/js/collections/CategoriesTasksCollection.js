/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

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
		initialize: function () {
			//console.log('Categories Tasks Initialization');
		}

	});

	return CategoriesTasksCollection;

});