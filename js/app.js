/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

/******************************************
* APPLICATION NAMESPACE
*/
define('app', [

	// Load our app module and pass it to our definition function
	'jquery', 'backbone', 'nprogress', 'pnotify', 'bootstrap'

], function($, Backbone, NProgress){

	'use strict';


	var app =  {


		// Instances //
		properties     : {},
		routes         : {},
		config         : {},
		lang           : {},
		collections    : {},
		models         : {},
		views          : {},



		/** Load Static file
		*/
		loadStaticFile: function (url) {

			return $.getJSON(url)
			.success(function () {
			})
			.fail(function () {
				console.error('Unable to load the file : ' + url);
			});
		},



		setAjaxSetup: function(){

			if(_.isUndefined(window.ajaxRequest)){
				window.ajaxRequest = 0;
			}

			// Set The Ajax Config //
			$.ajaxSetup({
				contentType: 'application/json',
				headers: {Authorization: 'Token token=' + app.current_user.getAuthToken()},
				beforeSend: function(){
					window.ajaxRequest++;

					if(!NProgress.isStarted()){ NProgress.start(); }
				},
				complete: function(){
					window.ajaxRequest--;
					if(window.ajaxRequest === 0){ NProgress.done(); }
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
			_.each(app.views, function(view){
				view.undelegateEvents();
			});
		},



		/** Notification Message
		*/
		notify: function(notifyModel, type, title, message) {

			var addClass, width, delay;


			switch(notifyModel){
				case 'large' :
					addClass = 'stack-bar-top';
					delay    = 5500;
					width    = '50%';
					break;

				default:
					addClass = '';
					delay    = 4500;
					width    = '310px';
					break;
			}


			$.pnotify({
				title        : title,
				text         : message,
				addclass     : addClass,
				delay        : delay,
				styling      : 'fontawesome',
				width        : width,
				type         : type,
				maxonscreen  : 6,
				sticker      : false,
				hide         : true,
				history      : false,
				animate_speed: 'normal',
				opacity      : 0.9,
				icon         : true,
				animation    : 'fade',
				closer       : true,
				closer_hover : false
			});
		}


	};

	return app;

});