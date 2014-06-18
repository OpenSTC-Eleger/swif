/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'userModel',
	'usersCollection',

	'genericListView',
	'itemUserView',
	'paginationView'

], function(app, AppHelpers, UserModel, UsersCollection, GenericListView, ItemUserView, PaginationView){

	'use strict';


	/******************************************
	* Users List View
	*/
	var UsersListView = GenericListView.extend({

		templateHTML: 'templates/lists/usersList.html',

		model       : UserModel,


		/** View Initialization
		*/
		initialize: function() {
			// Check if the collections is instantiate //
			if (_.isUndefined(this.collection)) {
				this.collection = new UsersCollection();
			}

			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.usersList);


			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang    : app.lang,
					nbUsers : self.collection.cpt
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);


				// Create item user view //
				_.each(self.collection.models, function(place){
					var itemUserView  = new ItemUserView({model: place});
					$('#rows-items').append(itemUserView.render().el);
				});


				// Pagination view //
				app.views.paginationView = new PaginationView({
					page       : self.options.page.page,
					collection : self.collection
				});

			});

			$(this.el).hide().fadeIn();

			return this;
		}

	});

	return UsersListView;

});