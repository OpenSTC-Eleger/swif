/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'contractModel',
	'formContractView',
	
	'moment'


], function(app, AppHelpers, ContractModel, FormContractView, moment){

	'use strict';

	return Backbone.View.extend({

		tagName      : 'tr',

		className    : 'row-item',

		templateHTML : '/templates/items/itemContract.html',
		templateSmallActionHTML : '/templates/others/templateSmallActionComponent.html',
		templateButtonActionHTML : '/templates/others/templateButtonActionComponent.html',
		
		classModel	: ContractModel,
		
		// The DOM events //
		events: {

		},
		
		/**
		 * Method used by template to display actions on the view.
		 * if action not present in model.actions, display nothing, else, display the component
		 */
		renderSmallActions: function(dom){
			if(dom){
				var actions = dom.attr('data-actions').split(',');
				var ret = '';
				var self = this;
				return $.when($.get(app.menus.openpatrimoine+this.templateSmallActionHTML)).done(function(smallActionTemplate){
					_.each(actions, function(action){
						
						if(_.contains(self.authorizedActions, action)){
							if(_.has(self.classModel.actions,action)){
								var modelAction = self.classModel.actions[action];
								ret += _.template(smallActionTemplate,{action:modelAction});
							}
							else{
								console.warning('Error, action "' + action + '" not present in model definition, please implement it in actions model attribute');
							}
						}
					});
					dom.html(ret);
				});
			}
		},
		
		/**
		 * Method used by template to display button actions (right side) on the view.
		 * if action not present in model.actions, display nothing, else, display the component
		 */
		renderButtonAction: function(dom){
			var ret = '';
			var self = this;
			function getActionDefinition(action){
				var value = null;
				if(_.contains(self.authorizedActions, action)){
					if(_.has(self.classModel.actions, action)){
						value = self.classModel.actions[action];
					}
					else{
						console.warning('Error, action "' + action + '" not present in model definition, please implement it in actions model attribute');
					}
				}
				return value;
			}
			
			if(dom){
				var actions = dom.attr('data-actions').split(',');
				var mainAction = dom.attr('data-main-action');
				
				return $.when($.get(app.menus.openpatrimoine+this.templateButtonActionHTML)).done(function(buttonActionTemplate){
					if(mainAction){
						//if mainAction present in actions authorized to user, render the component, else, do nothing
						var modelMainAction = getActionDefinition(mainAction);
						if(modelMainAction){
							actions = _.without(actions, mainAction);
							//retrieve other actions authorized to user and render them in the component
							var modelOtherActions = [];
							_.each(actions, function(action){
								var elt = getActionDefinition(action);
								if(elt){
									modelOtherActions.push(elt);
								}
							});
							ret = _.template(buttonActionTemplate, {
								mainAction:modelMainAction,
								otherActions: modelOtherActions
							});
						}
					}
					dom.html(ret);
				});
			}
		},
		
		toFrDate: function(date){
			var value = moment.utc(date);
			return value.format('DD/MM/YYYY');
		},
		
		toFrDatetime: function(datetime){
			var value = AppHelpers.convertDateToTz(datetime);
			return value.format('DD/MM/YYYY hh[h]mm');
		},
		
		integerToStr: function(integer){
			return integer.toString();
		},
		
		/**
		 * render data using data-fieldname and self.fieldsModel to know how to display value
		 */
		renderFieldsValues: function(){
			var self = this;
			$(this.el).find('.field').each(function(){
				var field = $(this).data('fieldname');
				if(_.has(self.model.collection.fieldsMetadata,field)){
					var elt = self.model.collection.fieldsMetadata[field];
					if(_.has(self.fieldParser,elt.type)){
						var value = self.fieldParser[elt.type](self.model.getAttribute(field,''));
						$(this).html(value);
					}
					else{
						console.warn('Swif Error: Unrecognized field type "' + elt.type.toString() + '", authorized values are : "' + _.keys(self.fieldParser));
					}
				}
				else{
					console.warn('Swif Error: "' + field + '" not present on Collection, authorized values are : "' + _.keys(self.model.collection.fieldsMetadata));
				}
			});
		},
		
		
		/** View Initialization
		*/
		initialize: function (params) {
			this.fieldParser = {
				date		: this.toFrDate,
				datetime	: this.toFrDatetime,
				char		: _.capitalize,
				text		: _.capitalize,
				integer		: this.integerToStr
			};
			
			this.options = params;

			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);

			// When the model are destroy //
			this.listenTo(this.model,'destroy', this.destroy);
		},
		
		/** When the model is updated //
		*/
		change: function(){

			this.render();
			AppHelpers.highlight($(this.el));
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.absentTypeUpdateOk);
		},



		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;

			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				app.views.ContractsListView.partialRender();
			});

			app.notify('', 'success', app.lang.infoMessages.information, e.getName()+' : '+app.lang.infoMessages.absentTypeDeleteOk);
		},



		/** Display the view
		*/
		render : function() {
			var self = this;
			var formUrl = FormContractView.prototype.urlBuilder(this.model.getId());
			// Retrieve the template //
			$.get(app.menus.openpatrimoine+this.templateHTML, function(templateData){
				
				if(_.isUndefined(self.actions)){self.authorizedActions = self.model.getAttribute('actions',[]);}
				
				var template = _.template(templateData, {
					lang        : app.lang,
					contract  : self.model,
					mainAction: self.model.getUserActions().mainAction,
					otherActions: self.model.getUserActions().otherActions,
					formUrl		: formUrl
				});
				$(self.el).html(template);
				self.renderFieldsValues();
				$.when(self.renderButtonAction($(self.el).find('.button-actions')),
						self.renderSmallActions($(self.el).find('.small-actions'))).always(function(){
					// Set the Tooltip //
					$('*[data-toggle="tooltip"]').tooltip();
				});

			});

			return this;
		},

	});
});