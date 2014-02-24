/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'absentTypeModel',
	'modalAbsentTypeView',
	'modalDeleteView'


], function(app, AppHelpers, AbsentTypeModel, ModalAbsentTypeView, ModalDeleteView){

	'use strict';



	/******************************************
	* Row Absent Type View
	*/
	var itemAbsentTypeView = Backbone.View.extend({

		tagName      : 'tr',

		className    : 'row-item',

		templateHTML : '/templates/items/itemAbsentType.html',


		// The DOM events //
		events: {
			'click'                         : 'modalUpdateAbsentType',
			'click a.modalDeleteAbsentType' : 'modalDeleteAbsentType'
		},



		/** View Initialization
		*/
		initialize: function (params) {
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
				app.views.absentTypesListView.partialRender();
			});

			app.notify('', 'success', app.lang.infoMessages.information, e.getName()+' : '+app.lang.infoMessages.absentTypeDeleteOk);
		},



		/** Display the view
		*/
		render : function() {
			var self = this;

			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang        : app.lang,
					absentType  : self.model
				});

				$(self.el).html(template);

				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();

			});

			return this;
		},



		/** Display Modal form to add/sav a new Absent type
		*/
		modalUpdateAbsentType: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalAbsentTypeView = new ModalAbsentTypeView({
				el      : '#modalSaveAbsentType',
				model   : this.model,
				elFocus : $(e.target).data('form-id')
			});
		},



		/** Modal to remove an Absent Type
		*/
		modalDeleteAbsentType: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalDeleteView = new ModalDeleteView({
				el           : '#modalDeleteAbsentType',
				model        : this.model,
				modalTitle   : app.lang.viewsTitles.deleteAbsentType,
				modalConfirm : app.lang.warningMessages.confirmDeleteAbsentType
			});
		},

	});

	return itemAbsentTypeView;

});