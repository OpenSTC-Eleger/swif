define([
	'app',
	'backbone'

], function(app, Backbone){



	/******************************************
	* Login View
	*/
	var DashboardView = Backbone.View.extend({


		el           : '#rowContainer',

		templateHTML : 'dashboard',

		
		// The DOM events //
		events: {
			'click #lol'   :   'launch'
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
			app.router.setPageTitle(app.lang.applicationName +' '+ "Tableau de bord");

			// Retrieve the Login template // 
			$.get("templates/" + this.templateHTML + ".html", function(templateData){

				var template = _.template(templateData, {
					lang: app.lang
				});

				$(self.el).html(template);

			});

			console.log('Attention les yeux');
			console.log(app);
			app.views.headerView.render(app.router.mainMenus.manageInterventions);


			$(this.el).hide().fadeIn();
			return this;
		},


		launch: function(e){

			e.preventDefault();
		}




	});


return DashboardView;

});