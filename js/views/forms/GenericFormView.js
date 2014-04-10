/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',
		'advancedSelectBoxView',
		
		'moment',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'
		

], function (app, AppHelpers, AdvancedSelectBoxView, moment) {

	'use strict';

	/******************************************
	* Contract Form View
	*/
	var GenericFormView = Backbone.View.extend({
		el: '',
		templateHTML: '',
		collectionName: null,
		modelName: null,
		templatesBinding: {moment: moment},
		
		// The DOM events //
		events: {
			'change .field-element'			: 'performModelChange',
			'submit #formSaveModel'		: 'saveForm'
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
			if(params){
				url = _.join('/', url, params);
			}
			return '#' + url;
		},
		
		/**
		 * Get value and definition of a field
		 * retrieve data from "this.model"
		 */
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
						dom.html(_.template(template, _.extend(self.templatesBinding,{ field:fieldData, lang:app.lang})));
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
		
		/**
		 * Parse Url to replace variable (":technical_service_id" for example) with its value on the url
		 * return a copy of the url parsed with the data
		 */
		parseUrl: function(url){
			var reg = /\/:([\w]+)\//;
			var variableId = url.match(reg);
			var ret = url;
			if(variableId){
				var field = this.getField(variableId[1]);
				if(field && field.value){
					ret = url.replace(':' + variableId[1], field.value[0]);
				}
			}
			return ret;
		},
		
		renderOneAvancedSelectBox: function(dom){
			//if a component already exists, remove it properly
			if(_.has(this.advancedSelectBoxes),dom.attr('id')){
				delete this.advancedSelectBoxes[dom.attr('id')];
			}
			//if url contains variable such as ":technical_service_id", then replace this variable with its value before applying url to the component
			var url = this.parseUrl(dom.attr('data-url'));
			
			//create the component, apply url to it and store the component on a view attribute
			var select = new AdvancedSelectBoxView({el: dom, url: url});
			this.advancedSelectBoxes[dom.attr('id')] = select;
			select.resetSearchParams();
			
			select.render();
		},
		
		renderAdvancedSelectBoxes: function(){
			var self = this;
			$(this.el).find('input.select2.field-element').each(function(){
				self.renderOneAvancedSelectBox($(this));
			});
		},
		
		/**
		 * Method used to update visibility of the html components, based on html markup and model fields data
		 */
		updateDoms: function(){
			var self = this;
			//first, update dynamic visibility of doms
			$(this.el).find('.field-visible-if').each(function(){
				var fieldData = self.getField($(this).data('field-name'));
				if(fieldData.value == $(this).data('field-value')){
					$(this).removeClass('hide-soft');
				}
				else{
					$(this).addClass('hide-soft');
				}
			});
		},
		
		/**
		 * for each advancedSelectBox, update their url (usually triggered after a model update)
		 */
		updateAdvancedSelectBoxUrl: function(){
			var self = this;
			_.each(this.advancedSelectBoxes, function(item){
				var url = self.parseUrl($(item.el).attr('data-url'));
				item.options.url = url;
			});
		},
		
		/**
		 * store the new value (from the widget) on the model
		 */
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
			if(this.model.get(fieldName) !== value){
				this.model.set(fieldName,value);
			}
		},
		
		/**
		 * triggered at each change on the model
		 * Used to perform dom updates for example
		 * Can be override to make custom behavior according to specifics attributes changes 
		 */
		modelChanged: function(){
			this.updateAdvancedSelectBoxUrl();
			this.updateDoms();
		},
		
		/** View Initialization
		*/
		initialize : function() {
			this.options = arguments[0];
			this.parentModel = this.options.parentModel;
			var self = this;
			this.advancedSelectBoxes = {};
			this.formFieldParser = {
				char	: 'templates/generic-form-components/input.html',
				text	: 'templates/generic-form-components/inputNote.html',
				integer	: 'templates/generic-form-components/inputNumber.html',
				float	: 'templates/generic-form-components/inputDecimal.html',
				date	: 'templates/generic-form-components/inputDate.html',
				selection: 'templates/generic-form-components/inputList.html',
				boolean	: 'templates/generic-form-components/bsSwitch.html',
				many2one: 'templates/generic-form-components/select.html',
				switchField: 'templates/generic-form-components/fieldSwitch.html',
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
				self.listenTo(self.model, 'change', self.modelChanged);
				if(!self.options.notMainView){
					app.router.render(self);
				}
				else{
					self.render();
				}
			});
		},
		
		/** Display the view
		*/
		render: function() {

			var self = this;
			self.renderFormComponents().always(function(){
				self.renderAdvancedSelectBoxes();
				self.updateDoms();
				$(self.el).find('.make-switch').bootstrapSwitch();
				$(self.el).find('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });
			});
		},
		
		/**
		 * Save data into backend, use special behavior of method 'saveToBackebnd' to work fine with OpenERP 
		 */
		
		saveForm: function(e){
			e.preventDefault();
			return this.model.saveToBackend().fail(function(e){
				console.log(e);
			});
		},
		
		/**
		 * Initialize model, fetch its data (if id is set on url) and perform a HEAD request to have fields definitions
		 */
		initModel: function(){
			var arrayDeferred = [];
			//if needed, initialize model
			if(_.isUndefined(this.model)){
				//Create instance of the model, and if set, link it with "this.parentModel" 
				if(_.isUndefined(this.options.id)){
					this.model = new this.modelName({}, {parentModel: this.parentModel});
				}
				else{
					this.model = new this.modelName({id:this.options.id}, {parentModel: this.parentModel});
				}
			}
			if(!this.model.isNew()){
				arrayDeferred.push(this.model.fetch());
			}
			//if needed, initialize collection of the model
			if(_.isUndefined(this.model.collection)){
				this.model.collection = new this.collectionName();
			}
			//perform a head request to retrieve metadaFields
			arrayDeferred.push(this.model.collection.count());
			return $.when.apply($, arrayDeferred);
		}
	});
	return GenericFormView;
});