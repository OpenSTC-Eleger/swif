define([
	'app',

	'claimersTypesCollection',
	'bookablesCollection',

	'advancedSelectBoxView',

], function(app, ClaimersTypesCollection, BookablesCollection, AdvancedSelectBoxView){

	'use strict';

		
	
	/******************************************
	* Side Bar for selecting resources
	*/
	var SideBarPlanningSelectResourcesView = Backbone.View.extend({
	
	
		templateHTML        : '/templates/others/SideBarPlanningSelectResources.html',

		selectablePlaces    : new BookablesCollection(),
		selectedPlaces      : new BookablesCollection(),

		selectableEquipments: new BookablesCollection(),
		selectedEquipments  : new BookablesCollection(),
	
	
		// The DOM events //
		events: {
			'mouseenter #bookablesPlaces a, #bookablesEquipments a': 'highlightResource',
			'mouseleave #bookablesPlaces a, #bookablesEquipments a': 'mutedResource',

			'keyup #placesSearch, keyup #equipmentsSearch'         : 'resourcesSearch',

			'click #bookablesPlaces a'                             : 'selectPlace',
			'click #bookablesEquipments a'                         : 'selectEquipments',

			'click i.icon-quantity'                                : 'focusQuantity',
			'keyup span.quantity'                                  : 'updateQuantity'
		}, 
	
	
	
		/** View Initialization
		*/
		initialize: function (params) {
			var self = this;

			this.options = params;

			this.initCollection().done(function(){

				app.router.render(self);
			});
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			$.get(app.menus.openresa+this.templateHTML, function(templateData){
	
				var template = _.template(templateData, {
					lang                : app.lang,
					selectablePlaces    : self.selectablePlaces,
					selectableEquipments: self.selectableEquipments
				});
	
				$(self.el).html(template);
	
				// Advance Select List View //
				app.views.advancedSelectBoxCategoryRequestView = new AdvancedSelectBoxView({el: $('#claimersTypes'), collection: ClaimersTypesCollection.prototype })
				app.views.advancedSelectBoxCategoryRequestView.render();


				// Set the numbers of selectable resources //
				$('#nbPlaces').html(_.size(self.selectablePlaces));
				$('#nbEquipments').html(_.size(self.selectableEquipments));
			});
	
			return this;
		},



		/** When a places is selected/unselected
		*/
		selectPlace: function(e){
			e.preventDefault();

			var idPlaces = this.toggleResource(e);

			if(!_.contains(this.selectedPlaces, idPlaces)){
				this.selectedPlaces.push(idPlaces);
			}
			else{
				this.selectedPlaces.shift();
			}
	

			if(_.isEmpty(this.selectedPlaces)){

				$('#nbPlaces').removeClass('badge-info');
				$('#nbPlaces').html(_.size(this.selectablePlaces));
			}
			else{
				$('#nbPlaces').addClass('badge-info');	
				$('#nbPlaces').html(_.join('/', _.size(this.selectedPlaces), _.size(this.selectablePlaces)));
			}
			
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
				var icon = link.children('i:first-child');

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

				var icon = link.children('i.icon-radio');
				icon.css({color: 'inherit'});
			}
		},


		/** Make element selected
		*/
		toggleResource: function(e){
			var link = $(e.target);

			// If the <a> or the <i> who was clicked //
			if(link.is('a')){
				var row = link.parent('li');
				var icon = link.children('i.icon-radio');
			}
			else if(link.is('i.icon-radio')){
				var row = link.parents('li');
				var icon = link;
			}

			if(!_.isUndefined(row)){
			
				row.toggleClass('selected');

				// Get the color of the Places //
				icon.toggleClass('fa-dot-circle-o').toggleClass('fa-circle');

				if(row.hasClass('selected')){
					var color = '#' + row.data('color');
					icon.css({color: color});
				}
				else{
					icon.css({color: 'inherit'});
				}
				return row.data('id');
			}
			else{
				return null;
			}

			
		},



		/** Search on selectable Place
		*/
		resourcesSearch: function(e){

			var input = $(e.target);
			var search = input.val().toLowerCase();

			var listSearchable = $('#'+input.data('search'));

	
			// If the term is not empty //
			if(!_.isEmpty(search)){
			 
				_.each(listSearchable.find('li'), function(a){
	
					if(!_.include($(a).data('name'), search)){
						$(a).fadeOut('fast').addClass('thide');
					}
					else{
						$(a).fadeIn('fast').removeClass('thide');
					}
				});
			}
			else{
				listSearchable.find('li').fadeIn().removeClass('thide');
			}

		},


		


		/** Set the focus on the <span> content Editable
		*/
		focusQuantity: function(e){
			$(e.target).siblings('.quantity').focus();

		},


		/** Check the quantity in the content Editable
		*/
		updateQuantity: function(e){
			var input = $(e.target);

			var value = _.toNumber(input.text());

			if(!_.isNaN(value)){
				if(value > 999){
					input.text('1');
				}				
			}
			else{
				input.text('1');	
			}
		},



		/** Load Bookable collection
		*/
		initCollection: function(){

			// Create Fetch params //
			var fetchParams = {
				silent  : true,
			};


			// Fetch the collections //
			return $.when(this.selectablePlaces.fetch(fetchParams), this.selectableEquipments.fetch(fetchParams))
			.fail(function(e){
				console.log(e);
			});

		}
	


	});

return SideBarPlanningSelectResourcesView;

})