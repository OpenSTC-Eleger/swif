/*!
 * SWIF-OpenSTC
 *
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'budgetModel'

], function(app, AppHelpers, BudgetModel){

	'use strict';


	/******************************************
	* Row Intervention View
	*/
	var ItemBudgetView = Backbone.View.extend({

		tagName     : 'tr',

		templateHTML : '/templates/items/itemBudget.html',


		// The DOM events //
		events       : {
			'click a.accordion-object' : 'tableAccordion'
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			this.detailedView = this.options.detailedView;
			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);
		},



		/** When the model ara updated //
		*/
		change: function(){
			var self = this;
			self.render();

			// Highlight the Row and recalculate the className //
			AppHelpers.highlight($(self.el)).done(function(){
			});

			app.notify('', 'success', app.lang.infoMessages.information, self.model.getName()+' : '+ app.lang.infoMessages.interventionUpdateOK);

			// Partial Render //
			app.views.interventions.partialRender();
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
				$('tr:not(.expend):not(.active)').css({ opacity: '0.45'});
			}
			else {
				$('tr.row-object').css({ opacity: '1'});
			}
		},



		tableAccordion: function(e){
			e.preventDefault();

			// Fold up current accordion and expand //
			this.expendAccordion();
		}

	});

	return ItemBudgetView;
});