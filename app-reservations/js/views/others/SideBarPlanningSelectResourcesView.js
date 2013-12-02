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
			'mouseenter #bookablesPlaces a, #bookablesEquipments a' : 'highlightResource',
			'mouseleave #bookablesPlaces a, #bookablesEquipments a' : 'mutedResource',

			'click #bookablesPlaces a'      : 'selectPlace',
			'click #bookablesEquipments a'  : 'selectEquipments',
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



		/** When a places is selected/unselected
		*/
		selectPlace: function(e){
			e.preventDefault();

			this.toggleResource(e);
		},



		/** When an equipments is selected/unselected
		*/
		selectEquipments: function(e){
			e.preventDefault();

			this.toggleResource(e);

		},




		/** When the mouse enter a resource
		*/
		highlightResource: function(e){
			var link = $(e.target);
			var row = link.parent('li');

			if(!row.hasClass('selected')){
				var icon = link.children('i.fa');

				var color = '#' + link.parent('li').data('color');
				icon.css({color: color});
			}

		},

		/** When the mouse leave a resource
		*/
		mutedResource: function(e){
			var link = $(e.target);
			var row = link.parent('li');

			if(!row.hasClass('selected')){

				var icon = link.children('i.fa');
				icon.css({color: 'inherit'});
			}
		},


		/** Make element selected
		*/
		toggleResource: function(e){
			var link = $(e.target);
			var row = link.parent('li');
			var icon = link.children('i.fa');

			row.toggleClass('selected');

			// Get the color of the Places //
			icon.toggleClass('fa-circle-o').toggleClass('fa-circle');

			if(row.hasClass('selected')){
				var color = '#' + row.data('color');
				icon.css({color: color});
			}
			else{
				icon.css({color: 'inherit'});
			}
		}


	

	});

return SideBarPlanningSelectResourcesView;

})