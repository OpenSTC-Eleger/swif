/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',

		'genericFormView',
		'advancedSelectBoxView',

		'moment',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'


], function (app, AppHelpers, GenericFormView, moment) {

	'use strict';

	/******************************************
	* Contract Form View
	*/
	var GenericActionModalView = GenericFormView.extend({

		id          : 'modalView',
		templateHTML: 'templates/modals/genericActionModal.html',

		// The DOM events //
		events: function(){
			return _.defaults({
				'show.bs.modal'					: 'show',
				'shown.bs.modal'				: 'shown',
				'hidde.bs.modal'				: 'hide',
				'hidden.bs.modal'				: 'hidden',
				'submit #formModalSaveModel'	: 'save',
				'click [data-action="zenmode"]': 'toggleZenmode'
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
			this.model.collection = this.sourceModel.collection;
			this.model.off();

			this.action = arguments ? arguments[0].action : null;
			this.langAction = arguments ? arguments[0].langAction : null;
			this.templateForm = arguments ? arguments[0].templateForm : null;

			arguments[0].notMainView = true;
			GenericFormView.prototype.initialize.apply(this, arguments);
		},

		/** Display the view
		*/
		render: function() {
			var self = this;
			var hasForm = false;
			var arrayDeferred =  [$.ajax(this.templateHTML)];
			if(this.templateForm){
				arrayDeferred.push($.ajax(this.templateForm));
				hasForm = true;
			}
			// Retrieve the template //
			$.when.apply($,arrayDeferred).done(function(templateData, templateData2){

				var template = _.template(hasForm ? templateData[0] : templateData, {
					lang		: app.lang,
					langAction	: self.langAction,
					readonly	: false,
					moment		: moment,
					user		: app.current_user,
					action		: self.action,
					model		: self.model
				});

				$(self.el).html(template);
				if(hasForm){
					var template2 = _.template(templateData2[0], {
						lang		: app.lang,
						readonly	: false,
						moment		: moment,
						user		: app.current_user,
						model		: self.model
					});
					$(self.el).find('#formModalSaveModel').html(template2);
				}
				GenericFormView.prototype.render.apply(self);

				self.modal.modal('show');
			});
			return this;
		},

		save: function(e){
			var self = this;
			e.preventDefault();
			var toSave = _.keys(this.model.changedAttributes());
			var vals = this.model.getSaveVals(toSave);
			vals.wkf_evolve = this.action;
			this.model.save(vals, {patch:true,wait:true}).done(function(){
				self.sourceModel.fetch();
				self.modal.modal('hide');
				self.trigger('sendForm');
			});
		},

		/** Toggle fullscreen mode
		*/
		toggleZenmode: function(){

			$(this.el).find('.modal-dialog').toggleClass('modal-zenmode');
			$('.modal-backdrop').toggleClass('zenmode');
		}

	});
	return GenericActionModalView;
});