define(['app', 'appHelpers', 'claimersTypesCollection', 'claimerTypeModel', 'genericListView', 'paginationView', 'itemClaimerTypeView', 'modalClaimerTypeView'],
	function (app, AppHelpers, ClaimersTypesCollection,  ClaimerTypeModel, GenericListView, PaginationView, ItemClaimerTypeView, ModalClaimerTypeView) {

		'use strict';

		return  GenericListView.extend({

			templateHTML: 'templates/lists/claimersTypesList.html',


			// The DOM events //
			events: function () {
				return _.defaults({
						'click a.modalCreateClaimerType': 'modalCreateClaimerType',
					},
					GenericListView.prototype.events
				);
			},


			/** View Initialization
			 */
			initialize: function (params) {
				this.options = params;

				var self = this;

				this.initCollection().done(function () {

					// Unbind & bind the collection //
					self.collection.off();
					self.listenTo(self.collection, 'add', self.add);

					app.router.render(self);
				});
			},


			/** When the model ara created //
			 */
			add: function (model) {

				var itemClaimerTypeView = new ItemClaimerTypeView({ model: model });
				$('#rows-items').prepend(itemClaimerTypeView.render().el);
				AppHelpers.highlight($(itemClaimerTypeView.el));

				app.notify('', 'success', app.lang.infoMessages.information, model.getName() + ' : ' + app.lang.infoMessages.claimerTypeCreateOk);
				this.partialRender();
			},


			/** Display the view
			 */
			render: function () {
				var self = this;

				// Change the page title //
				app.router.setPageTitle(app.lang.viewsTitles.claimersTypesList);


				// Retrieve the template //
				$.get(this.templateHTML, function (templateData) {
					var template = _.template(templateData, {
						lang: app.lang,
						nbClaimersTypes: self.collection.cpt
					});

					$(self.el).html(template);

					// Call the render Generic View //
					GenericListView.prototype.render(self);


					// Create item category request view //
					_.each(self.collection.models, function (claimerType) {
						var itemClaimerTypeView = new ItemClaimerTypeView({model: claimerType});
						$('#rows-items').append(itemClaimerTypeView.render().el);
					});


					// Pagination view //
					app.views.paginationView = new PaginationView({
						page: self.options.page.page,
						collection: self.collection
					});

					app.views.paginationView.render();

				});

				$(this.el).hide().fadeIn();

				return this;
			},


			/** Partial Render of the view
			*/
			partialRender: function () {
				var self = this;

				this.collection.count(this.fetchParams).done(function () {
					$('#badgeNbClaimerTypes').html(self.collection.cpt);
					app.views.paginationView.render();
				});
			},



			/** Modal form to create a new Cat
			*/
			modalCreateClaimerType: function (e) {
				e.preventDefault();

				app.views.modalClaimerTypeView = new ModalClaimerTypeView({
					el: '#modalSaveClaimerType'
				});
			},



			/** Collection Initialisation
			*/
			initCollection: function () {
				var self = this;

				// Check if the collections is instantiate //
				if (_.isUndefined(this.collection)) {
					this.collection = new ClaimersTypesCollection();
				}


				// Check the parameters //
				if (_.isUndefined(this.options.sort)) {
					this.options.sort = this.collection.default_sort;
				}
				else {
					this.options.sort = AppHelpers.calculPageSort(this.options.sort);
				}
				this.options.page = AppHelpers.calculPageOffset(this.options.page);


				// Create Fetch params //
				this.fetchParams = {
					silent: true,
					data: {
						limit: app.config.itemsPerPage,
						offset: this.options.page.offset,
						sort: this.options.sort.by + ' ' + this.options.sort.order
					}
				};
				if (!_.isUndefined(this.options.search)) {
					this.fetchParams.data.filters = AppHelpers.calculSearch({search: this.options.search }, ClaimerTypeModel.prototype.searchable_fields);
				}


				return $.when(self.collection.fetch(this.fetchParams))
					.fail(function (e) {
						console.log(e);
					});

			}

		});


	});
