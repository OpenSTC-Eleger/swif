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
	'modalBudgetView'

], function(app, AppHelpers, BudgetModel, ModalDeleteView, ModalBudgetView){

	'use strict';


	/******************************************
	* Row Intervention View
	*/
	var ItemBudgetView = Backbone.View.extend({

		tagName      : 'tr',

		templateHTML : '/templates/items/itemBudget.html',

		className    : 'row-item',


		// The DOM events //
		events       : {
			'click a.accordion-object' : 'tableAccordion',

			'click .buttonDeleteBudget': 'displayModalDeleteBudget',
			'click .buttonUpdateBudget': 'displayModalUpdateBudget'
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			this.detailedView = this.options.detailedView;
			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);
			this.listenTo(this.model, 'destroy', this.destroy);
		},



		/** When the model ara updated //
		*/
		change: function(){
			var self = this;
			self.render();

			// Highlight the Row and recalculate the className //
			AppHelpers.highlight($(self.el)).done(function(){
				// Partial Render //
				app.views.budgetsListView.partialRender();
			});

			app.notify('', 'success', app.lang.infoMessages.information, self.model.getName()+' : '+ app.lang.achatsstocks.infoMessages.budgetUpdateOk);
		},



		destroy: function(){
			var self = this;

			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				self.detailedView.remove();
				app.views.budgetsListView.partialRender();
				$('#rows-items tr').css({ opacity: '1'});
			});

			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.achatsstocks.infoMessages.budgetDeleteOk);
		},



		/** Display the view
		*/
		render : function() {
			var self = this;

			// Retrieve the template //
			$.get(app.menus.openstcachatstock+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang        : app.lang,
					budget      : self.model,
					budgetState : BudgetModel.state,
					budgetAction: BudgetModel.actions
				});

				$(self.el).html(template);

				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();

			});

			$(this.el).hide().fadeIn();
			return this;
		},



		/** Expend the budget to display budget lines
		*/
		expendAccordion: function(){
			var self = this;

			// Retrieve the intervention ID //
			var id = this.model.toJSON().id.toString();
			var isExpend = $('#collapse_'+id).hasClass('expend');

			// Reset the default visibility //
			$('tr.expend').css({ display: 'none' }).removeClass('expend');
			$('tr.active').removeClass('active');

			$('#rows-items tr').css({ opacity: '1'});


			// If the table row isn't already expend //
			if(!isExpend) {
				// Fetch tasks
				if(!_.isUndefined(this.detailedView)){
					this.detailedView.fetchData().done(function () {
						self.detailedView.render();
					});
				}

				// Set the new visibility to the selected intervention //
				$(this.el).addClass('active');
				$('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
				$('tbody tr:not(.expend):not(.active)').css({ opacity: '0.45'});
			}
			else {
				$('tbody tr.row-object').css({ opacity: '1'});
			}
		},



		tableAccordion: function(e){
			e.preventDefault();

			// Fold up current accordion and expand //
			this.expendAccordion();
		},



		/** Display modal to delete the budget
		*/
		displayModalDeleteBudget: function(e){
			e.preventDefault();

			app.views.modalDeleteView = new ModalDeleteView({
				el           : '#modalBudgetContainer',
				model        : this.model,
				modalTitle   : app.lang.achatsstocks.viewsTitles.deleteBudget,
				modalConfirm : app.lang.achatsstocks.warningMessages.confirmDeleteBudget
			});
		},


		/** Display modal to update the budget
		*/
		displayModalUpdateBudget: function(e){
			e.preventDefault();

			app.views.modalBudgetView = new ModalBudgetView({
				el    : '#modalBudgetContainer',
				model : this.model
			});
		}


	});

	return ItemBudgetView;
});