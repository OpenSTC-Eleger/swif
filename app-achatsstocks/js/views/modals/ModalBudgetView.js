/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'budgetModel',
	'budgetsCollection',

	'genericModalView',
	'advancedSelectBoxView',

	'claimersServicesCollection',
	'moment'

], function(app, BudgetModel, BudgetsCollection, GenericModalView, AdvancedSelectBoxView, ClaimersServicesCollection, moment){
	'use strict';

	/******************************************
	 * Booking Details View
	 */
	var ModalBudgetView = GenericModalView.extend({


		templateHTML: '/templates/modals/modalBudget.html',


		// The DOM events //
		events: function() {
			return _.defaults({
				'submit #formSaveBudget'     : 'saveBudget',
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

				this.model = new BudgetModel();
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
			$.get(app.menus.openachatsstocks+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang        : app.lang,
					budget      : undefined,
					currentYear : moment().year()
				});

				self.modal.html(template);

				// Set the datepicker //
				$(self.el).find('.input-daterange').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });

				// Create advance select bos Service //
				self.selectListServicesView = new AdvancedSelectBoxView({el: $('#budgetService'), url: ClaimersServicesCollection.prototype.url});
				self.selectListServicesView.render();

				self.modal.modal('show');
			});

			return this;
		},



		/** Save Budget
		*/
		saveBudget: function(e) {
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
		}

	});

	return ModalBudgetView;
});