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
	var FormContractView = GenericFormView.extend({

		el          : '#rowContainer',

		templateHTML: '/templates/forms/form_contract.html',
		collectionName: ContractsCollection,
		modelName: ContractModel,
		
		// The DOM events //
		events: function(){
			return _.defaults({
				'click #addLine'            : 'actionAddLine',
			},
			GenericFormView.prototype.events
			);
		},
		
		/** View Initialization
		*/
		initialize : function() {
			GenericFormView.prototype.initialize.apply(this, arguments);
		},
		
		/** Display the view
		*/
		render: function() {

			var pageTitle = '';
			if(_.isNull(this.model.getId())) {
				pageTitle = app.lang.patrimoine.viewsTitles.newContract;
			}
			else{
				pageTitle = app.lang.patrimoine.viewsTitles.contractDetails +' N° '+ this.model.getId();
			}
			// Change the page title //
			app.router.setPageTitle(pageTitle);

			var self = this;
			// Retrieve the template //
			$.get(app.menus.openpatrimoine + this.templateHTML, function(templateData){
				//compute dates with user TZ

				var template = _.template(templateData, {
					lang		: app.lang,
					pageTitle	: pageTitle,
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
		
		actionAddLine: function(e){
			e.preventDefault();
			this.addLine(null);
		},
		
		/**
		 * For each contractLine on the model, add a ContractLineView.
		 * It creates an entry on the nav-tabs for each line 
		 */
		addLine: function(id){
			var self = this;
			var idString = id ? '_' + id.toString() : '';
			var html = '<li><a class="lineHeader" data-toggle="tab" href="#task' + idString + '">Tâche </li>';
			$(self.el).find('#linesHeader li:last').hide().fadeIn('slow').before(html);
			$('.lineHeader').tab('show');
		}
	});
	return FormContractView;
});