/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',
		'contractModel',
		'contractsCollection',
		'advancedSelectBoxView',
		
		'moment',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'
		

], function (app, AppHelpers, ContractModel, ContractsCollection, AdvancedSelectBoxView, moment) {

	'use strict';

	/******************************************
	* Contract Form View
	*/
	var FormContractView = Backbone.View.extend({

		el          : '#rowContainer',

		templateHTML: '/templates/forms/form_contract.html',
		
		templatesBinding: {moment: moment},
		
		// The DOM events //
		events: {
			'change .field-element'			: 'performModelChange',
			'submit #formSaveContract'		: 'saveForm'
			//Form Buttons
		},
		/**
		 *@param id: id of Booking to route to
		 *@return: url to call to go to specified Booking (or to create new Booking if id is not set)
		*/
		urlBuilder: function(id){
			var url = _.strLeft(app.routes.contrat.url, '(');
			var params = '';
			if(!_.isUndefined(id)){
				params = 'id/' + id.toString();
			}
			return _.join('/','#' + url, params);
		},
		
		getField: function(field){
			var ret = null;
			if(_.has(this.model.collection.fieldsMetadata,field)){
				var elt = this.model.collection.fieldsMetadata[field];
				//if a Parser is found for this type of field
				ret = {
						value: this.model.getAttribute(field,false),
						definition: elt
					};
			}
			else{
				console.warn('Swif Error: "' + field + '" not present on Collection, authorized values are : "' + _.keys(this.model.collection.fieldsMetadata));
			}
			return ret;
		},
		
		renderOneComponent: function(dom){
			var self = this;
			var deferred = $.Deferred();
			var field = dom.data('field-name');
			var fieldData = this.getField(field);
			if(fieldData){
				//if a Parser is found for this type of field
				if(_.has(self.formFieldParser,fieldData.definition.type)){
					//retrieve others html markup on the current dom, to pass into the parser
					fieldData = _.extend(fieldData, dom.data());
					//all is correctly set on html markup, now load the html template and parse it to render the component
					var parser = self.formFieldParser[fieldData.definition.type];
					$.get(parser, function(template){
						dom.html(_.template(template, _.extend(self.templatesBinding,{ field:fieldData})));
						deferred.resolve();
					});
				}
				else{
					console.warn('Swif Error: Unrecognized field type "' + fieldData.definition.type.toString() + '", authorized values are : "' + _.keys(self.formFieldParser));
					deferred.resolve();
				}
			}
			else{
				deferred.resolve();
			}
			return deferred;
		},
		
		renderOneSwitchComponent: function(dom){
			var switchData = this.getField(dom.data('field-switch-name'));
			var activeField = switchData.value ? dom.data('field-name-yes') : dom.data('field-name-no');
			var fieldData = {
					field: dom.data(),
					switchData: switchData,
					activeField: this.getField(activeField)
				};
			return $.get(this.formFieldParser.switchField, function(templateData){
				dom.html(_.template(templateData, fieldData));
			});
		},
		
		/**
		 * Method used to render form according to field definitions
		 */
		renderFormComponents: function(){
			var arrayDeferred = [];
			var self = this;
			//TODO: refacto fieldSwitch component to be easier to use
			//$(self.el).find('.field-switch').each(function(){
				//arrayDeferred.push(self.renderOneSwitchComponent($(this)));
			//});
			//for each field element, render its html component
			$(self.el).find('.field').each(function(){
				arrayDeferred.push(self.renderOneComponent($(this)));
			});
			return $.when.apply($,arrayDeferred);
		},
		
		/**
		 * compute OpenERP domain to an objectified domain (field: ..., operator: ..., value: ...)
		 */
		computeSearchparams: function(domain){
			var ret = [];
			_.each(domain, function(item){
				if(_.isArray(item) && item.length == 3){
					ret.push({field: item[0], operator: item[1], value: item[2]});
				}
				else{
					ret.push(item);
				}
			});
			return ret;
		},
		
		renderOneAvancedSelectBox: function(dom){
			var select = new AdvancedSelectBoxView({el: dom, url: dom.attr('data-url')});
			this.advancedSelectBoxes[dom.attr('id')] = select;
			var domain = dom.attr('data-domain');
			if(domain){
				select.resetSearchParams();
				select.searchParams = this.computeSearchparams(domain);
			}
			select.render();
		},
		
		renderAdvancedSelectBoxes: function(){
			var self = this;
			$('.field .select2').each(function(){
				self.renderOneAvancedSelectBox($(this));
			});
		},
		
		/**
		 * Method used to update visibility of the html components, based on html markup and model fields data
		 */
		updateDoms: function(){
			var self = this;
			//first, update dynamic visibility of doms
			$('.field-visible-if').each(function(){
				var fieldData = self.getField($(this).data('field-name'));
				if(fieldData.value == $(this).data('field-value')){
					$(this).removeClass('hide-soft');
				}
				else{
					$(this).addClass('hide-soft');
				}
			});
		},
		
		performModelChange: function(e){
			e.preventDefault();
			var value = null;
			var fieldName = e.target.id;
			var fieldData = this.getField(fieldName);
			if(_.has(this.formValueFieldParser,fieldData.definition.type)){
				value = this.formValueFieldParser[fieldData.definition.type]($(e.target));
			}else{
				value = $(e.target).val();
			}
			this.model.set(fieldName,value);
			this.updateDoms();
		},
		
		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
			var self = this;
			this.advancedSelectBoxes = {};
			this.formFieldParser = {
				char	: app.menus.openpatrimoine + '/templates/form_components/input.html',
				text	: app.menus.openpatrimoine + '/templates/form_components/inputNote.html',
				integer	: app.menus.openpatrimoine + '/templates/form_components/inputNumber.html',
				float	: app.menus.openpatrimoine + '/templates/form_components/inputNumber.html',
				date	: app.menus.openpatrimoine + '/templates/form_components/inputDate.html',
				selection: app.menus.openpatrimoine + '/templates/form_components/inputList.html',
				boolean	: app.menus.openpatrimoine + '/templates/form_components/bsSwitch.html',
				many2one: app.menus.openpatrimoine + '/templates/form_components/select.html',
				switchField: app.menus.openpatrimoine + '/templates/form_components/fieldSwitch.html',
			};
			this.formValueFieldParser = {
				boolean: function(dom){return dom.prop('checked');},
				date: function(dom){return dom.val() ? moment(dom.val(),'DD/MM/YYYY').format('YYYY-MM-DD') : false;},
				many2one: function(dom){
					var select = self.advancedSelectBoxes[dom.attr('id')];
					return select.getSelectedItem() ? [select.getSelectedItem(), select.getSelectedText()] : false;
				},
			};
			this.initModel().done(function(){
				app.router.render(self);
			});
		},
		
		/** Display the view
		*/
		render: function() {

			var pageTitle = '';
			if(_.isNull(this.model.getId())) {
				pageTitle = app.lang.patrimoine.viewsTitles.newContract;
			}
			else{
				pageTitle = app.lang.patrimoine.viewsTitles.contractDetails +' '+ this.model.getId();
			}
			// Change the page title //
			app.router.setPageTitle(pageTitle);

			var self = this;
			// Retrieve the template //
			$.get(app.menus.openpatrimoine + this.templateHTML, function(templateData){
				//compute dates with user TZ

				var template = _.template(templateData, {
					lang		: app.lang,
					pageTitle	: pageTitle,
					readonly	: false,
					moment		: moment,
					user		: app.current_user
				});

				$(self.el).html(template);
				self.renderFormComponents().always(function(){
					self.renderAdvancedSelectBoxes();
					self.updateDoms();
					$('.make-switch').bootstrapSwitch();
					$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });
				});
				$(this.el).hide().fadeIn('slow');
			});
			return this;
		},
		
		/**
		 * Save data into backend, use special behavior of method 'saveToBackebnd' to work fine with OpenERP 
		 */
		
		saveForm: function(e){
			e.preventDefault();
			this.model.saveToBackend().done(function(){
				window.history.back();
			}).fail(function(e){
				console.log(e);
			});
		},
		
		/**
		 * Initialize model, fetch its data (if id is set on url) and perform a HEAD request to have fields definitions
		 */
		initModel: function(){
			var arrayDeferred = [];
			if(_.isUndefined(this.options.id)){
				this.model = new ContractModel();
			}
			else{
				this.model = new ContractModel({id:this.options.id});
				arrayDeferred.push(this.model.fetch());
			}
			//perform a head request to retrieve metadaFields
			this.model.collection = new ContractsCollection();
			arrayDeferred.push	(this.model.collection.count());
			return $.when.apply($, arrayDeferred);

		}
	});
	return FormContractView;
});