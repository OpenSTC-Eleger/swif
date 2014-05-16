/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		// Router //
		appAchatsStocksRouter      	    : '../app-achatsstocks/js/routers/AppRouter',

		// Collections //
		purchasesCollection          	: '../app-achatsstocks/js/collections/PurchasesCollection',

		// Models //
		purchaseModel                	: '../app-achatsstocks/js/models/PurchaseModel',

		// Views //
		budgetsListView                	: '../app-achatsstocks/js/views/lists/BudgetsListView',
		purchasesListView				: '../app-achatsstocks/js/views/lists/PurchasesListView',
	}

});