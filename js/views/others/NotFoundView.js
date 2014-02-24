/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

], function(app){
	
	'use strict';

	/******************************************
	* About View
	*/
	var NotFoundView = Backbone.View.extend({

		el : '#rowContainer',

		templateHTML: 'templates/others/404.html',

		
		/** View Initialization
		*/
		initialize : function() {
			//this.render();
		},



		/** Display the view
		*/
		render : function() {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.pageNotFound);


			// Retrieve the Login template // 
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, { lang: app.lang, homeUrl : app.routes.home.url});
				$(self.el).html(template);
			});

			$(this.el).hide().fadeIn('slow');

			return this;
		}

	 
	});

	return NotFoundView;

});