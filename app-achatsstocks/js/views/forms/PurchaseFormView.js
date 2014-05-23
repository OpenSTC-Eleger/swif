/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',
		'purchaseModel',
		'purchasesCollection',
		
		'genericFormView',
		'advancedSelectBoxView',
		
		'moment',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'
		

], function (app, AppHelpers, PurchaseModel, PurchasesCollection, GenericFormView, AdvancedSelectBoxView, moment) {

	'use strict';

	/******************************************
	* Contract Form View
	*/
	var FormPurchaseView = GenericFormView.extend({

		el          : '#rowContainer',
		tagName		: 'div',
		templateHTML: '/templates/forms/formPurchase.html',
		collectionName: PurchasesCollection,
		modelName: PurchaseModel,
		
		// The DOM events //
		events: function(){
			return _.defaults({
				
			}, GenericFormView.prototype.events);
		},
		
		/**
		 *@param id: id of Purchase to route to
		 *@return: url to call to go to specified Purchase (or to create new Purchase if id is not set)
		*/
		urlBuilder: function(id){
			var url = _.strLeft(app.routes.purchasesForm.url, '(');
			var params = '';
			if(!_.isUndefined(id)){
				params = 'id/' + id.toString();
			}
			if(params){
				url = _.join('/', url, params);
			}
			return '#' + url;
		},
		
		/** View Initialization
		*/
		initialize : function() {
			
			GenericFormView.prototype.initialize.apply(this, arguments);
		},
		
		/** Display the view
		*/
		render: function() {
			var pageTitle = app.lang.achatsstocks.viewsTitles.editPurchase;
			if(this.model.isNew()){
				pageTitle = app.lang.achatsstocks.viewsTitles.newPurchase;
			}
			
			var self = this;
			// Retrieve the template //
			$.get(app.menus.openachatsstocks + this.templateHTML, function(templateData){
				//compute dates with user TZ

				var template = _.template(templateData, {
					lang		: app.lang,
					readonly	: false,
					moment		: moment,
					user		: app.current_user,
					purchase	: self.model,
					pageTitle	: pageTitle
				});

				$(self.el).html(template);
				GenericFormView.prototype.render.apply(self);
				
				$(this.el).hide().fadeIn('slow');
			});
			return this;
		},
		
	});
	return FormPurchaseView;
});