/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',
		
		'genericFormView',
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
	return GenericFormView.extend({

		id          : 'modalView',
		templateHTML: 'templates/modals/genericFormModal.html',
		
		
		// The DOM events //
		events: function(){
			return _.defaults({
				'show.bs.modal'					: 'show',
				'shown.bs.modal'				: 'shown',
				//'hidde.bs.modal'				: 'hide',
				'hidden.bs.modal'				: 'hidden',
				'submit #formModalSaveModel'	: 'save',
				'click [data-action="zenmode"]': 'toggleZenmode'
			}, GenericFormView.prototype.events);
		},
		
		modal : null,

		/** Trigger when the modal is show
		*/
		show: function(){
			this.delegateEvents();
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
			
			this.templateForm = arguments ? arguments[0].templateForm : 'no_template_supplied';
			this.title = arguments ? arguments[0].title : 'no_template_supplied';
			this.collection = arguments ? arguments[0].collection : null;
			this.modelName = arguments ? arguments[0].modelName : null;
			
			if(_.isUndefined(this.model)){
				this.model = new this.modelName();
				this.model.collection = this.collection;
				this.sourceModel = this.model;
			}
			else{
				this.sourceModel = this.model;
				this.model = this.sourceModel.clone();
				this.model.collection = this.sourceModel.collection;
				this.model.off();
			}
			
			arguments[0].notMainView = true;
			GenericFormView.prototype.initialize.apply(this, arguments);
		},
		
		/** Display the view
		*/
		render: function() {

			var self = this;
			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){
				//compute dates with user TZ

				var template = _.template(templateData, {
					lang		: app.lang,
					readonly	: false,
					moment		: moment,
					title		: self.title,
					user		: app.current_user,
					model		: self.model
				});

				$(self.el).html(template);
				$.get(self.templateForm, function(templateData2){
					var template2 = _.template(templateData2, {
						lang		: app.lang,
						readonly	: false,
						moment		: moment,
						user		: app.current_user,
						model		: self.model
					});
					$(self.el).find('#formModalSaveModel').html(template2);
					GenericFormView.prototype.render.apply(self);
				});
				
				self.modal.modal('show');
			});
			return this;
		},
		
		save: function(e){
			var self = this;
			e.preventDefault();
			var addToCollection = this.model.isNew();
			this.model.saveToBackend().done(function(){
				self.sourceModel.fetch().done(function(){
					if(addToCollection){
						self.model.collection.add(self.model);
					}
				});
				self.modal.modal('hide');
			});
		},
		/** Toggle fullscreen mode
		*/
		toggleZenmode: function(){

			$(this.el).find('.modal-dialog').toggleClass('modal-zenmode');
			$('.modal-backdrop').toggleClass('zenmode');
		}
		
	});
});