/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		// Router //
		appPatrimoinesRouter                : '../app-patrimoines/js/routers/AppRouter',

		// Collections //
		contractsCollection					: '../app-patrimoines/js/collections/ContractsCollection',
		contractLinesCollection					: '../app-patrimoines/js/collections/ContractLinesCollection',
		
		//Models
		contractModel						: '../app-patrimoines/js/models/ContractModel',
		contractLineModel						: '../app-patrimoines/js/models/ContractLineModel',
		
		//Views
		contractsListView					: '../app-patrimoines/js/views/lists/ContractsListView',
		itemContractView					: '../app-patrimoines/js/views/items/ItemContractView',
		formContractView					: '../app-patrimoines/js/views/forms/FormContractView',
		formContractGeneralView				: '../app-patrimoines/js/views/forms/FormContractGeneralView',
		formContractLineView				: '../app-patrimoines/js/views/forms/FormContractLineView',
	}

});