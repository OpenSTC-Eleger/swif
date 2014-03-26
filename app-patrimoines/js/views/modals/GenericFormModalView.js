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
		

], function (app, AppHelpers, ContractModel, ContractsCollection, GenericFormView, moment) {

	'use strict';

	/******************************************
	* Contract Form View
	*/
	var GenericFormModalView = GenericFormView.extend({

		id          : 'modalView',
		templateHTML: '/templates/modals/generic_form_modal.html',
		collectionName: ContractsCollection,
		modelName: ContractModel,
		
		// The DOM events //
		events: function(){
			return _.defaults({
				'show.bs.modal'					: 'show',
				'shown.bs.modal'				: 'shown',
				'hidde.bs.modal'				: 'hide',
				'hidden.bs.modal'				: 'hidden',
				'submit #formModalSaveModel'	: 'save',
			}, GenericFormView.prototype.events);
		},
		
		modal : null,

		/** Trigger when the modal is show
		*/
		show: function(){
			this.delegateEvents(this.events());
		},

		/** Trigger when the modal is hidden
		*/
		hidden: function(){
			this.undelegateEvents(this.events());
		},

		/** Trigger when the modal is shown
		*/
		shown: function(){
			// Set the focus to the first input of the form if elFocus is undefined //
			if(_.isUndefined(this.options.elFocus)){
				this.modal.find('input, textarea').first().focus();
			}
			else{
				if($('#'+this.options.elFocus).hasClass('select2')){
					$('#'+this.options.elFocus).select2('open');
				}
				else{
					this.modal.find('#'+this.options.elFocus).focus();
				}
			}
		},
		
		/** View Initialization
		*/
		initialize : function() {
			this.modal = $(this.el);
			this.sourceModel = this.model;
			this.model = this.sourceModel.clone();
			this.model.off();
			this.action = arguments ? arguments[0].action : null;
			GenericFormView.prototype.initialize.apply(this, arguments);
		},
		
		/** Display the view
		*/
		render: function() {

			var self = this;
			// Retrieve the template //
			$.get(app.menus.openpatrimoine + this.templateHTML, function(templateData){
				//compute dates with user TZ

				var template = _.template(templateData, {
					lang		: app.lang,
					readonly	: false,
					moment		: moment,
					user		: app.current_user,
					action		: self.action
				});

				$(self.el).html(template);
				GenericFormView.prototype.render.apply(self);
				
				self.modal.modal('show');
			});
			return this;
		},
		
		save: function(e){
			var self = this;
			e.preventDefault();
			var vals = {wkf_evolve:this.action};
			this.model.save(vals, {patch:true,wait:true}).done(function(){
				self.sourceModel.fetch();
				self.modal.modal('hide');
			});
		},
		
	});
	return GenericFormModalView;
});