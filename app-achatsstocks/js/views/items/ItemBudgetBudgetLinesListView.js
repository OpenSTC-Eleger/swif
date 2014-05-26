/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'budgetLinesCollection',
	'itemBudgetBudgetLineView'


], function(app, BudgetLinesCollection, ItemBudgetBudgetLineView){

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
			//'click .btn.addTask'      : 'displayModalAddTask',
		},



		/** When the model has updated //
		*/
		change: function(){
			var self = this;
			//Update Inter model
			self.model.fetch();
			this.partialRender();
		},



		render : function() {
			var self = this;

			// Retrieve the template //
			$.get(app.menus.openachatsstocks + this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang          : app.lang
				});

				$(self.el).html(template);


				// Render budgetLines //
				if (!_.isUndefined(self.collection)) {


					// Check if the collection isn't empty //
					if(_.isEmpty(self.collection.models)){
						$(self.el).find('table').addClass('hide');
						$(self.el).find('.noBudgetLine').removeClass('hide');
					}
					else{

						_.each(self.collection.models, function (budgetLine) {
							var itemBudgetBudgetLineView = new ItemBudgetBudgetLineView({ model: budgetLine });
							$(self.el).find('#row-nested-objects').append(itemBudgetBudgetLineView.render().el);

							//self.listenTo(task, 'change', self.change);
							//self.listenTo(task, 'destroy', self.destroyTask);
						});

					}
				}

			});

			return this;
		},



		/** Fetch BudgetLines
		*/
		fetchData: function () {
			$(this.el).empty(); // Clean the budgetLine container view //

			var deferred = $.Deferred();
			this.collection = new BudgetLinesCollection();

			this.collection.fetch({ silent: true, data: {filters: {0: {'field': 'crossovered_budget_id.id', 'operator': '=', 'value': this.model.getId()}}}}).done(function(){
				deferred.resolve();
			});
			return deferred;
		}


	});

	return ItemBudgetBudgetLinesListView;

});