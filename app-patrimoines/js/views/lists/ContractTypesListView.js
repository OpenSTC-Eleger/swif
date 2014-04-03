/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	
	'contractTypesModel',
	'contractTypesCollection',
	
	'genericListView',
	'itemContractTypesView',
	'genericFormModalView'

], function(app, AppHelpers, ContractTypesModel, ContractTypesCollection, GenericListView, ItemContractTypesView, GenericFormModalView){

	'use strict';


	/******************************************
	* Categories Tasks List View
	*/
	return GenericListView.extend({

		templateHTML: '/templates/lists/contractTypesList.html',
		templateModalFormHTML: '/templates/modals/modalContractType.html',

		model : ContractTypesModel,

		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.createModel' : 'openModalCreate',
			},
				GenericListView.prototype.events
			);
		},
		
		/** View Initialization
		*/
		initialize: function() {
			this.buttonAction = app.lang.patrimoine.actions.addTypeContracts;
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new ContractTypesCollection(); }
			
			GenericListView.prototype.initialize.apply(this, arguments);
		},

		/** When the model ara created //
		*/
		add: function(model){

			var itemContractTypeView  = new ItemContractTypesView({ model: model });
			$('#rows-items').prepend(itemContractTypeView.render().el);
			AppHelpers.highlight($(itemContractTypeView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.catCreateOk);
			this.partialRender();
		},
		
		/** Display the view
		*/
		render: function () {
			var self = this;
			// Change the page title //
			app.router.setPageTitle(app.lang.patrimoine.viewsTitles.contractTypesList);

			// Retrieve the template //
			$.get(app.menus.openstcpatrimoine + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang  : app.lang,
					nbContractTypes: self.collection.cpt
				});

				$(self.el).html(template);
				
				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);
				
				// Create item category request view //
				_.each(self.collection.models, function(contractTypesModel){
					var itemContractTypesView  = new ItemContractTypesView({model: contractTypesModel});
					$('#rows-items').append(itemContractTypesView.render().el);
				});
			});

			$(this.el).hide().fadeIn();

			return this;
		},

		openModalCreate: function(e){
			e.preventDefault();
			console.log(this.events());
			new GenericFormModalView({
				el:'#modalView',
				//action: action,
				collection: this.collection,
				modelName: ContractTypesModel,
				title:app.lang.patrimoine.modalContractType.create,
				templateForm: app.menus.openstcpatrimoine + this.templateModalFormHTML
			});
		},
		
	});
});