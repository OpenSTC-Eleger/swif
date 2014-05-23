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
		purchasesCollection           : '../app-achatsstocks/js/collections/PurchasesCollection',

		// Models //
		budgetModel                	  : '../app-achatsstocks/js/models/BudgetModel',
		budgetLineModel               : '../app-achatsstocks/js/models/BudgetLineModel',
		purchaseModel                 : '../app-achatsstocks/js/models/PurchaseModel',

		// Views List //
		budgetsListView               : '../app-achatsstocks/js/views/lists/BudgetsListView',
		purchasesListView             : '../app-achatsstocks/js/views/lists/PurchasesListView',

		// View Items //
		itemBudgetView                : '../app-achatsstocks/js/views/items/ItemBudgetView',
		itemBudgetBudgetLinesListView : '../app-achatsstocks/js/views/items/ItemBudgetBudgetLinesListView',
		itemPurchaseView              : '../app-achatsstocks/js/views/items/PurchaseItemView',
		itemBudgetBudgetLineView      : '../app-achatsstocks/js/views/items/ItemBudgetBudgetLineView',

		// Views Forms //
		purchaseFormView              : '../app-achatsstocks/js/views/forms/PurchaseFormView'

		// View Modals //
		modalBudgetView               : '../app-achatsstocks/js/views/modals/ModalBudgetView'
	}

});