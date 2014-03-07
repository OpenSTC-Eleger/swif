/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'claimersCollection',
	'claimerModel',
	'genericListView',
	'paginationView',
	'claimerView',
	'claimerContactsListView',
	'modalClaimerEdit'

], function (app, AppHelpers, ClaimersCollection, ClaimerModel, GenericListView, PaginationView, ClaimerView, ClaimerContactsListView, ModalClaimerEdit) {

	'use strict';


	/******************************************
	* Claimers List View
	*/
	var ClaimersListView =  GenericListView.extend({

		el          : '#rowContainer',

		templateHTML: 'templates/lists/claimers.html',

		model       : ClaimerModel,

		selectedClaimer: '',
		selectedContact: '',


		// The DOM events //
		events: function () {
			return _.defaults({
					'click a.createModel': 'modalNewClaimer'
				},
				GenericListView.prototype.events
			);
		},


		/** View Initialization
		*/
		initialize: function() {
			// Check if the collections is instantiate //
			if (_.isUndefined(this.collection)) {
				this.collection = new ClaimersCollection();
			}

			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.claimersList);


			// Retrieve the template //
			$.get(this.templateHTML, function (templateData) {
				var template = _.template(templateData, {
					lang: app.lang,
					nbClaimers: self.collection.cpt
				});

				$(self.el).html(template);
				GenericListView.prototype.render.apply(self);


				$('*[data-toggle="tooltip"]').tooltip();

				_.each(self.collection.models, function (claimer) {
					var simpleView = new ClaimerView({model: claimer});
					var detailedView = new ClaimerContactsListView({model: claimer});
					$('#claimersList').append(simpleView.render().el);
					$('#claimersList').append(detailedView.render().el);
					simpleView.detailedView = detailedView;
				});

				// Set the focus to the first input of the form //
				$('#modalSaveContact, #modalSaveClaimer').on('shown', function () {
					$(this).find('input, textarea').first().focus();
				});

			});

			$(this.el).hide().fadeIn('slow');

			return this;
		},



		add: function (model) {
			var claimerView = new ClaimerView({ model: model });
			$('#claimersList').prepend(claimerView.render().el);
			AppHelpers.highlight($(claimerView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName() + ' : ' + app.lang.infoMessages.claimerCreateOK);
		},



		getIdInDropDown: function (view) {
			var item = null;

			if (view && view.getSelected()){
				item = view.getSelected().toJSON();
			}

			if(!_.isNull(item)){
				return [ item.id, item.name ];
			}
			else{
				return 0;
			}
		},



		getTarget: function (e) {
			e.preventDefault();
			// Retrieve the ID of the intervention //
			var link = $(e.target);
			this.pos = _(link.parents('tr').attr('id')).strRightBack('_');

		},



		setModel: function (e) {
			this.getTarget(e);
			var self = this;
			this.selectedClaimer = _.filter(app.collections.claimers.models, function (item) {
				return item.attributes.id == self.pos;
			});

			if (this.selectedClaimer.length > 0) {
				this.model = this.selectedClaimer[0];
				this.selectedClaimerJson = this.model.toJSON();
			}
			else {
				this.selectedClaimerJson = null;
			}
		},



		modalNewClaimer: function (e) {
			e.preventDefault();
			app.views.modalClaimerView = new ModalClaimerEdit({
				el: '#modalEditClaimer'
			});
		},



		/** Display information to the Modal for delete claimer
		*/
		modalDeleteClaimer: function (e) {

			// Retrieve the ID of the Claimer //
			this.setModel(e);


			$('#infoModalDeleteClaimer p').html(this.selectedClaimerJson.name);
			$('#infoModalDeleteClaimer small').html(this.selectedClaimerJson.type_id[1]);
		},



		/** Delete the selected claimer
		*/
		deleteClaimer: function (e) {
			e.preventDefault();

			var self = this;
			this.model.delete({
				success: function (data) {
					if (data.error) {
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else {
						app.collections.claimers.remove(self.model);
						$('#modalDeleteClaimer').modal('hide');
						app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.claimerDeleteOk);
						self.render();
					}
				},
				error: function (e) {
					console.error(e);
					alert('Impossible de supprimer le demandeur');
				}

			});
		},


		preventDefault: function (event) {
			event.preventDefault();
		}

	});

	return ClaimersListView;
});