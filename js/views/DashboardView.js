define([
	'jquery',
	'underscore',
	'backbone',
	'global',

], function($, _, Backbone, global){



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
			//app.router.setPageTitle(app.lang.applicationName +' '+ global.lang.viewsTitles.login);

			// Retrieve the Login template // 
			$.get("templates/" + this.templateHTML + ".html", function(templateData){

				var template = _.template(templateData, {
					lang: global.lang
				});

				$(self.el).html(template);

			});

			global.views.headerView.render(global.router.mainMenus.manageInterventions);


			$(this.el).hide().fadeIn();
			return this;
		},


		launch: function(e){

			e.preventDefault();

			
		}




	});


return DashboardView;

});