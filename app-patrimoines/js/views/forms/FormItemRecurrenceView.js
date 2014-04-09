/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'itemRecurrenceContractModel',
	'genericItemView',



], function(app, AppHelpers, ItemRecurrenceContractModel, GenericItemView){

	'use strict';

	return GenericItemView.extend({

		tagName      : 'tr',

		className    : 'row-item',

		templateHTML : '/templates/forms/form_item_recurrence.html',
		
		classModel	: ItemRecurrenceContractModel,
		
		// The DOM events //
		events: {
			'click .actionDelete': 'performDelete',
		},
		
		/** View Initialization
		*/
		initialize: function (params) {
			this.options = params;
			if(!this.model){
				this.model = new ItemRecurrenceContractModel();
			}
			this.model.off();
			
			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);
			// When the model are destroy //
			this.listenTo(this.model,'destroy', this.destroy);
			
			GenericItemView.prototype.initialize.apply(this, params);
			this.render();
		},
		
		/** When the model is updated //
		*/
		change: function(){

			//this.render();
			//AppHelpers.highlight($(this.el));
			//app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.absentTypeUpdateOk);
		},



		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;

			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				
			});

			app.notify('', 'success', app.lang.infoMessages.information, e.getName()+' : '+app.lang.infoMessages.taskDeleteOk);
		},

		/** Display the view
		*/
		render : function() {
			var self = this;
			// Retrieve the template //
			var stateItem = ItemRecurrenceContractModel.status[this.model.getAttribute('state','draft')];
			$.get(app.menus.openstcpatrimoine+this.templateHTML, function(templateData){
								
				var template = _.template(templateData, {
					lang        : app.lang,
					task		: self.model,
					stateItem	: stateItem
				});
				$(self.el).html(template);
				GenericItemView.prototype.render.apply(self);

			});

			return this;
		},
		
		performDelete: function(e){
			e.preventDefault();
			this.model.destroy();
		},
		
	});
});