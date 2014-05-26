/*!
 * SWIF-OpenSTC
 *
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app'

], function(app){

	'use strict';


	/******************************************
	* Row Intervention View
	*/
	var ItemBudgetBudgetLineView = Backbone.View.extend({

		tagName      : 'tr',

		templateHTML : '/templates/items/itemBudgetBudgetLine.html',

		className   : 'row-nested-objects',



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			//this.model.off();
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openachatsstocks+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang       : app.lang,
					budgetLine : self.model
				});

				$(self.el).html(template);

			});

			$(this.el).hide().fadeIn();
			return this;
		}

	});

	return ItemBudgetBudgetLineView;
});