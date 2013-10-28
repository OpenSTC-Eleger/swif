/******************************************
* APPLICATION NAMESPACE
*/

require.config({

	paths: {
		jquery           : 'libs/jQuery-2.0.3-min',
		underscore       : 'libs/underscore-1.5.2-min',
		backbone         : 'libs/backbone-1.1.0',
		
		moment           : 'libs/moment-2.3.1',
		underscoreString : 'libs/underscore-string-2.3.2',
		localStorage     : 'libs/backbone-localStorage-1.1.7',
		nprogress        : 'libs/NProgress-0.1.2',
		bootstrap        : 'libs/bootstrap-3.0.0',

		global           : 'global'
	},

	shim: {
		'underscore': {
			deps : ['underscoreString'],
			exports: '_',
		},
		'backbone': {
			deps   : ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		'nprogress': {
			deps   : ['jquery'],
			exports: 'NProgress'
		}
	}

});


define('app', [

	// Load our app module and pass it to our definition function
	'jquery', 'underscore', 'backbone', 'global', 'moment', 'nprogress', 'routers/AppRouter', 'collections/UsersCollection', 'models/UserModel'

], function($, _, Backbone, global, moment, NProgress, AppRouter, UsersCollection, UserModel){


var app =  {


	/** Application initialization
	*/
	init: function (lang) {
		var self = this;


		// Retrieve App properties, configuration and language //
		//$.when(app.loadStaticFile('properties.json'), app.loadStaticFile('config/configuration.json'), app.loadStaticFile('config/routes.json'), app.loadI18nScripts(lang))
		$.when(app.loadStaticFile('properties.json'), app.loadStaticFile('config/configuration.json'), app.loadStaticFile('config/routes.json'), app.loadI18nScripts(lang))
			.done(function (properties_data, configuration_data, routes_data, lang_data) {


				// Set the app properties configuration and language //
				global.properties    = properties_data[0];
				global.config 		  = configuration_data[0];
				global.routes        = routes_data[0];
				global.lang          = lang_data[0];


				// Instantiation of UsersCollections & UserModel //
				global.collections.users           = new UsersCollection();
				global.collections.users.fetch();
				
				if(_.isEmpty(global.collections.users.models)){
					global.models.user = new UserModel();
					global.collections.users.add(global.models.user);
				}
				else{
					global.models.user = global.collections.users.at(0);	
				}
				
				// Set the Ajax Setup //
				self.setAjaxSetup();

				// Router initialization //
				global.router = new AppRouter();

				// Listen url changes //
				Backbone.history.start({pushState: false});
			})
			.fail(function(){
				console.error('Unable to init the app');
			});

	},



	/** Load internationalization scripts
	*/
	loadI18nScripts: function (lang) {

		var langFiles = ['moment-lang.js', 'bootstrap-datepicker-lang.js', 'select2-lang.js'];
		
		return $.getJSON('i18n/'+lang+'/app-lang.json')
			.success(function(data) {
			
				/*_.each(langFiles, function(file){
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = 'i18n/' + lang + '/' + file;
					$('#app').append(script);
				});

				// I18N Moment JS //
				moment.lang(lang);*/

			})
			.fail(function(){
				alert('Unable to load the language files');
			});
	},



	/** Load Static file
	*/
	loadStaticFile: function (url) {
		return $.getJSON(url)
			.success(function (data) {
			})
			.fail(function () {
				alert('Unable to load the file : ') + url;
			});
	},



	setAjaxSetup: function(){

		// Set The Ajax Config //
		$.ajaxSetup({
			contentType: "application/json",
			headers: {Authorization: 'Token token=' + global.models.user.getAuthToken()},
			beforeSend: function(){
				NProgress.start();
			},
			complete: function(){
				NProgress.done();
			},
			statusCode: {
				401: function() {
					// Redirect the to the login page only if we are not on the login page //
					if(Backbone.history.fragment != global.routes.login.url){
						global.Helpers.Main.clearViews();
						global.router.navigate(app.routes.login.url, {trigger: true, replace: true});
					}
					app.loader('hide');
				},
				500: function(){
					// Server unreachable //
					app.notify('large', 'danger', global.lang.errorMessages.serverError, '');
					app.loader('hide');
				},
				502: function(){
					// Server unreachable //
					app.notify('large', 'danger', global.lang.errorMessages.connectionError, global.lang.errorMessages.serverUnreachable);
					app.loader('hide');
				}
			}
		});
	},



	/** Page Loader
	*/
	loader: function(action, message){

		var deferred = $.Deferred();

		switch(action){
			case 'display':
				if(_.isUndefined(message)){ 
					$('#loaderMessage').html(app.lang.loadingInProgress);
				}
				else{
					$('#loaderMessage').html(message);
				}
				$('#loader, #modal-block').fadeIn(250, deferred.resolve);
			break;

			case 'hide':
				$('#loader, #modal-block').fadeOut(450, deferred.resolve);
			break;
		}

		return deferred.promise();
	},



	objectifyFilters: function (filterArray) {
		return $.extend({},filterArray);
	},



	/** Notification Message
	*/
	notify: function(notifyModel, type, title, message) {

		"use strict";

		switch(notifyModel){
			case 'large' :
				var addClass = 'stack-bar-top big-icon';
				var width    = '50%';
				var delay    = 4500;
				var hide     = true;
			break;

			default:
				var addClass = '';
				var width    = '320px';
				var delay    = 4500;
				var hide     = true;
			break;
		}

		if(type == 'danger'){ type = 'error'; }

		$.pnotify({
			title        : title,
			text         : message,
			addclass     : addClass,
			width        : width,
			type         : type,
			hide         : hide,
			animate_speed: 'normal',
			opacity      : .9,
			icon         : true,
			animation    : 'slide',
			closer       : true,
			closer_hover : false,
			delay        : delay
		});
	}


};


app.init('fr');

return app;

});



// No conflict between Underscore && Underscore String //
//_.mixin(_.str.exports());


/******************************************
* AFTER THE LOADING OF THE PAGE
*/
/*$(document).ready(function () {
	app.init('fr');
});*/