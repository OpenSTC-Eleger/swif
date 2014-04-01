/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'taskModel',
	'genericItemView',



], function(app, AppHelpers, TaskModel, GenericItemView){

	'use strict';

	return GenericItemView.extend({

		tagName      : 'tr',

		className    : 'row-item',

		templateHTML : '/templates/modals/interventions/modalTaskRecurrenceItem.html',
		
		classModel	: TaskModel,
		
		// The DOM events //
		events: {
			
		},
		
		/** View Initialization
		*/
		initialize: function (params) {
			this.options = params;

			this.model.off();
			
			GenericItemView.prototype.initialize.apply(this, params);
			this.render();
		},

		/** Display the view
		*/
		render : function() {
			var self = this;
			// Retrieve the template //
			var stateItem = TaskModel.status[this.model.getAttribute('state','draft')];
			$.get(app.menus.openstc + this.templateHTML, function(templateData){
								
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
		
	});
});