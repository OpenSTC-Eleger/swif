/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericModel',

], function(app, GenericModel) {

	'use strict';


	/******************************************
	 * Filter Model
	 */
	var FilterModel = GenericModel.extend({


		fields: ['id', 'name', 'user_id', 'domain', 'context', 'model_id', 'description', 'pre_recorded'],

		urlRoot: '/api/open_object/filters',

		defaults: {
			name: null,
			user_id: null,
			model_id: null,
			domain: null,
			pre_recorded: 0
		},


		searchable_fields: [{
			key: 'id',
			type: 'numeric'
		}, {
			key: 'name',
			type: 'text'
		}],


		/** Model Initialization
		 */
		initialize: function() {
			//console.log("Filter Model Initialization");
		},

		getName: function() {
			return this.get('name');
		},
		setName: function(value, silent) {
			this.set({
				name: value
			}, {
				silent: silent
			});
		},

		getDescription: function() {
			return this.get('description');
		},
		setDescription: function(value, silent) {
			this.set({
				description: value
			}, {
				silent: silent
			});
		},


		isPreRecored: function() {
			if (this.get('pre_recorded')) {
				return true;
			}
			else {
				return false;
			}
		},

		isEmpty: function() {
			if (_.isEmpty(JSON.parse(this.get('domain')))) {
				return true;
			}
			else {
				return false;
			}
		}

	});

	return FilterModel;

});