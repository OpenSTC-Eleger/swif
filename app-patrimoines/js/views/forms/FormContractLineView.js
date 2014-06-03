/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',
		'contractLineModel',
		'itemRecurrenceContractModel',
		'contractLinesCollection',
		'itemRecurrenceContractCollection',
		
		'genericFormView',
		'formItemRecurrenceView',
		'advancedSelectBoxView',
		
		'moment',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'
		

], function (app, AppHelpers, ContractLineModel, ItemRecurrenceContractModel, ContractLinesCollection, ItemRecurrenceContractCollection, GenericFormView, FormItemRecurrenceView, AdvancedSelectBoxView, moment) {

	'use strict';

	/******************************************
	* Contract Form View
	*/
	var FormContractLineView = GenericFormView.extend({
		id: function(){
			return arguments[0] ? arguments[0].id : '';
		},
		tagName: 'div',
		className	: 'tab-pane fade',
		templateHTML: '/templates/forms/form_contract_line.html',
		templateRecurrenceHTML: '/templates/forms/form_recurrence.html',
		collectionName: ContractLinesCollection,
		modelName: ContractLineModel,
		
		// The DOM events //
		events: function(){
			return _.defaults({
				'blur #name'	:	'changeTabName',
				'click .button-get-dates': 'fetchDates',
			}, GenericFormView.prototype.events);
		},
		
		/** View Initialization
		*/
		initialize : function() {
			this.off();
			var self = this;
			this.options = arguments[0];
			//TODO: find a better way to do that, problem is that options.id is already used by BackboneView to initialize this.el 
			this.options.id = this.options.modelId;
			this.readonly = this.options.readonly;
			this.taskCollection = new ItemRecurrenceContractCollection();
			this.listenTo(self.taskCollection, 'remove', this.removeOccurrence);
			GenericFormView.prototype.initialize.apply(this, arguments).done(function(){
				self.listenTo(self.model, 'recurrence', self.updateOccurrences);
			});
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
			$.get(app.menus.openstcpatrimoine + this.templateHTML, function(templateData){
				//compute dates with user TZ

				var template = _.template(templateData, {
					lang		: app.lang,
					pageTitle	: pageTitle,
					readonly	: self.readonly,
					moment		: moment,
					lineModel	: self.model,
					user		: app.current_user
				});

				$(self.el).html(template);
				$.get(app.menus.openstcpatrimoine + self.templateRecurrenceHTML, function(templateDataRecurrence){
					var templateRecurrence = _.template(templateDataRecurrence, {
						recurrence		: self.model,
						lang			: app.lang
					});
					$(self.el).find('#recurrenceForm').html(templateRecurrence);
					GenericFormView.prototype.render.apply(self);
					
					var task_ids = self.model.getAttribute('occurrence_ids',[]);
					if(task_ids.length > 0){
						self.populateTableWithIds(task_ids);
					}
				});
			});
			return this;
		},
		
		/**
		 * Perform a call to backend to save a temp Model on server, and fetch the dates computed with the recurrence setting
		 */
		fetchDates: function(e){
			e.preventDefault();
			$(this.el).find('.tasks-items').empty();
			this.model.fetchDates();
		},
		
		/**
		 * Triggered from RecurrenceModel, taskValues is an array of JSON values
		 */
		updateOccurrences: function(taskValues){
			this.taskCollection.reset();
			this.populateTableWithoutIds(taskValues);
		},
		
		/**
		 * called when an occurrence is deleted by user, this deletion is yet sent to server, but visually, component must be removed
		 */
		removeOccurrence: function(model){
			this.model.removeOccurrence(model);
		},
		
		/**
		 * Create one FormItemRecurrenceView per task to display
		 */
		populateTableWithoutIds: function(taskValues){
			var self = this;
			//I call .count() method to fetch fields-metadata
			this.taskCollection.count().done(function(){
				_.each(taskValues, function(task){
					var taskModel = new ItemRecurrenceContractModel(task);
					self.taskCollection.add(taskModel);
					var taskView = new FormItemRecurrenceView({model:taskModel});
					$(self.el).find('.tasks-items').append(taskView.el);
				});
			});
		},
		
		populateTableWithIds: function(task_ids){
			var self = this;
			this.taskCollection.fetch({data: {filters: {1: {field:'id', operator:'in', value:task_ids}}}}).done(function(){
				self.taskCollection.each(function(task){
					var taskView = new FormItemRecurrenceView({model:task});
					$(self.el).find('.tasks-items').append(taskView.el);
				});
			});
		},
		
		changeTabName: function(){
			//Do not prevent the event here, it's used by GenericForm to update model
			$('a[href="#' + this.$el.attr('id') + '"] .title').html(this.model.getAttribute('name',''));
		},
		
		/**
		 * Override basic behavior to save tasks to backend 
		 * (already saved Task are not modified, deleted Tasks are already managed by RecurrenceModel when user clicked on 'remove' action)
		 */
		saveForm: function(){
			var self = this;
			this.taskCollection.each(function(taskModel){
				self.model.addOccurrence(taskModel);
			});
			return GenericFormView.prototype.saveForm.apply(this, arguments);
		},
	});
	return FormContractLineView;
});