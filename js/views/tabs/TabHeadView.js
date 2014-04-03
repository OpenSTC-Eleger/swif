/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app'

], function(app){

	'use strict';


	/******************************************
	* Tab Head View
	*/
	var tabHeadView = Backbone.View.extend({

		tagName : 'li',
		
		className	: "tab-header",

		//template name
		genericTemplateHTML: 'templates/tabs/tabHead.html',


		/**
		* Initialize tab view
		*/
		initialize: function(options){
			this.options = options
			
			this.tabType = this.options.tabType;

			this.label = this.tabType.label;
			this.key = this.tabType.key;
			this.url = this.tabType.url;
			this.counter = this.options.counter;
			this.active = this.tabType.active;		
			
			var self = this;
			if( _.isUndefined(this.counter) ) {
				//When counter is not already set (provider tab)
				this.initCounter().done(function() {
					self.render();
				});
			}
			else {
				this.render();
			}
		},


		/** Display the view
		*/
		render: function() {
			var self = this;

			// Retrieve the template //
			$.get(this.genericTemplateHTML, function(templateData){
				var template = _.template(templateData, {
					lang    	: app.lang,
					label		: self.label,
					key 		: self.key,
					counter 	: self.counter,
				});
				
				$(self.el).html(template);
				
				$(self.el).attr("data-type", self.key);
				if(self.active) {
					//select Tab header
					$(self.el).addClass('active');
				}
				
			});

			return this;
		},
		
		//Set counter in tab
		initCounter: function() {
			var self = this;
			return $.ajax({
				url      : this.url,
				method   : 'HEAD',
				dataType : 'text',
				data     : {},
				success  : function(data,status,request){
					var contentRange = request.getResponseHeader('Content-Range');
					self.counter = contentRange.match(/\d+$/)[0];
				}
			});
		}
		
	});

	return tabHeadView;

});