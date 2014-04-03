/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',
		'contractModel',
		'contractsCollection',
		
		'genericFormView',
		'advancedSelectBoxView',
		
		'moment',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'
		

], function (app, AppHelpers, ContractModel, ContractsCollection, GenericFormView, AdvancedSelectBoxView, moment) {

	'use strict';

	/******************************************
	* Contract Form View
	*/
	var FormContractGeneralView = GenericFormView.extend({

		el          : '#general_infos',
		tagName		: 'div',
		templateHTML: '/templates/forms/form_contract_general.html',
		collectionName: ContractsCollection,
		modelName: ContractModel,
		
		// The DOM events //
		events: function(){
			return _.defaults({
				
			}, GenericFormView.prototype.events);
		},
		
		/** View Initialization
		*/
		initialize : function() {
			this.domains = {
				supplier_id: [ {field:'supplier',operator:'=',value:true} ],
				technical_service_id: [ {field:'technical',operator:'=',value:true} ]
			};
			GenericFormView.prototype.initialize.apply(this, arguments);
		},
		
		/** Display the view
		*/
		render: function() {

			var self = this;
			// Retrieve the template //
			$.get(app.menus.openstcpatrimoine + this.templateHTML, function(templateData){
				//compute dates with user TZ

				var template = _.template(templateData, {
					lang		: app.lang,
					readonly	: false,
					moment		: moment,
					user		: app.current_user
				});

				$(self.el).html(template);
				GenericFormView.prototype.render.apply(self);
				
				$(this.el).hide().fadeIn('slow');
			});
			return this;
		},
		
	});
	return FormContractGeneralView;
});