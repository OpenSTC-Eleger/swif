define([	
	
	'app',
	
], function(app){

	'use strict';


	/******************************************
	* Recording filter view
	*/
	var FilterView = Backbone.View.extend({		
		
		templateHTML 	: 'templates/others/recordFilter.html',
		
		components : [],
		
		filters	   : [],
		
		//Static variables uses to build url
		URL_CTXT    : '/filter/',
		SLASH_CHAR	: '/',
		
		// The DOM events //
		events: {
			'click [href^=#filter-state]'               : 'filterByState'
		},


		/** View Initialization
		*/
		initialize: function(options){	
			
			//init view parameters
			this.el = options.el;
			this.metaDataModel = options.metaDataModel;
			this.states = options.states;
			this.listView = options.listView;
			//prepares variables to construct url filter in template	
			this.prepareUrls();

			//Fetch meta model
			this.metaDataModel.fetch();
		},



		/** View Render
		*/
		render: function(){
			var self = this;
			
			//After get filters render view
			this.initFilters().done(function(){				

				// Retrieve the template //
				$.get(self.templateHTML, function(templateData){
					
					self.buildUrls();
				
					var template = _.template(templateData, {
						lang   		: app.lang,
						states 		: self.states,
						filters		: self.filters
					});
				
					$(self.el).html(template);

					$(this.el).hide().fadeIn();
				});

			});

			return this;
		},
		

		/**
		 * Get recording filters for model
		 */
		initFilters: function(){
			var self = this;
			return this.metaDataModel.filters()
		},
		
		/**
		 * Init Urls varaiables using to buils url filters in templates
		 */
		prepareUrls: function(){
			this.urlLeftPart = Backbone.history.fragment;
			this.urlRightPart = null;
			if( _.str.include(this.urlLeftPart, this.URL_CTXT) ) 
			{
				this.urlArray = _.words(this.urlLeftPart, this.URL_CTXT);
				this.urlLeftPart = this.urlArray[0];
				this.urlRightPart = _(this.urlArray[1]).strRight(this.SLASH_CHAR);
				var filter = parseInt(this.urlArray[1][0]);
				if( _.isNaN(filter) ) 
				{
					this.urlRightPart = this.SLASH_CHAR + this.urlRightPart;				
				}
				else
				{
					if( _.str.include(this.urlRightPart,this.SLASH_CHAR) )
						this.urlRightPart = this.SLASH_CHAR + this.urlRightPart;
					else
						this.urlRightPart = null;
				}
			}
		},
		
		/**
		 * Builds url for each filters in template
		 */
		buildUrls: function() {
			this.filters = [];
			
			var self = this;
			_.each(self.metaDataModel.getFilters(),function(f){
				if ( !_.isNull( self.urlRightPart ) ) {
					f.route = _.join(self.URL_CTXT, self.urlLeftPart , _(self.urlRightPart).splice(0, 0, f.id) );
				}
				else {
					f.route = _.join(self.URL_CTXT, self.urlLeftPart, f.id);					
				}
				self.filters.push(f);
			});
		},
		
		/**
		 * Filter list by state
		 */
		filterByState: function(e){
			e.preventDefault();
			
			var state = _(e.currentTarget.href).strRight('_');		
			var filters = [{'field': 'state', 'operator': '=', 'value' : state}];
			
			this.listView.applyAdvancedFilters(filters);
			
		}

	});

	return FilterView;

});