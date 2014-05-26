/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',
		'purchaseLineModel',
		'purchaseLinesCollection',
		
		'genericFormView',
		'advancedSelectBoxView',
		
		'moment',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'
		

], function (app, AppHelpers, PurchaseLineModel, PurchaseLinesCollection, GenericFormView, AdvancedSelectBoxView, moment) {

	'use strict';

	/******************************************
	* Contract Form View
	*/
	var FormLinePurchaseView = GenericFormView.extend({

		tagName		: 'tr',
		templateHTML: '/templates/forms/formPurchaseLine.html',
		collectionName: PurchaseLinesCollection,
		modelName: PurchaseLineModel,
		
		// The DOM events //
		events: function(){
			return _.defaults({
				
			}, GenericFormView.prototype.events);
		},
		
		/** View Initialization
		*/
		initialize : function() {
			
			GenericFormView.prototype.initialize.apply(this, arguments);
		},
		
		/** Display the view
		*/
		render: function() {
			
			var self = this;
			// Retrieve the template //
			$.get(app.menus.openachatsstocks + this.templateHTML, function(templateData){
				//compute dates with user TZ

				var template = _.template(templateData, {
					lang		: app.lang,
					readonly	: false,
					moment		: moment,
					user		: app.current_user,
					purchaseLine: self.model,
				});

				$(self.el).html(template);
				GenericFormView.prototype.render.apply(self);
				
				$(this.el).hide().fadeIn('slow');
			});
			return this;
		},
		
	});
	return FormLinePurchaseView;
});