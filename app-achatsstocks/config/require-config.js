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
		appAchatsStocksRouter      	  : '../app-achatsstocks/js/routers/AppRouter',

		// Collections //
		budgetsCollection          	  : '../app-achatsstocks/js/collections/BudgetsCollection',
		budgetLinesCollection         : '../app-achatsstocks/js/collections/BudgetLinesCollection',

		// Models //
		budgetModel                	  : '../app-achatsstocks/js/models/BudgetModel',
		budgetLineModel               : '../app-achatsstocks/js/models/BudgetLineModel',

		// Views //
		budgetsListView               : '../app-achatsstocks/js/views/lists/BudgetsListView',

		itemBudgetView                : '../app-achatsstocks/js/views/items/ItemBudgetView',
		itemBudgetBudgetLineListView  : '../app-achatsstocks/js/views/items/ItemBudgetBudgetLineListView'
	}

});