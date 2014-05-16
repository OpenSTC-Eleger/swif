/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'genericListView',
	'budgetsCollection',
	'budgetModel'


], function(app, AppHelpers, GenericListView, BudgetsCollection, BudgetModel){

	'use strict';

	/******************************************
	* Budgets List View
	*/
	var BudgetsListView = GenericListView.extend({

		templateHTML  : '/templates/lists/budgetsList.html',

		model         : BudgetModel,


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
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new BudgetsCollection(); }

			this.buttonAction = app.lang.achatsstocks.actions.addBudget;
			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.achatsstocks.viewsTitles.budgetsList);


			// Retrieve the template //
			$.get(app.menus.openachatsstocks + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang     : app.lang,
					nbBudgets: self.collection.cpt
				});

				$(self.el).html(template);


				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);

			});

			$(this.el).hide().fadeIn();

			return this;
		}

	});

	return BudgetsListView;

});