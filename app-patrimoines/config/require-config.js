/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		// Router //
		appPatrimoinesRouter                : '../app-patrimoines/js/routers/AppRouter',

		// Collections //
		contractsCollection					: '../app-patrimoines/js/collections/ContractsCollection',
		
		//Models
		contractModel						: '../app-patrimoines/js/models/ContractModel',
		
		//Views
		contractsListView					: '../app-patrimoines/js/views/lists/ContractsListView',
		itemContractView					: '../app-patrimoines/js/views/items/ItemContractView',
		formContractView					: '../app-patrimoines/js/views/forms/FormContractView',
		//formContractLineView				: '../app-patrimoines/js/views/forms/FormContractLineView',
	}

});