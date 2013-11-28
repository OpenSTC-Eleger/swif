/******************************************
* APPLICATION NAMESPACE
*/
define('main', [

	// Load our app module and pass it to our definition function
	'app', 'appRouter', 'moment', 'usersCollection', 'userModel'

], function(app, AppRouter, moment, UsersCollection, UserModel){

	'use strict';

	var main  = {


		/** Application initialization
		*/
		init: function(lang) {

		// Retrieve App properties, configuration and language //
		$.when(app.loadStaticFile('properties.json'),
			   app.loadStaticFile('config/configuration.json'),
			   app.loadStaticFile('config/routes.json'),
			   app.loadStaticFile('i18n/'+lang+'/app-lang.json'))
			.done(function (properties_data, configuration_data, routes_data, lang_data) {


				// Set the app properties configuration and language //
				app.properties  = properties_data[0];
				app.config 		= configuration_data[0];
				app.routes      = routes_data[0];
				app.lang        = lang_data[0];
				app.config.lang = lang;

				// Shortcup to the menus //
				app.menus = app.config.menus;
			

				moment.lang(app.config.lang);

				// Instantiation of UsersCollections & UserModel //
				app.collections.users  = new UsersCollection();


				app.models.user = new UserModel();
				if(_.isNull(localStorage.getItem('users-collection'))){
					app.collections.users.add(app.models.user);
				}
				else{
					var id = localStorage.getItem('users-collection');
					var detailsUser = jQuery.parseJSON(localStorage.getItem('users-collection-'+id));

					app.models.user.set(detailsUser);
				}


				// UNABLE TO FETCH WITH BACKBONE LOCALSTORAGE AND REQUIRE JS //
				/*app.collections.users.fetch();
				if(_.isEmpty(app.collections.users.models)){
					app.models.user = new UserModel();
					app.collections.users.add(app.models.user);
				}
				else{
					app.models.user = app.collections.users.at(0);
				}*/


				// Set the Ajax Setup //
				app.setAjaxSetup();


				// Router initialization //
				app.router = new AppRouter();


				// Listen url changes //
				Backbone.history.start({pushState: false});
			})
			.fail(function(){
				console.error('Unable to init the app');
			});
		}

}


return main;


});