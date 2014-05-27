/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'budgetLineModel',
	'budgetLinesCollection',

	'genericModalView',
	'advancedSelectBoxView'

], function(app, BudgetLineModel, BudgetLinesCollection, GenericModalView, AdvancedSelectBoxView){
	'use strict';

	/******************************************
	 * Booking Details View
	 */
	var ModalBudgetLineView = GenericModalView.extend({


		templateHTML: '/templates/modals/modalBudgetLine.html',


		// The DOM events //
		events: function() {
			return _.defaults({
				'submit #formSaveBudgetLine'     : 'saveBudgetLine',
			},
			GenericModalView.prototype.events);

		},



		/** View Initialization
		*/
		initialize: function (params) {
			var self = this;
			this.options = params;

			this.modal = $(this.el);


			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){

				this.model = new BudgetLineModel();
				this.render();
			}
			else{
				this.model.fetch({silent: true, data : {fields : this.model.fields}}).done(function(){
					self.render();
				});
			}

			this.render();
		},



		/** Display the view
		*/
		render: function () {

			var self = this;
			// Retrieve the template //
			$.get(app.menus.openstcachatstock+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang        : app.lang,
					budgetLine  : undefined
				});

				self.modal.html(template);

				// Create advance select bos Service //
				self.selectM14Account = new AdvancedSelectBoxView({el: $('#budgetLineAccount'), url: '/api/open_achats_stock/accounts'});
				self.selectM14Account.render();

				self.modal.modal('show');
			});

			return this;
		},



		/** Save Budget
		*//*
		saveBudgetLine: function(e) {
			e.preventDefault();

			var self = this;

			// Set the button in loading State //
			$(this.el).find('button[type=submit]').button('loading');

			var params = {
				name       : this.$('#budgetName').val(),
				code       : this.$('#budgetName').val(),
				service_id : this.selectListServicesView.getSelectedItem(),
				date_from  : this.$('#budgetStartDate').val(),
				date_to    : this.$('#budgetEndDate').val()
			};


			this.model.save(params, {patch: !this.model.isNew(), silent: true})
				.done(function(data) {
					self.modal.modal('hide');

					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : BudgetsCollection.prototype.fields} }).done(function(){
							app.views.budgetsListView.collection.add(self.model);
						});
					// Update mode //
					} else {
						self.model.fetch({ data : {fields : self.model.fields} });
					}
				})
				.fail(function (e) {
					console.log(e);
				})
				.always(function () {
					$(self.el).find('button[type=submit]').button('reset');
				});
		}*/

	});

	return ModalBudgetLineView;
});