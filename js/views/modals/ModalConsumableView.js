/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'genericModalView',
	'advancedSelectBoxView',

	'consumablesCollection',
	'categoriesConsumablesCollection',

	'consumableModel'

], function(app, AppHelpers, GenericModalView, AdvancedSelectBoxView, ConsumablesCollection, CategoriesConsumablesCollection, ConsumableModel){


	'use strict';

	/******************************************
	* Consumable Consumable Modal View
	*/
	var modalConsumableView = GenericModalView.extend({


		templateHTML : 'templates/modals/modalConsumable.html',



		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formSaveConsumable'  : 'saveConsumable'
			},
				GenericModalView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			this.modal = $(this.el);

			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){
				this.model = new ConsumableModel();
			}

			this.render();
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get( this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					consumable   : self.model
				});

				self.modal.html(template);
				

				app.views.advancedSelectBoxConsumableTypes= new AdvancedSelectBoxView({el: $('#consumableType'), url: CategoriesConsumablesCollection.prototype.url });
				app.views.advancedSelectBoxConsumableTypes.render();

				self.modal.modal('show');
			});

			return this;
		},



		/** Delete the model pass in the view
		*/
		saveConsumable: function(e){
			e.preventDefault();

			var self = this;

			// Set the button in loading State //
			$(this.el).find('button[type=submit]').button('loading');


			// Set the properties of the model //
			var params = {
				name: this.$('#consumableName').val(),
				code: this.$('#consumableCode').val().toUpperCase(),
				hour_price: this.$('#consumablePrice').val().toUpperCase(),
				type_id: app.views.advancedSelectBoxConsumableTypes.getSelectedItem()
			};

			this.model.save(params, {patch: !this.model.isNew(), silent: true})
				.done(function(data) {
					self.modal.modal('hide');

					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : ConsumablesCollection.prototype.fields} }).done(function(){
							app.views.consumablesListView.collection.add(self.model);
						});
					// Update mode //
					} else {
						self.model.fetch({ data : {fields : self.model.fields} });
					}
				})
				.fail(function (e) {
					AppHelpers.printError(e);
				})
				.always(function () {
					$(self.el).find('button[type=submit]').button('reset');
				});
		},

	});

	return modalConsumableView;

});