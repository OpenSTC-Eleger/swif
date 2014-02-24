/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

], function(app){

	'use strict';

	/******************************************
	* Header View
	*/
	var HeaderView = Backbone.View.extend({

		el           : '#header-navbar',

		templateHTML : 'templates/others/header.html',


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


			var currentModule = _.strLeft(Backbone.history.fragment, '/');
			var currentUrl    = _.strLeft(_.strRight(Backbone.history.fragment, '/'), '/');


			if(currentUrl == app.config.menus.openbase){
				currentUrl = _(_(_(Backbone.history.fragment).strRight('/')).strRight('/')).strLeft('/');
				currentModule = app.config.menus.openbase;
			}


			$.get(this.templateHTML, function(templateData) {


				var template = _.template(templateData, {
					lang         : app.lang,
					user         : app.current_user,
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