define([
	'app',

], function(app){


	/******************************************
	* Header View
	*/
	var HeaderView = Backbone.View.extend({

		el           : '#header-navbar',

		templateHTML : 'header',


		// The DOM events //
		events: {
			'click li.disabled' : 'preventDefault'
		},


		/** View Initialization
		*/
		initialize: function () {
			this.render();
		},



		/** Display the view
		*/
		render: function(){
			var self = this;


			var currentModule = _(Backbone.history.fragment).strLeft('/');
			var currentUrl    = _(_(Backbone.history.fragment).strRight('/')).strLeft('/');

			if(currentUrl == app.config.menus.openbase){
				currentUrl = _(_(_(Backbone.history.fragment).strRight('/')).strRight('/')).strLeft('/');
				currentModule = app.config.menus.openbase;
			}


			$.get("templates/" + this.templateHTML + ".html", function(templateData) {


				var template = _.template(templateData, {
					lang         : app.lang,
					user         : app.models.user,
					menusToLoad  : app.config.menus,
					currentModule: currentModule,
					currentUrl   : currentUrl
				});

				$(self.el).html(template);

			});

		},


		preventDefault: function(event){
			event.preventDefault();
		},


	});

return HeaderView;

});