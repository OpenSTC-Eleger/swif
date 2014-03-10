/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	
	'contractModel',
	'contractsCollection',
	
	'genericListView',
	'formContractView',
	'itemContractView'

], function(app, AppHelpers, ContractModel, ContractsCollection, GenericListView, FormContractView, ItemContractView){

	'use strict';


	/******************************************
	* Categories Tasks List View
	*/
	return GenericListView.extend({

		templateHTML: '/templates/lists/contractsList.html',

		model : ContractModel,

		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalCreateContract' : 'modalCreateContract',
			},
				GenericListView.prototype.events
			);
		},
		
		/** View Initialization
		*/
		initialize: function() {
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new ContractsCollection(); }
			
			GenericListView.prototype.initialize.apply(this, arguments);
		},

		/** When the model ara created //
		*/
		add: function(model){

			var itemContractView  = new ItemContractView({ model: model });
			$('#rows-items').prepend(itemContractView.render().el);
			AppHelpers.highlight($(itemContractView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.catCreateOk);
			this.partialRender();
		},
		
		/** Display the view
		*/
		render: function () {
			var self = this;
			var formUrl = FormContractView.prototype.urlBuilder();
			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.categoriesTasksList);

			// Retrieve the template //
			$.get(app.menus.openpatrimoine + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang  : app.lang,
					nbContracts: self.collection.cpt,
					formUrl: formUrl
				});

				$(self.el).html(template);
				
				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);
				
				// Create item category request view //
				_.each(self.collection.models, function(contractModel){
					var itemContractView  = new ItemContractView({model: contractModel});
					$('#rows-items').append(itemContractView.render().el);
				});
			});

			$(this.el).hide().fadeIn();

			return this;
		},

		/** Modal form to create a new Cat
		*/
//		modalCreateCat: function(e){
//			e.preventDefault();
//
//			app.views.modalCategoryTaskView = new ModalCategoryTaskView({
//				el  : '#modalSaveCat'
//			});
//		},

	});
});