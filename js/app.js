/******************************************
* APPLICATION NAMESPACE
*/
define('app', [

	// Load our app module and pass it to our definition function
	'backbone', 'moment', 'nprogress', 'pnotify', 'bootstrap'

], function(Backbone, moment, NProgress, pnotify){

	'use strict';


var app =  {


	// Instances //
	properties     : {},
	routes         : {},
	configuration  : {},
	lang           : {},
	collections    : {},
	models         : {},
	views          : {},




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
			headers: {Authorization: 'Token token=' + app.models.user.getAuthToken()},
			beforeSend: function(){
				NProgress.start();
			},
			complete: function(){
				NProgress.done();
			},
			statusCode: {
				401: function() {
					// Redirect the to the login page only if we are not on the login page //
					if(Backbone.history.fragment != app.routes.login.url){
						app.clearViews();
						app.router.navigate(app.routes.login.url, {trigger: true, replace: true});
					}
					app.loader('hide');
				},
				500: function(){
					// Server unreachable //
					app.notify('large', 'danger', app.lang.errorMessages.serverError, '');
					app.loader('hide');
				},
				502: function(){
					// Server unreachable //
					app.notify('large', 'danger', app.lang.errorMessages.connectionError, app.lang.errorMessages.serverUnreachable);
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




	// Clear all the view off the app Undelegate and delete //
	clearViews: function(){
		_.each(app.views, function(view, viewName){
			view.undelegateEvents();
		});
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

return app;

});