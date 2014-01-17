define([
	'app',
	'appHelpers',
	
	'claimersServicesCollection',

	'advancedSelectBoxView',
	'fieldContainerView'

], function(app, AppHelpers, ClaimersServicesCollection, AdvancedSelectBoxView, FieldContainerView){

	'use strict';


	/******************************************
	* Advanced Filter Bar View
	*/
	var AdvancedFiltersBarView = Backbone.View.extend({
		
		templateHTML : 'others/advancedFiltersBar.html',
		
		
		// The DOM events //
		events: function(){
			return _.defaults({
				//'change #searchServices' 					: 'change',
				'submit #formApplyFilters'					: 'applyFilterForm',
			});
		},


		/** View Initialization
		*/
		initialize: function(options, collection, searchableFields){
			this.options = options;
			this.collection = collection;
			this.searchableFields = searchableFields
		},



		/** View Render
		*/
		render: function(){
			var self = this;
			
			// Retrieve the template //
			$.get("templates/" + this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang             : app.lang,
					pageTitle		 : "Filtres avançés"

				});

				$(self.el).html(template);
				
				if($('#divNavbar').hasClass('hide')){
					$('#divNavbar').removeClass('hide');
					$('#divTable').addClass('span10');
				}
				
				
				self.fieldContainerView = new FieldContainerView({ el: $(".field-container"), searchableFields : self.searchableFields} )
				self.fieldContainerView.render();
				//$(".field-container").append(self.fieldContainerView.render().el);

				$('#navbar li:not(.nav-header)').first().addClass('active');


			});

			$(this.el).hide().fadeIn();

			return this;


		},
		
		/*
		*/
		applyFilterForm: function(e){
			e.preventDefault();
			var self = this;

			var filters = []
		    var size = _.size(this.fieldContainerView.components)
			_.each(self.fieldContainerView.components, function(c,i) {
				var filter = AppHelpers.getFilterDomain(c);
				if(!_.isUndefined(filter)) {
					filters.push(filter)
				}
			})

            var fetchParams = {
               				reset      : true,
               				data       : {
               					limit  : app.config.itemsPerPage,
               					offset : this.options.page.offset,
               					sort   : this.options.sort.by+' '+this.options.sort.order
               				}
               			};  
            if(_.size(filters)>0) {
            	fetchParams.data.filters = app.objectifyFilters(filters)            
            	this.collection.fetch(fetchParams)
            }
			

		},


	});

return AdvancedFiltersBarView;

});