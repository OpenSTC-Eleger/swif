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
						lang   : app.lang,
						states : self.states,
						filters: self.metaDataModel.getFilters()
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