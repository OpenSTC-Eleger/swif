define([
	'app',

], function(app){



	/******************************************
	* Login View
	*/
	var DashboardView = Backbone.View.extend({


		el           : '#rowContainer',

		templateHTML : 'dashboard',

		
		// The DOM events //
		events: {
			
		},



		/** View Initialization
		*/
		initialize: function(user) {
			//console.log('Login view Initialize');
		},



		/** Display the view
		*/
		render: function() {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(_.join(' ', app.lang.applicationName, app.lang.viewsTitles.myApplications));



			// Retrieve the Login template // 
			$.get("templates/" + this.templateHTML + ".html", function(templateData){

				var template = _.template(templateData, {
					lang        : app.lang,
					user        : app.models.user,
					menusToLoad : app.config.menus
				});

				$(self.el).html(template);

			});


			$(this.el).hide().fadeIn();
			return this;
		},


	});


return DashboardView;

});