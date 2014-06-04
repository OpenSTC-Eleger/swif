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
		'purchaselineFormView',
		'purchaseFormGeneralView',
		
		'moment',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'
		

], function (app, AppHelpers, PurchaseModel, PurchasesCollection, GenericFormView, AdvancedSelectBoxView, PurchaselineFormView, PurchaseFormGeneralView, moment) {

	'use strict';

	/******************************************
	* Purchase Form View
	*/
	var FormPurchaseView = Backbone.View.extend({

		el          : '#rowContainer',
		tagName		: 'div',
		templateHTML: '/templates/forms/formPurchase.html',
		
		// The DOM events //
		events: {
			'submit #formSaveModel'			: 'savePostForm',
			'click #saveDraftFormPurchase'	: 'saveDraftForm',
			'click #updateDraftForm'		: 'setDraftForm',
			'click #formBack'				: 'backToList'
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
		
		addLine: function(id, model){
			var params = {parentModel: this.model, notMainView:true};
			if(id){
				params.id = id;
			}
			else if(model){
				params.model = model;
			}
			var view = new PurchaselineFormView(params);
			this.linesViews.push(view);
			$('#lines-items').append(view.el);
		},
		
		/** View Initialization
		*/
		initialize : function() {
			var self = this;
			this.linesViews = [];
			this.options = arguments[0];
			this.initModel().done(function(){
				app.router.render(self);
			});
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
			$.get(app.menus.openstcachatstock + this.templateHTML, function(templateData){
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
				$(this.el).hide().fadeIn('slow');
				
				self.formGeneralView = new PurchaseFormGeneralView({model:self.model, notMainView:true});
				_.each(self.model.getAttribute('order_line', []), function(line_id){
					self.addLine(line_id);
				});
				
				
			});
			return this;
		},
		
		/**
		 * Initialize model, fetch its data (if id is set on url) and perform a HEAD request to have fields definitions
		 */
		initModel: function(){
			var arrayDeferred = [];
			//if needed, initialize model
			if(_.isUndefined(this.options.id)){
				this.model = new PurchaseModel();
			}
			else{
				this.model = new PurchaseModel({id:this.options.id});
				arrayDeferred.push(this.model.fetch());
			}
			return $.when.apply($, arrayDeferred);
		},
		
		/**
		 * Dispatch save to all sub-models on this view
		 */
		saveForm: function(e, stayOnForm, todo){
			e.preventDefault();
			var self = this;
			var deferredArray = [];
			//trigger "save" event of the general view
			this.formGeneralView.saveForm(e).done(function(){
				//trigger "save" event for each lineView attached to this one
				_.each(self.linesViews, function(lineView){
					lineView.model.set({order_id: self.formGeneralView.model.getId()});
					deferredArray.push(lineView.saveForm(e));
				});
				$.when.apply($,deferredArray).then(function(){
					deferredArray = [];
					if(todo){
						deferredArray.push(self.model.save(todo, {wait:true, patch:true}));
					}
					$.when.apply($, deferredArray).done(function(){
						if(stayOnForm){
							self.model.fetch().done(function(){
								self.render();
							});
						}
						else{
							window.history.back();
						}
					});
				});
			});
		},
		
		savePostForm: function(e){
			e.preventDefault();
			this.saveForm(e, false, {wkf_evolve:'post'});
		},
		
		saveDraftForm: function(e){
			console.log('saveDraft');
			this.saveForm(e, true);
		},
		
		backToList: function(e){
			e.preventDefault();
			window.history.back();
		},
	});
	
	return FormPurchaseView;
});