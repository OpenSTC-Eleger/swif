/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers'

], function(app, AppHelpers){

	'use strict';


	/******************************************
	* Tab Content View 
	*/
	var tabContentView = Backbone.View.extend({
		
		
		//template name
		templateHTML: 'templates/tabs/tabContent.html',

		events: {
			'click li a'  : 'selectPlanning',
		},

		/**
		* Initialize tab view
		*/
		initialize: function(params){
			this.options = params;
			
			this.hrefList = this.options.hrefList;
			this.hrefSelected = this.options.hrefSelected;
			this.tabTypes = this.options.tabTypes;
			this.key = this.options.tabTypesSelected.key;
			
		},


		/** Display the view
		*/
		render: function() {
			var self = this;
			
			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){
				
				var template = _.template(templateData, {
					lang        : app.lang,
					context		: app.menus.openstc,
					array		: self.hrefList,
					key         : self.key,
				});

				self.$el.html(template);
				
				$('*[data-toggle="popover"]').popover({trigger: 'hover', delay: { show: 400, hide: 100 }});
				
				$('#allTabs a[data-target="#tab-' + self.key + '"]').tab('show');
				$('#'+self.options[self.key]).parent().addClass('active');
				if( _.isUndefined(self.hrefSelected) ) {
					$('#list-' + self.key + ' li:first').addClass('active');
					if( _.size(self.hrefList)>0 ) {
						self.resetPlanning(self.hrefList[0].id);
					}
				} else {
					$('#cal_'+self.hrefSelected.id).parent().addClass('active');
					self.resetPlanning(self.hrefSelected.id);
				}
			});
			return this;
		},
		
		setKey: function(key){
			this.key = key;
		},
		
		setHrefList: function(hrefList){
			this.hrefList = hrefList;
		},
		
		setHrefSelected: function(hrefSelected){
			this.hrefSelected = hrefSelected;
		},
		
		/** Trigger Select planning event
		*/
		selectPlanning: function(e) {
			e.preventDefault();
			
			var modelId = _($(e.target).attr('href')).strRightBack('#');
			$(this.el).find('li').removeClass('active');
			$(e.target).parent().addClass('active');
			
			this.resetPlanning(modelId);
		},
		
		/**
		 * Display new calendar selected from tab
		 */
		resetPlanning: function(modelId){
			AppHelpers.deleteOptions(app.views.calendarView.options, this.tabTypes);
			app.views.calendarView.options[this.key] = modelId;
			
			app.router.navigate(app.views.calendarView.urlBuilder(), {trigger: false, replace: true});
			
			app.views.planning.calendarRender();
			app.views.planningInterListView.paginationRender(app.views.calendarView.options);
		}
		
	});

	return tabContentView;

});