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
		
		// The DOM events //
		events: {
		},


		/** View Initialization
		*/
		initialize: function(options){	
			var self = this;
			//init view parameters
			this.el = options.el;
			this.metaDataModel = options.metaDataModel;
			this.states = options.states;
			//init current route	
			this.currentRoute = Backbone.history.fragment
			this.urlArray = [this.currentRoute];			
			if( _.str.include(this.currentRoute, "/filter/") ) 
			{
				this.urlArray = _.words(this.currentRoute, "/filter/");
				var filter = parseInt(this.urlArray[1][0]);
				if( _.isNaN(filter) ) 
					this.urlArray[1] = '/' + _(this.urlArray[1]).strRight('/');
				else
					if( _.str.include(this.urlArray[1],'/') )
						this.urlArray[1] = '/' + _(this.urlArray[1]).strRight('/');
					else
						this.urlArray[1] = "";
			}

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
				
					var template = _.template(templateData, {
						lang   		: app.lang,
						urlArray  	: self.urlArray, 
						states 		: self.states,
						filters		: self.metaDataModel.getFilters()
					});
				
					$(self.el).html(template);

					$(this.el).hide().fadeIn();
				});

			});

			return this;
		},
		

		//Get recording filters for model
		initFilters: function(){
			var self = this;
			return this.metaDataModel.filters()
		}

	});

	return FilterView;

});