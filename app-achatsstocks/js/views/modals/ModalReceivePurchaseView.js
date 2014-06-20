/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',
		'partialPickingModel',
		'partialPickingLineModel',
		
		'partialPickingsCollection',
		'partialPickingLinesCollection',
		
		'genericFormView',
		'genericFormModalView'
		

], function (app, AppHelpers, PartialPickingModel, PartialPickingLineModel, PartialPickingsCollection, PartialPickingLinesCollection, GenericFormView, GenericFormModalView) {

	'use strict';

	/******************************************
	* Contract Form View
	*/
	return GenericFormModalView.extend({
		
		// The DOM events //
		events: function(){
			return _.defaults({
				
			}, _.result(GenericFormModalView.prototype,'events'));
		},
		
		/** View Initialization
		*/
		initialize : function() {
			this.modal = $(this.el);
			this.title = '';
			var params = {
				collectionName: PartialPickingsCollection,
				modelName     : PartialPickingModel,
				templateForm  : app.menus.openstcachatstock + '/templates/modals/modalReceivePurchase.html',
				el            : '#modalView',
				title         : this.title
			};
			
			GenericFormModalView.prototype.initialize.apply(this, [params]);
			this.attached_views.wizard_id = {};
		},
		
		addLine: function(id, templateHTML){
			var params = {
					tagName       : 'tr',
					className     : 'o2m-line',
					parentModel   : this.model, 
					notMainView   :true, id:id, 
					templateHTML  :templateHTML,
					autoRender    : true,
					modelName     : PartialPickingLineModel,
					collectionName: PartialPickingLinesCollection};
			
			var view = new GenericFormView(params);
			this.attached_views.wizard_id[view.cid] = view;
			$('#lines').append(view.$el);
		},
		
		/** Trigger when the modal is show
		 * Override to be able to parse the swif-list-o2m
		*/
		shown: function(){
			var self = this;
			GenericFormModalView.prototype.shown.apply(this);
			$('.swif-list-o2m').each(function(){
				var field = $(this).data('field-name');
				var templateLineHTML = $(this).data('list-template');
				_.each(self.model.getAttribute(field, []), function(lineId){
					self.addLine(lineId, templateLineHTML);
				});
			});
		},
		
		/**
		 * When partial picking is updated, perform it on the backend
		 */
		saved: function(){
			var self = this;
			var deferred = $.Deferred();
			$.post(_.result(this.model, 'url') + '/perform', function(){
				self.trigger('shipped');
				deferred.resolve();
			});
			return deferred;
		},
		
	});
});