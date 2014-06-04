/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'budgetModel',
	'budgetLineModel',
	'budgetLinesCollection',
	'itemBudgetBudgetLineView',

	'modalBudgetLineView'


], function(app, BudgetModel, BudgetLineModel, BudgetLinesCollection, ItemBudgetBudgetLineView, ModalBudgetLineView){

	'use strict';

	/******************************************
	* Row Budget View
	*/
	var ItemBudgetBudgetLinesListView = Backbone.View.extend({

		tagName     : 'tr',

		templateHTML: '/templates/items/itemBudgetBudgetLinesList.html',

		className   : 'row-nested-objects-collapse',

		id          : function() {
			var id = 'collapse_'+this.model.getId();
			return id;
		},


		// The DOM events //
		events       : {
			'click .btn.addBudgetLine'   : 'displayModalBudgetLine',
		},


		initialize: function(){
			this.collection = new BudgetLinesCollection();
			this.collection.off();
			this.listenTo(this.collection, 'add', this.addBudgetLine);
		},


		/** When the model has updated //
		*/
		change: function(){
			// Refetch the Budget Model //
			this.model.fetch();
		},


		addBudgetLine: function(model) {

			var itemBudgetBudgetLineView = new ItemBudgetBudgetLineView({ model: model, budget: this.model });
			$(this.el).find('#row-nested-objects').append(itemBudgetBudgetLineView.render().el);

			this.listenTo(model, 'change', this.change);
			this.listenTo(model, 'destroy', this.destroyBudgetLine);
			this.partialRender();

			this.change();
		},


		destroyBudgetLine: function(model) {
			this.collection.remove(model);
			//check if there is tasks, if not, display message infos instead of table
			this.partialRender();
			this.change();
		},



		render : function() {
			var self = this;

			// Retrieve the template //
			$.get(app.menus.openstcachatstock + this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang   : app.lang
				});

				$(self.el).html(template);


				// Check if the a budget line can be added //
				if(self.model.getState() != BudgetModel.state.confirm.key){
					$(self.el).find('.addBudgetLine').addClass('hide');
				}


				// Render budgetLines //
				if (!_.isUndefined(self.collection)) {

					// Check if the collection isn't empty //
					if(_.isEmpty(self.collection.models)){
						$(self.el).find('table').addClass('hide');
						$(self.el).find('.noBudgetLine').removeClass('hide');
					}
					else{

						_.each(self.collection.models, function (budgetLine) {

							var itemBudgetBudgetLineView = new ItemBudgetBudgetLineView({ model: budgetLine, budget: self.model });
							$(self.el).find('#row-nested-objects').append(itemBudgetBudgetLineView.render().el);

							self.listenTo(budgetLine, 'change', self.change);
							self.listenTo(budgetLine, 'destroy', self.destroyBudgetLine);
						});

					}
				}

			});

			return this;
		},



		partialRender: function(){

			// Check if the collection isn't empty //
			if(_.isEmpty(this.collection.models)){
				$(this.el).find('table').addClass('hide');
				$(this.el).find('.noBudgetLine').removeClass('hide');
			}
			else{
				$(this.el).find('table').removeClass('hide');
				$(this.el).find('.noBudgetLine').addClass('hide');
			}
		},



		/** Fetch BudgetLines
		*/
		fetchData: function () {
			$(this.el).empty(); // Clean the budgetLine container view //

			var deferred = $.Deferred();
			//this.collection = new BudgetLinesCollection();

			this.collection.fetch({ silent: true, data: {filters: {0: {'field': 'crossovered_budget_id.id', 'operator': '=', 'value': this.model.getId()}}}}).done(function(){
				deferred.resolve();
			});
			return deferred;
		},



		/** Display modal to add a Budget Line
		*/
		displayModalBudgetLine: function(e){

			e.preventDefault();


			// Check if it's a create or an update //
			var budgetModel = new BudgetLineModel();
			//this.listenTo(budgetModel, 'sync', this.addBudgetLine);


			app.views.modalBudgetLineView = new ModalBudgetLineView({
				el    : '#modalBudgetContainer',
				model : budgetModel,
				budget: this.model,
				budgetLineCollection: this.collection
			});
		}


	});

	return ItemBudgetBudgetLinesListView;

});