/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',
		'contractLineModel',
		'contractLinesCollection',
		
		'genericFormView',
		'advancedSelectBoxView',
		
		'moment',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'
		

], function (app, AppHelpers, ContractLineModel, ContractLinesCollection, GenericFormView, AdvancedSelectBoxView, moment) {

	'use strict';

	/******************************************
	* Contract Form View
	*/
	var FormContractLineView = GenericFormView.extend({
		id: function(){
			return arguments[0] ? arguments[0].id : '';
		},
		tagName: 'div',
		className	: 'tab-pane fade in active',
		templateHTML: '/templates/forms/form_contract_line.html',
		collectionName: ContractLinesCollection,
		modelName: ContractLineModel,
		
		// The DOM events //
		events: function(){
			return _.defaults({
				
			}, GenericFormView.prototype.events);
		},
		
		/** View Initialization
		*/
		initialize : function() {
			this.off();
			this.options = arguments[0];
			//TODO: find a better way to do that, problem is that options.id is already used by BackboneView to initialize this.el 
			this.options.id = this.options.modelId;
			GenericFormView.prototype.initialize.apply(this, arguments);
		},
		
		/** Display the view
		*/
		render: function() {

			var pageTitle = '';
			if(_.isNull(this.model.getId())) {
				pageTitle = app.lang.patrimoine.viewsTitles.newContractLine;
			}
			else{
				pageTitle = app.lang.patrimoine.viewsTitles.contractLineDetails;
			}

			var self = this;
			// Retrieve the template //
			$.get(app.menus.openpatrimoine + this.templateHTML, function(templateData){
				//compute dates with user TZ

				var template = _.template(templateData, {
					lang		: app.lang,
					pageTitle	: pageTitle,
					readonly	: false,
					moment		: moment,
					lineModel	: self.model,
					user		: app.current_user
				});

				$(self.el).html(template);
				GenericFormView.prototype.render.apply(self);

			});
			return this;
		},
		
	});
	return FormContractLineView;
});