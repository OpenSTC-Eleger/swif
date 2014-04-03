/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		// Router //
		appPatrimoinesRouter                : '../app-patrimoines/js/routers/AppRouter',

		// Collections //
		contractsCollection					: '../app-patrimoines/js/collections/ContractsCollection',
		contractLinesCollection				: '../app-patrimoines/js/collections/ContractLinesCollection',
		itemRecurrenceContractCollection	: '../app-patrimoines/js/collections/ItemRecurrenceContractCollection',
		contractTypesCollection				: '../app-patrimoines/js/collections/ContractTypesCollection',
		
		//Models
		contractModel						: '../app-patrimoines/js/models/ContractModel',
		contractLineModel					: '../app-patrimoines/js/models/ContractLineModel',
		itemRecurrenceContractModel			: '../app-patrimoines/js/models/ItemRecurrenceContractModel',
		contractTypesModel					: '../app-patrimoines/js/models/ContractTypesModel',
		
		//Views
		genericActionModalView				: '../app-patrimoines/js/views/modals/GenericActionModalView',
		genericFormModalView				: '../app-patrimoines/js/views/modals/GenericFormModalView',
		contractsListView					: '../app-patrimoines/js/views/lists/ContractsListView',
		contractTypesListView				: '../app-patrimoines/js/views/lists/ContractTypesListView',
		itemContractView					: '../app-patrimoines/js/views/items/ItemContractView',
		itemContractTypesView				: '../app-patrimoines/js/views/items/ItemContractTypesView',
		formContractView					: '../app-patrimoines/js/views/forms/FormContractView',
		formContractGeneralView				: '../app-patrimoines/js/views/forms/FormContractGeneralView',
		formContractLineView				: '../app-patrimoines/js/views/forms/FormContractLineView',
		formItemRecurrenceView				: '../app-patrimoines/js/views/forms/FormItemRecurrenceView',
	}

});