/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'analyticAccountsCollection',

	'analyticAccountModel',

	'genericListView',
	'genericFormModalView',
	'itemAccountAnalyticView'


], function(app, AppHelpers, AnalyticAccountsCollection, AnalyticAccountModel, GenericListView, GenericFormModalView, ItemAccountAnalyticView){

	'use strict';

	/******************************************
	* Budgets List View
	*/
	var AnalyticAccountsListView = GenericListView.extend({

		templateHTML  : '/templates/lists/analyticAccountsList.html',
		templateModalFormHTML: '/templates/modals/modalAnalyticAccount.html',
		model         : AnalyticAccountModel,


		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.createModel' : 'openModalCreate',
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function () {
			this.buttonAction = app.lang.achatsstocks.actions.addAnalyticAccount;
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new AnalyticAccountsCollection(); }

			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.achatsstocks.viewsTitles.analyticAccountsList);


			// Retrieve the template //
			$.get(app.menus.openstcachatstock + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang    : app.lang,
					nbAnalyticAccounts: self.collection.cpt
				});

				$(self.el).html(template);


				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);

				_.each(self.collection.models, function(analyticAccountModel){
					var itemAccountAnalyticView  = new ItemAccountAnalyticView({model: analyticAccountModel});
					$('#rows-items').append(itemAccountAnalyticView.render().el);
				});


			});

			$(this.el).hide().fadeIn();

			return this;
		},
		
		openModalCreate: function(e){
			e.preventDefault();
			new GenericFormModalView({
				el:'#modalView',
				//action: action,
				collection: this.collection,
				modelName: AnalyticAccountModel,
				title:app.lang.achatsstocks.modalAnalyticAccount.create,
				templateForm: app.menus.openstcachatstock + this.templateModalFormHTML
			});
		},

	});

	return AnalyticAccountsListView;

});