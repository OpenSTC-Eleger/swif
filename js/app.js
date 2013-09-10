/******************************************
* APPLICATION NAMESPACE
*/

var app = {


	// Classes //
	Collections     : {},
	Models          : {},
	Views           : {},
	Helpers         : {},

	// Instances //
	properties      : {},
	routes          : {},
	configuration   : {},
	lang            : {},
	collections     : {},
	models          : {},
	views           : {},



	/** Application initialization
	*/
	init: function (lang) {
		var self = this;


		// Retrieve App properties, configuration and language //
		$.when(app.loadStaticFile('properties.json'), app.loadStaticFile('config/configuration.json'), app.loadStaticFile('config/routes.json'), app.loadI18nScripts(lang))
			.done(function (properties_data, configuration_data, routes_data, lang_data) {

				// Set the app properties configuration and language //
				app.properties    = properties_data[0];
				app.config 		  = configuration_data[0];
				app.routes        = routes_data[0];
				app.lang          = lang_data[0];


				// Instantiation of UsersCollections & UserModel //
				app.collections.users           = new app.Collections.Users();
				app.collections.users.fetch();
				
				if(_.isEmpty(app.collections.users.models)){
					app.models.user = new app.Models.User();
					app.collections.users.add(app.models.user);
				}
				else{
					app.models.user = app.collections.users.at(0);	
				}
				
				// Set the Ajax Setup //
				self.setAjaxSetup();

				// Router initialization //
				app.router = new app.Router();

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
			
				_.each(langFiles, function(file){
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = 'i18n/' + lang + '/' + file;
					$('#app').append(script);
				});

				// I18N Moment JS //
				moment.lang(lang);

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
			headers: {Authorization: 'Token token=' + app.models.user.getAuthToken()},
			beforeSend: function(){
				NProgress.start();
			},
			complete: function(){
				NProgress.done();
			},
			statusCode: {
				401: function () {
					console.error('---> Ajax Setp Up 401, redirect to the login page <---');
					// Redirect the to the login page //
					app.router.navigate(app.routes.login.url, {trigger: true, replace: true});
					app.loader('hide');
				},
				500: function(){
					// Server unreachable //
					app.notify('large', 'error', app.lang.errorMessages.serverError, '');
					app.loader('hide');
				},
				502: function(){
					// Server unreachable //
					app.notify('large', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.serverUnreachable);
					app.loader('hide');
				}
			}
		});
	},



	/** Page Loader
	*/
	loader: function(action, message){

		var deferred = $.Deferred();

		console.log(message);

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



// No conflict between Underscore && Underscore String //
_.mixin(_.str.exports());


/******************************************
* AFTER THE LOADING OF THE PAGE
*/
$(document).ready(function () {
	app.init('fr');
});