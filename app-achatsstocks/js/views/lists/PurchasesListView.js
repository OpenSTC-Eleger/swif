/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'purchasesCollection',

	'purchaseModel',

	'genericListView',
	'itemPurchaseView'


], function(app, AppHelpers, PurchasesCollection, PurchaseModel, GenericListView, ItemPurchaseView){

	'use strict';

	/******************************************
	* Budgets List View
	*/
	var PurchasesListView = GenericListView.extend({

		templateHTML  : '/templates/lists/purchasesList.html',

		model         : PurchaseModel,


		// The DOM events //
		events: function(){
			return _.defaults({

			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function () {
			this.buttonAction = app.lang.achatsstocks.actions.addPurchase;
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new PurchasesCollection(); }

			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.achatsstocks.viewsTitles.purchasesList);


			// Retrieve the template //
			$.get(app.menus.openachatsstocks + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang    : app.lang,
					nbPurchases: self.collection.cpt
				});

				$(self.el).html(template);


				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);

				_.each(self.collection.models, function(purchaseModel){
					var itemPurchaseView  = new ItemPurchaseView({model: purchaseModel});
					$('#rows-items').append(itemPurchaseView.render().el);
				});


			});

			$(this.el).hide().fadeIn();

			return this;
		}

	});

	return PurchasesListView;

});