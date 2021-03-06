/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'headerView',
	'footerView',
	'loginView',
	'notFoundView',
	'placesListView',
	'claimersListView',
	'teamsListView',
	'servicesListView',
	'equipmentsListView',
	'claimersTypesListView',
	'aboutView',
	'usersListView',
	'categoriesConsumablesListView',
	'consumablesListView'

], function(app, HeaderView, FooterView, LoginView, NotFoundView, PlacesListView, ClaimersListView, TeamsListView, ServicesListView, EquipmentsListView, ClaimersTypesListView, AboutView, UsersListView, CategoriesConsumablesListView, ConsumablesListView){

	'use strict';


	/******************************************
	* Application Router
	*/
	var router = Backbone.Router.extend({



		/******************************************
		* GENERIC FUNCTION
		*/

		/** Router Initialization
		*/
		initialize: function () {
			var self = this;


			// Create all the Routes of the app //
			_.each(app.routes, function(route){
				self.route(route.url, route.function);
			});

			// Header, Footer Initialize //
			app.views.headerView = new HeaderView();
			app.views.footerView = new FooterView();

			this.bind('route', this.routeChange);
		},


		closeCurrentView: function() {
			if (this.currentView) {
				if (this.currentView) {
					if (this.currentView.$el){
						this.currentView.undelegateEvents();
					}
					this.currentView.$el = (this.currentView.el instanceof $) ? this.currentView.el : $(this.currentView.el);
					this.currentView.el = this.currentView.$el[0];
				}

				if (this.currentView.$el){
					this.currentView.undelegateEvents();
				}
				this.currentView.$el = (this.currentView.el instanceof $) ? this.currentView.el : $(this.currentView.el);
				this.currentView.el = this.currentView.$el[0];
			}
		},


		/** Render a view by undelegating all Event
		*/
		render: function (view) {

			// Close the current view //
			this.closeCurrentView();

			// render the new view //
			view.render();

			//Set the current view //
			this.currentView = view;

			return this;
		},



		/** Check if the User is connect
		*/
		checkConnect: function () {
			if (localStorage.getItem('current_user') === null) {
				return false;
			}
			else {
				return true;
			}
		},



		/** Change the Title of the page
		*/
		setPageTitle: function(title){
			$(document).attr('title', title);
		},


		/** Set the City Wallpaper on the application body
		*/
		toggleCityWallpaper: function(){

			if(!_.isUndefined(app.config.medias.cityWallpaper) && app.config.medias.cityWallpaper !== ''){

				$('body').toggleClass('city-wallpaper');

				if($('body').hasClass('city-wallpaper')){
					$('body').css('backgroundImage','url('+app.config.medias.cityWallpaper+')');
				}
				else{
					$('body').css('backgroundImage','none');
				}
			}
		},



		/** Change the Title of the page
		*/
		routeChange: function(){
			app.views.headerView.render();
		},



		/** Load a RequireJS module
		*/
		loadModule: function (module) {
			require([module], function (module) {
				module();
			});
		},



		/** Set the context
		*/
		setContext: function(params){

			var returnParams = {};

			_.each(params, function(val, args){

				if(!_.isNull(val))  { returnParams[args] = val;}
			});

			return returnParams;
		},




		/******************************************
		* ROUTES FUNCTION
		*/

		/** Redirect to the home page
		*/
		homePageRedirect: function(){
			var self = this;

			if(!this.checkConnect()){
				this.navigate(app.routes.login.url, {trigger: true, replace: true});
			}
			else{

				// Redirect to the firt Menu page //

				var userMenus = app.current_user.getMenus();
				_.find(app.config.menus, function (moduleName, shortName){

					if(!_.isUndefined(userMenus[shortName])) {

						var module = _.first(userMenus[shortName].children);
						var modulePage = _.slugify(_.first(module.children).tag);
						var url = _.join('/', moduleName, _.slugify(modulePage));

						return self.navigate(url, {trigger: true, replace: true});
					}

				});

			}
		},



		/** Login View
		*/
		login: function(){
			//var current_token = app.current_user
			// Check if the user is connect //
			if(!this.checkConnect()){
				app.views.loginView = new LoginView({ model: app.current_user });
				this.render(app.views.loginView);
			}
			else{
				this.navigate(app.routes.home.url, {trigger: true, replace: true});
			}
		},



		/** Logout the user
		*/
		logout: function(){
			app.current_user.logout();
		},



		/** About the App
		*/
		about: function(){
			app.views.aboutView = new AboutView();
		},



		/** 404 Not Found
		*/
		notFound: function(){

			app.views.notFoundView = new NotFoundView();
			this.render(app.views.notFoundView);
		},



		/** Load The Interventions Module
		*/
		loadAppInterventions: function(){
			this.closeCurrentView();
			if(!require.defined('app-interventions')){
				this.loadModule('app-interventions');
			}
			else{
				this.notFound();
			}
		},

		/** Load The Bookings Module
		*/
		loadAppReservations: function(){
			this.closeCurrentView();
			if(!require.defined('app-reservations')){
				this.loadModule('app-reservations');
			}
			else{
				this.notFound();
			}
		},
		
		/** Load The Patrimoines Module
		*/
		loadAppPatrimoines: function(){
			this.closeCurrentView();
			if(!require.defined('app-patrimoines')){
				this.loadModule('app-patrimoines');
			}
			else{
				this.notFound();
			}
		},



		/** Places List
		*/
		places: function(search, filter, sort, page){

			var params = this.setContext({ search: search, filter: filter, sort: sort, page: page });

			app.views.placesListView = new PlacesListView(params);
		},



		/** Services management
		*/
		services: function(search, sort, page){

			var params = this.setContext({search: search, sort: sort, page: page});

			app.views.servicesListView = new ServicesListView(params);
		},



		/** Services management
		*/
		users: function(search, sort, page){

			var params = this.setContext({search: search, sort: sort, page: page});

			app.views.usersListView = new UsersListView(params);
		},



		/** Teams List
		*/
		teams: function(id, search, sort, page){

			var params = this.setContext({id: id, search: search, sort : sort, page : page});

			app.views.teamsListView = new TeamsListView(params);
		},



		/** Claimers List
		*/
		claimers: function(search, sort, page){
			var params = this.setContext({search: search, sort : sort, page : page});
			app.views.claimersListView = new ClaimersListView(params);
		},



		/** Claimer Type List
		*/
		claimerTypes: function(search, sort, page){
			var params = this.setContext({search: search, sort : sort, page : page});
			app.views.claimersTypesListView = new ClaimersTypesListView(params);
		},



		/** Equipments List
		*/
		equipments: function(search, filter, sort, page){

			var params = this.setContext({search: search, filter: filter, sort : sort, page : page});

			app.views.equipmentsListView = new EquipmentsListView(params);
		},



		/** Consumables Categories List
		*/
		categoriesConsumables: function(search, filter, sort, page){
	
			var params = this.setContext({search: search, filter: filter, sort : sort, page : page});
	
			app.views.categoriesConsumablesListView = new CategoriesConsumablesListView(params);
		},



		/** Consumables List
		*/
		consumables: function(search, filter, sort, page){
	
			var params = this.setContext({search: search, filter: filter, sort : sort, page : page});
	
			app.views.consumablesListView = new ConsumablesListView(params);
		}

	});

	return router;

});