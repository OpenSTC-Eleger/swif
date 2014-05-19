/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'budgetsListView'

], function(app, BudgetsListView){

	'use strict';


	/******************************************
	* Application Router
	*/
	var router = Backbone.Router.extend({



		/** Budgets List
		*/
		budgetsList: function(year, search, filter, sort, page) {

			var params = this.setContext({search: search, filter: filter, sort: sort, page: page});
			app.views.budgetsListView = new BudgetsListView(params);
		}

	});

	return router;

});