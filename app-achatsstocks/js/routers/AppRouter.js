/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'budgetsListView',
	'purchasesListView',
	'purchaseFormView',
	'accountAnalyticsListView'

], function(app, BudgetsListView, PurchasesListView, PurchaseFormView, AccountAnalyticsListView){

	'use strict';


	/******************************************
	* Application Router
	*/
	var router = Backbone.Router.extend({



		/** Budgets List
		*/
		budgetsList: function(search, filter, sort, page) {

			var params = this.setContext({search: search, filter: filter, sort: sort, page: page});
			app.views.budgetsListView = new BudgetsListView(params);
		},



		/** Purchase list
		*/
		purchasesList: function(search, filter, sort, page) {

			var params = this.setContext({search: search, filter: filter, sort: sort, page: page});
			app.views.purchasesListView = new PurchasesListView(params);
		},


		/** purchases form
		*/
		purchasesForm: function(id){
			var params = this.setContext({id:id});
			app.views.formPurchaseView = new PurchaseFormView(params);
		},
		
		accountAnalyticsList: function(search, filter, sort, page) {
			var params = this.setContext({search: search, filter: filter, sort: sort, page: page});
			app.views.analyticAccountsListView = new AccountAnalyticsListView(params);			
		}

	});

	return router;

});