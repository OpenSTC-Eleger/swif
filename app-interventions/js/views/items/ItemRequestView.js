/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'requestModel',
	'modalRequestView',
	'modalValidRequestView',
	'modalRefuseRequestView',
	'modalConfirmRequestView'


], function(app, AppHelpers, RequestModel, ModalRequestView, ModalValidRequestView, ModalRefuseRequestView, ModalConfirmRequestView){

	'use strict';

	/******************************************
	* Row Request View
	*/
	var ItemRequestView = Backbone.View.extend({

		tagName     : 'tr',

		className   : function(){

			var classRow;
			if(this.model.getState() == RequestModel.status.wait.key && app.current_user.isManager() && _.contains(app.current_user.getServices(), this.model.getService('id'))) {
				classRow = RequestModel.status.wait.color + ' bolder';
				return classRow;
			}
			else if(this.model.getState() == RequestModel.status.to_confirm.key && app.current_user.isDST()){
				classRow = RequestModel.status.to_confirm.color + ' bolder';
				return classRow;
			}

		},

		templateHTML : '/templates/items/itemRequest.html',


		// The DOM events //
		events       : {
			'click .buttonValidRequest'  : 'modalValidRequest',
			'click .buttonRefusedRequest': 'modalRefuseRequest',
			'click .buttonConfirmRequest': 'modalConfirmRequest',
			'click .requestDetails'      : 'displayModalUpdateRequest',
		},



		/** View Initialization
		*/
		initialize : function() {
			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);
		},



		/** When the model ara updated //
		*/
		change: function(model){
			var self = this;

			this.render();

			// Highlight the Row and recalculate the className //
			AppHelpers.highlight($(this.el)).done(function(){
				self.$el.attr('class', _.result(self, 'className'));
			});


			// Set the info message for the notification //
			var infoMessage;
			switch(model.getState()){
				case RequestModel.status.refused.key: 
					var infoMessage = app.lang.infoMessages.requestRefuseOk;
				break;
				case RequestModel.status.to_confirm.key:
					var infoMessage = app.lang.infoMessages.requestConfirmOk;
				break;
				case RequestModel.status.valid.key:
					infoMessage = app.lang.infoMessages.requestValidOk;
					break;
				default:
					infoMessage = app.lang.infoMessages.requestUpdateOk;
			}


			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+infoMessage);

			// Partial Render //
			app.views.requestsListView.partialRender();
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang        : app.lang,
					request     : self.model,
					user        : app.current_user,
					RequestModel: RequestModel
				});

				$(self.el).html(template);

				// Set the Tooltip / Popover //
				$('*[data-toggle="tooltip"]').tooltip();
				$('*[data-toggle="popover"]').popover({trigger: 'hover'});
			});

			return this;
		},



		/** Display Modal form to valid an Intervention Request
		*/
		modalValidRequest: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalValidRequestView = new ModalValidRequestView({
				el      : '#modalRequest',
				model   : this.model
			});
		},



		/** Display Modal form to Refuse an Intervention Request
		*/
		modalRefuseRequest: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalRefuseRequestView = new ModalRefuseRequestView({
				el      : '#modalRequest',
				model   : this.model
			});
		},



		/** Display Modal form to Confirm an Intervention Request
		*/
		modalConfirmRequest: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalConfirmRequestView = new ModalConfirmRequestView({
				el      : '#modalRequest',
				model   : this.model
			});
		},

		displayModalUpdateRequest: function(e){

			console.log(this.model);

			e.preventDefault();
			new ModalRequestView({el:'#modalRequest', requests: app.views.requestsListView.collection, model: this.model});

		},


		/** Highlight the row item
		*/
		highlight: function(){
			var self = this;

			$(this.el).addClass('highlight');

			var deferred = $.Deferred();

			// Once the CSS3 animation are end the class are removed //
			$(this.el).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
				function() {
					$(self.el).removeClass('highlight');
					deferred.resolve();
				}
			);

			return deferred;
		}


	});

	return ItemRequestView;

});