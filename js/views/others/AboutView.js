define([
	'app'

], function(app){

	'use strict';


	/******************************************
	* About View
	*/
	var AboutView = Backbone.View.extend({

		el           : '#rowContainer',

		templateHTML : 'templates/others/about.html',



		/** View Initialization
		*/
		initialize : function() {
			app.router.render(this);
		},



		/** Display the view
		*/
		render : function() {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.about);


			// Retrieve the Login template //
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang   : app.lang,
					version: app.properties.version
				});

				$(self.el).html(template);
			});

			$(this.el).hide().fadeIn('slow');

			return this;
		}


	});

	return AboutView;

});