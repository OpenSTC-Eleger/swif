define([
	'app',

	'claimersTypesCollection',

	'advancedSelectBoxView',

], function(app, ClaimersTypesCollection, AdvancedSelectBoxView){

	'use strict';

		
	
	/******************************************
	* Valid Request Modal View
	*/
	var SideBarPlanningSelectResourcesView = Backbone.View.extend({
	
	
		templateHTML : '/templates/others/SideBarPlanningSelectResources.html',
	
	
		// The DOM events //
		events: {
			'click #bookablesPlaces a'     : 'selectPlaces',
			'click #bookablesEquipments a' : 'selectEquipments',
		}, 
	
	
	
		/** View Initialization
		*/
		initialize: function (params) {
			var self = this;

			this.options = params;

			app.router.render(self);
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			$.get(app.menus.openresa+this.templateHTML, function(templateData){
	
				var template = _.template(templateData, {
					lang    : app.lang,
				});
	
				$(self.el).html(template);
	
				// Advance Select List View //
				app.views.advancedSelectBoxCategoryRequestView = new AdvancedSelectBoxView({el: $("#claimersTypes"), collection: ClaimersTypesCollection.prototype })
				app.views.advancedSelectBoxCategoryRequestView.render();
	
			});
	
			return this;
		},



		selectPlaces: function(e){
			e.preventDefault();

			var row = $(e.target).parent('li');

			$(e.target).children('i').toggleClass('fa-circle-o').toggleClass('fa-circle');


			row.toggleClass('active');
		},



		selectEquipments: function(e){
			e.preventDefault();

		}


	

	});

return SideBarPlanningSelectResourcesView;
})