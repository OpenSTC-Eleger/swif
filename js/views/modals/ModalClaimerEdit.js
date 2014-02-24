/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'claimerModel',
	'claimersTypesCollection',
	'placesCollection',
	'claimersServicesCollection',
	'claimersCollection',
	'genericModalView',
	'advancedSelectBoxView'

], function (app, AppHelpers, ClaimerModel, ClaimersTypesCollection, PlacesCollection,ClaimersServicesCollection, ClaimersCollection, GenericModalView, AdvancedSelectBoxView) {

	'use strict';


	return GenericModalView.extend({

		templateHTML : 'templates/modals/claimerEdit.html',

		events: function(){
			return _.defaults({
					'submit #formSaveClaimer' : 'saveClaimer',
					'click a.modalEditClaimer': 'showEditModal'
				},
				GenericModalView.prototype.events
			);
		},

		initialize : function(params) {
			this.options = params;
			var self = this;

			this.modal = $(this.el);

			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){

				this.model = new ClaimerModel();
				this.render();
			}
			else{
				// Render with loader //
				this.render(true);
				this.model.fetch({silent: true, data : {fields : this.model.fields}}).done(function(){
					self.render();
				});
			}

			this.$el.on('shown', function () {
				$(this).find('input, textarea').first().focus();
			});

		},



		render : function(loader) {
			var self = this;
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					claimer : self.model,
					loader: loader
				});
				self.modal.html(template);
				if(!loader){
					app.views.selectListClaimerTypeView = new AdvancedSelectBoxView({el: $('#claimerType'), url: ClaimersTypesCollection.prototype.url});
					app.views.selectListClaimerTypeView.render();

					app.views.selectListClaimerTechnicalServiceView = new AdvancedSelectBoxView({el: $('#claimerTechnicalService'), url: ClaimersServicesCollection.prototype.url});
					app.views.selectListClaimerTechnicalServiceView.render();

					app.views.selectListClaimerTechnicalSiteView = new AdvancedSelectBoxView({el: $('#claimerTechnicalSite'), url: PlacesCollection.prototype.url});
					app.views.selectListClaimerTechnicalSiteView.render();

				}
				self.modal.modal('show');

			});

			return this;
		},


		// toggle loading style for submit button
		toggleLoadingOnSubmitButton : function () {
			var submit_button = $(this.el).find('button[type=submit]');

			if (submit_button.attr('disabled') === 'disabled') {
				submit_button.button('reset');
			}else {
				submit_button.button('loading');
			}
		},


		// Set model given form's values
		setModelPropertiesFromForm: function () {
			var self = this;
			var updatedAttributes = {};
			function readFormValue (attribute) {
				return self.$(('#' + attribute)).val();
			}

			function setAttribute(attribute, value) {
				updatedAttributes[attribute] = value;
			}

			setAttribute('name', readFormValue('claimerName'));
			setAttribute('type_id', app.views.selectListClaimerTypeView.getSelectedItem());
			setAttribute('technical_service_id', app.views.selectListClaimerTechnicalServiceView.getSelectedItem());
			setAttribute('technical_site_id', app.views.selectListClaimerTechnicalSiteView.getSelectedItem());
			this.model.set(updatedAttributes, {silent:true});
		},


		saveClaimer: function(e){
			e.preventDefault();
			var self = this;
			self.toggleLoadingOnSubmitButton();
			self.setModelPropertiesFromForm();
			self.persistClaimer().fail(function (e) {
				console.error(e);
			}).
				always(function () {
					self.toggleLoadingOnSubmitButton();
					self.modal.modal('hide');
				});
		},

		persistClaimer: function () {
			if (this.model.isNew()) {
				return this.createClaimer();
			} else {
				return this.updateClaimer();
			}
		},


		updateClaimer: function () {
			var self = this;
			return self.model.save(this.model.changedAttributes(),{patch :true}).
				done(function () {
					self.model.fetch({ data : {fields : self.model.fields} });
				});
		},


		createClaimer: function () {
			var self = this;
			return self.model.save().
				done( function (data) {
					self.model.set('id' ,data);
					self.model.fetch({silent: true, data : {fields: ClaimersCollection.prototype.fields} }).
						done( function () {
							app.views.claimersListView.collection.add(self.model);
						});
				});
		}

	});

});
