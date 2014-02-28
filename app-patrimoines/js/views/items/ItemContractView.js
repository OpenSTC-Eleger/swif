/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	
	'moment'


], function(app, AppHelpers, moment){

	'use strict';

	return Backbone.View.extend({

		tagName      : 'tr',

		className    : 'row-item',

		templateHTML : '/templates/items/itemContract.html',

		// The DOM events //
		events: {

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

			// Retrieve the template //
			$.get(app.menus.openpatrimoine+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang        : app.lang,
					contract  : self.model
				});

				$(self.el).html(template);
				self.renderFieldsValues();

				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();

			});

			return this;
		},



		/** Display Modal form to add/sav a new Absent type
		*/
//		modalUpdateAbsentType: function(e){
//			e.preventDefault();
//			e.stopPropagation();
//
//			app.views.modalAbsentTypeView = new ModalAbsentTypeView({
//				el      : '#modalSaveAbsentType',
//				model   : this.model,
//				elFocus : $(e.target).data('form-id')
//			});
//		},
//
//
//
//		/** Modal to remove an Absent Type
//		*/
//		modalDeleteAbsentType: function(e){
//			e.preventDefault();
//			e.stopPropagation();
//
//			app.views.modalDeleteView = new ModalDeleteView({
//				el           : '#modalDeleteAbsentType',
//				model        : this.model,
//				modalTitle   : app.lang.viewsTitles.deleteAbsentType,
//				modalConfirm : app.lang.warningMessages.confirmDeleteAbsentType
//			});
//		},

	});
});