/******************************************
* APPLICATION NAMESPACE
*/
define('main', [

	// Load our app module and pass it to our definition function
	'app', 'appRouter', 'usersCollection', 'userModel'

], function(app, AppRouter, UsersCollection, UserModel){

	'use strict';

	var main  = {


		/** Application initialization
		*/
		init: function(lang) {



		// Retrieve App properties, configuration and language //
		$.when(app.loadStaticFile('properties.json'), app.loadStaticFile('config/configuration.json'), app.loadStaticFile('config/routes.json'), app.loadI18nScripts(lang))
			.done(function (properties_data, configuration_data, routes_data, lang_data) {


				// Set the app properties configuration and language //
				app.properties  = properties_data[0];
				app.config 		= configuration_data[0];
				app.routes      = routes_data[0];
				app.lang        = lang_data[0];



				// Instantiation of UsersCollections & UserModel //
				app.collections.users           = new UsersCollection();
				//app.collections.users.fetch();



				app.models.user = new UserModel();
				if(_.isNull(localStorage.getItem('users-collection'))){
					app.collections.users.add(app.models.user);
				}
				else{
					var id = localStorage.getItem('users-collection');
					var detailsUser = jQuery.parseJSON(localStorage.getItem('users-collection-'+id));

					app.models.user.setUID(detailsUser.uid);
					app.models.user.setAuthToken(detailsUser.authToken);
					app.models.user.setLogin(detailsUser.login);
					app.models.user.setFirstname(detailsUser.firstname);
					app.models.user.setLastname(detailsUser.lastname);
					app.models.user.setDST(detailsUser.isDST);
					app.models.user.setManager(detailsUser.isManager);
					app.models.user.setMenu(detailsUser.menu);
					app.models.user.setContext({tz: detailsUser.context.tz, lang : detailsUser.context.lang});
					app.models.user.setGroups(detailsUser.groupsID);
					app.models.user.setLastConnection(detailsUser.lastConnection);
					app.models.user.setServices(detailsUser.service_ids);
					app.models.user.setService(detailsUser.service_id);
					app.models.user.setContact(detailsUser.contact_id);
				}


				/*if(_.isEmpty(app.collections.users.models)){
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