/*!
 * SWIF-OpenSTC
 *
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'budgetModel',

	'modalDeleteView',
	'modalBudgetLineView'

], function(app, AppHelpers, BudgetModel, ModalDeleteView, ModalBudgetLineView){

	'use strict';


	/******************************************
	* Row Intervention View
	*/
	var ItemBudgetBudgetLineView = Backbone.View.extend({

		tagName      : 'tr',

		templateHTML : '/templates/items/itemBudgetBudgetLine.html',

		className    : 'row-nested-objects',


		events       : {
			'click .buttonUpdateBudgetLine': 'displayModalUpdateBudgetLine',

			'click .buttonDeleteBudgetLine': 'displayModalDeleteBudgetLine'
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);
			this.listenTo(this.model, 'destroy', this.destroy);
		},



		/** When the model is delete
		*/
		destroy: function(){
			var self = this;
			self.remove();
		},


		/** When the model ara updated //
		*/
		change: function(){

			this.render();

			AppHelpers.highlight($(this.el));
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstcachatstock+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang        : app.lang,
					budgetLine  : self.model,
					budget      : self.options.budget,
					budgetState : BudgetModel.state
				});

				$(self.el).html(template);

				// Set the Tooltip / Popover //
				$('*[data-toggle="tooltip"]').tooltip();

			});

			$(this.el).hide().fadeIn();
			return this;
		},



		/** Display modal to delete the budget line
		*/
		displayModalUpdateBudgetLine: function(e){
			e.preventDefault();

			app.views.modalBudgetLineView = new ModalBudgetLineView({
				el    : '#modalBudgetContainer',
				model : this.model,
				budget: this.options.budget
			});
		},



		/** Display modal to delete the budget line
		*/
		displayModalDeleteBudgetLine: function(e){
			e.preventDefault();

			app.views.modalDeleteView = new ModalDeleteView({
				el           : '#modalBudgetContainer',
				model        : this.model,
				modalTitle   : app.lang.achatsstocks.viewsTitles.deleteBudget,
				modalConfirm : app.lang.achatsstocks.warningMessages.confirmDeleteBudget
			});
		}

	});

	return ItemBudgetBudgetLineView;
});