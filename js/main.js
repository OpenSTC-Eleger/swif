/******************************************
 * APPLICATION NAMESPACE
 */
define('main', [

    // Load our app module and pass it to our definition function
    'app', 'appRouter', 'moment', 'usersCollection', 'userModel'

], function (app, AppRouter, moment, UsersCollection, UserModel) {

    'use strict';

    var main = {


        /** Application initialization
         */
        init: function (lang) {

            // Retrieve App properties, configuration and language //
            $.when(app.loadStaticFile('properties.json'),
                    app.loadStaticFile('config/configuration.json'),
                    app.loadStaticFile('config/routes.json'),
                    app.loadStaticFile('i18n/' + lang + '/app-lang.json'))
                .done(function (properties_data, configuration_data, routes_data, lang_data) {


                    // Set the app properties configuration and language //
                    app.properties = properties_data[0];
                    app.config = configuration_data[0];
                    app.routes = routes_data[0];
                    app.lang = lang_data[0];
                    app.config.lang = lang;

                    // Shortcup to the menus //
                    app.menus = app.config.menus;


                    moment.lang(app.config.lang);

                    // Interface to current_user, this should not be a collection stored in localstorage but just some current_user client state.
                    app.current_user = new UserModel(JSON.parse(localStorage.getItem('current_user')));  //app.current_user

                    // Set the Ajax Setup //
                    app.setAjaxSetup();


                    // Router initialization //
                    app.router = new AppRouter();


                    // Listen url changes //
                    Backbone.history.start({pushState: false});
                })
                .fail(function () {
                    console.error('Unable to init the app');
                });

            $(function () {
                $.ajaxSetup({
                    error: function (x) {
                        // If token expires , clear the localstorage to remove session
                        if (x.status == 401) {
                            localStorage.clear();
                        }

                    }
                });
            });

        }

    };

    return main;
});