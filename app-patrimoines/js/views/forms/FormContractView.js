/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',
		'contractModel',
		'contractsCollection',
		
		'formContractGeneralView',
		'formContractLineView',
		
		'moment',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'
		

], function (app, AppHelpers, ContractModel, ContractsCollection, FormContractGeneralView, FormContractLineView, moment){

	'use strict';

	/******************************************
	* Contract Form View
	*/
	var FormContractView = Backbone.View.extend({

		el          : '#rowContainer',

		templateHTML: '/templates/forms/form_contract.html',

		// The DOM events //
		events: {
			'click #addLine'				: 'actionAddLine',
			'click .removeLineHeader'		: 'actionRemoveLine',
			'submit #formSaveModel'			: 'savePostForm',
			'click #saveDraftFormContract'	: 'saveDraftForm',
			'click #updateDraftForm'		: 'setDraftForm'
		},
		
		/** View Initialization
		*/
		initialize: function(){
			this.cptTasks = 0;
			var self = this;
			this.options = arguments[0];
			this.generalView = null;
			this.linesViews = {};
			this.initModel().done(function(){
				app.router.render(self);
			});
		},
		
		/**
		 *@param id: id of Booking to route to
		 *@return: url to call to go to specified Booking (or to create new Booking if id is not set)
		*/
		urlBuilder: function(id){
			var url = _.strLeft(app.routes.contrat.url, '(');
			var params = '';
			if(!_.isUndefined(id)){
				params = 'id/' + id.toString();
			}
			if(params){
				url = _.join('/', url, params);
			}
			return '#' + url;
		},
		
		renderTabs: function(){
			$('#lines .tab-pane').last().addClass('in active');
			$('.lineHeader:last').tab('show');
			$('.removeLineHeader').remove();
			$('.lineHeader').each(function(){
				$(this).append('<a class="removeLineHeader" href="#" data-view="' + $(this).attr('href').replace('#','') + '"><b> &times; </b></a>');
			});
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
			$.get(app.menus.openstcpatrimoine + this.templateHTML, function(templateData){
				//compute dates with user TZ

				var template = _.template(templateData, {
					lang		: app.lang,
					pageTitle	: pageTitle,
					readonly	: false,
					moment		: moment,
					contract	: self.model,
					user		: app.current_user
				});

				$(self.el).html(template);
				$(self.el).hide().fadeIn('slow');
				
				//Render General Infos View and lineViews, if lines are presents in the model
				self.formGeneralView = new FormContractGeneralView({model: self.model, notMainView: true});
				_.each(self.model.getAttribute('contract_line_names',[]), function(lineIdName){
					self.addLine(lineIdName);
				});
				self.renderTabs();
			});
			return this;
		},
		
		/**
		 * Initialize model, fetch its data (if id is set on url) and perform a HEAD request to have fields definitions
		 */
		initModel: function(){
			var arrayDeferred = [];
			//if needed, initialize model
			if(_.isUndefined(this.options.id)){
				this.model = new ContractModel();
			}
			else{
				this.model = new ContractModel({id:this.options.id});
				arrayDeferred.push(this.model.fetch());
			}
			return $.when.apply($, arrayDeferred);
		},
		
		/**
		 * Dispatch save to all sub-models on this view
		 */
		saveForm: function(e, stayOnForm, todo){
			e.preventDefault();
			var self = this;
			var deferredArray = [];
			//trigger "save" event of the general view
			this.formGeneralView.saveForm(e).done(function(){
				//trigger "save" event for each lineView attached to this one
				_.each(self.linesViews, function(lineView){
					lineView.model.set({contract_id: self.formGeneralView.model.getId()});
					deferredArray.push(lineView.saveForm(e));
				});
				$.when.apply($,deferredArray).then(function(){
					deferredArray = [];
					if(todo){
						deferredArray.push(self.model.save(todo, {wait:true, patch:true}));
					}
					$.when.apply($, deferredArray).done(function(){
						if(stayOnForm){
							self.model.fetch().done(function(){
								self.render();
							});
						}
						else{
							window.history.back();
						}
					});
				});
			});
		},
		
		savePostForm: function(e){
			e.preventDefault();
			this.saveForm(e, false, {wkf_evolve:'post'});
		},
		
		saveDraftForm: function(e){
			this.saveForm(e, true);
		},
		
		setDraftForm: function(){
			var self = this;
			this.model.save({wkf_evolve:'redraft'}, {patch:true,wait:true}).then(function(){
				self.model.fetch().done(function(){
					self.render();
				});
			});
		},
		
		actionAddLine: function(e){
			e.preventDefault();
			this.addLine(null);
			this.renderTabs();
		},
		
		actionRemoveLine: function(e){
			e.preventDefault();
			e.stopPropagation();
			var toDelete = $(e.currentTarget).data('view');
			var view = this.linesViews[toDelete];
			if(view){
				if(!view.model.isNew()){
					this.model.addLineToRemove(view.model);
				}
				$('.lineHeader[href="#' + toDelete + '"]').remove();
				view.remove();
				delete this.linesViews[toDelete];
			}
		},
		
		/**
		 * For each contractLine on the model, add a ContractLineView.
		 * It creates an entry on the nav-tabs for each line 
		 */
		addLine: function(idAndName){
			var self = this;
			var idString = '';
			var name = idAndName ? idAndName[1] : 'Nouvelle Tâche';
			var params = {notMainView: true};
			params.parentModel = this.model;
			if(idAndName){
				idString += 'task_' + idAndName[0].toString();
				params.modelId = idAndName[0];
			}
			else{
				idString += 'new_task_' + (this.cptTasks++).toString();
			}
			params.id = idString;
			var html = '<li><a class="lineHeader" data-toggle="tab" href="#' + idString + '"><b class="title">' + name + '</b></a></li>';
			$(self.el).find('#linesHeader li:last').hide().fadeIn('slow').before(html);
			
			var lineView = new FormContractLineView(params);
			this.linesViews[idString] = lineView;
			$(this.el).find('#lines').append(lineView.el);
			
		},
		
	});
	return FormContractView;
});