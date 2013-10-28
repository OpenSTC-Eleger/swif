define([
	'jquery',
	'underscore',
	'backbone',
	'global'

], function($, _, Backbone, global){
	

	/******************************************
	* About View
	*/
	var NotFoundView = Backbone.View.extend({

		el : '#rowContainer',

		templateHTML: '404',

		
		/** View Initialization
		*/
		initialize : function(user) {
			//this.render();
	   },



		/** Display the view
		*/
		render : function() {
			var self = this;

			// Change the page title //
			global.router.setPageTitle(global.lang.viewsTitles.pageNotFound);

			// Change the active menu item //
			global.views.headerView.selectMenuItem('');

		   
			// Retrieve the Login template // 
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
			 
				var template = _.template(templateData, { lang: global.lang, homeUrl : global.routes.home.url});
				$(self.el).html(template);
			});

			$(this.el).hide().fadeIn('slow');
			return this;
		}

	 
	});

	return NotFoundView;

});