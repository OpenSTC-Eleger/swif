define([
	'app',
	'appHelpers',

	'claimersCollection',
	'bookablesCollection',
	'bookableModel',

	'advancedSelectBoxView',

], function(app, AppHelpers, ClaimersCollection, BookablesCollection, BookableModel, AdvancedSelectBoxView){

	'use strict';

		
	
	/******************************************
	* Side Bar for selecting resources
	*/
	var SideBarPlanningSelectResourcesView = Backbone.View.extend({


		templateHTML          : '/templates/others/SideBarPlanningSelectResources.html',

		selectablePlaces      : new BookablesCollection(),
		selectedPlaces        : [],

		selectableEquipments  : new BookablesCollection(),
		selectedEquipments    : [],
		selectedEquipmentsQuantity : {},
		
		selectableClaimers    : new ClaimersCollection(),

	
	
		// The DOM events //
		events: {
			'mouseenter #bookablesPlaces a, #bookablesEquipments a': 'highlightResource',
			'mouseleave #bookablesPlaces a, #bookablesEquipments a': 'mutedResource',

			'keyup #placesSearch'                                  : 'resourcesSearch',
			'keyup #equipmentsSearch'                              : 'resourcesSearch',

			'click #actionsPlaceList a[data-action="select"]'      : 'actionsPlaceSelectAll',
			'click #actionsPlaceList a[data-action="unselect"]'    : 'actionsPlaceUnSelectAll',
			//'click #actionsPlaceList a[data-action="toggle"]'      : 'actionsPlaceSelectToggle',


			'click #bookablesPlaces a'                             : 'selectPlace',
			'click #bookablesEquipments a'                         : 'selectEquipments',

			'click i.icon-quantity, span.quantity, span.quantity-container'    : 'focusQuantity',
			'keyup span.quantity'                                  : 'updateQuantity',
			'blur  span.quantity'                                  : 'setQuantity',

			'change #claimersOrganization'                         : 'filterResources'
		}, 
	
	
	
		/** View Initialization
		*/
		initialize: function (params) {
			var self = this;

			this.options = params;

			this.selectedPlaces = [];
			this.selectedEquipments = [];
			this.selectedEquipmentsQuantity = {};

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
					lang                		: app.lang,
					selectablePlaces    		: self.selectablePlaces,
					selectableEquipments		: self.selectableEquipments,
					displayClaimersSelectBox	: self.selectableClaimers.cpt>0 ? "" : "hide"
				});
	
				$(self.el).html(template);
	
				// Advance Select List View //
				if( self.selectableClaimers.cpt > 0 ) {
					app.views.advancedSelectBoxClaimerView = new AdvancedSelectBoxView({el: $('#claimersOrganization'), collection: ClaimersCollection.prototype })
					app.views.advancedSelectBoxClaimerView.render();
				}


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

			var idPlace = this.toggleResource(e);


			if(_.contains(this.selectedPlaces, idPlace)){
				this.selectedPlaces = _.without(this.selectedPlaces, idPlace);
			}
			else{
				this.selectedPlaces.push(idPlace);
			}


			if(_.isEmpty(this.selectedPlaces)){
				$('#nbPlaces').removeClass('badge-info');
				$('#nbPlaces').html(_.size(this.selectablePlaces));
			}
			else{
				$('#nbPlaces').addClass('badge-info');	
				$('#nbPlaces').html(_.join(' / ', _.size(this.selectedPlaces), _.size(this.selectablePlaces)));
			}

			app.views.calendarPlanningView.fetchEvents();
		},



		/** When an equipments is selected/unselected
		*/
		selectEquipments: function(e){
			e.preventDefault();


			var idEquipment = this.toggleResource(e);


			if(_.contains(this.selectedEquipments, idEquipment)){
				this.selectedEquipments = _.without(this.selectedEquipments, idEquipment);
				delete this.selectedEquipmentsQuantity[idEquipment];
			}
			else{
				this.selectedEquipments.push(idEquipment);
				this.selectedEquipmentsQuantity[idEquipment] = 1;
			}


			if(_.isEmpty(this.selectedEquipments)){
				$('#nbEquipments').removeClass('badge-info');
				$('#nbEquipments').html(_.size(this.selectableEquipments));
			}
			else{
				$('#nbEquipments').addClass('badge-info');	
				$('#nbEquipments').html(_.join(' / ', _.size(this.selectedEquipments), _.size(this.selectableEquipments)));
			}

			app.views.calendarPlanningView.fetchEvents();
		},




		/** When the mouse enter a resource
		*/
		highlightResource: function(e){
			var link = $(e.target);
			var row = link.parent('li');

			if(!row.hasClass('selected')){
				var icon = link.children('i:first-child');

				var color = link.parent('li').data('color');
				icon.css({color: color});
			}
			else{
				
				this.timeOver = setTimeout(function () {
					$('.fc-event').not('.resa-'+row.data('id')).delay(500).fadeOut();
				}, 350);
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
			else{
				clearTimeout(this.timeOver);
				$('.fc-event').fadeIn();
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
				icon.toggleClass('fa-dot-circle-o').toggleClass('fa-circle-o');

				if(row.hasClass('selected')){
					var color = row.data('color');
					icon.css({color: color});
				}

				return row.data('id');
			}
			else{
				return null;
			}

		},


		actionsPlaceSelectAll: function(e){
			var self = this;
			e.preventDefault();


			// Clear the selected Places array //
			this.selectedPlaces = [];

			_.each(this.selectablePlaces.models, function(a, i){
				self.selectedPlaces.push(a.getId());
			})

			$('#bookablesPlaces li').each(function(index) {

  				// Get the color //
  				var color = $(this).data('color');

  				// Icons //
  				var icon = $(this).find('i.icon-radio');

				$(this).addClass('selected');
				icon.removeClass('fa-circle-o').addClass('fa-dot-circle-o').css({color: color});

			});

			$('#nbPlaces').addClass('badge-info');
			$('#nbPlaces').html(_.join(' / ', _.size(self.selectedPlaces), _.size(self.selectablePlaces)));

			app.views.calendarPlanningView.fetchEvents();
		},


		actionsPlaceUnSelectAll: function(e){
			var self = this;
			e.preventDefault();

			// Clear the selected Places array //
			this.selectedPlaces = [];

			$('#bookablesPlaces li').each(function(index) {

  				// Icons //
  				var icon = $(this).find('i.icon-radio');

				$(this).removeClass('selected');
				icon.removeClass('fa-dot-circle-o').addClass('fa-circle-o').css({color: 'inherit'});

			});

			$('#nbPlaces').removeClass('badge-info');
			$('#nbPlaces').html(_.size(self.selectablePlaces));


			app.views.calendarPlanningView.fetchEvents();
		},


		actionsPlaceSelectToggle: function(e){
			var self = this;
			e.preventDefault();

			var allPlaces = [];
			_.each(this.selectablePlaces.models, function(a, i){
				allPlaces.push(a.getId());
			})

			this.selectedPlaces = _.difference(allPlaces, this.selectedPlaces);


			$('#bookablesPlaces li').each(function(index) {

  				// Icons //
  				var icon = $(this).find('i.icon-radio');

				$(this).toggleClass('selected');
				icon.toggleClass('fa-dot-circle-o').toggleClass('fa-circle-o');


				if($(this).hasClass('selected')){
					var color = $(this).data('color');
					icon.css({color: color});
				}
				else{
					icon.css({color: 'inherit'});
				}

			});


			if(_.isEmpty(this.selectedPlaces)){
				$('#nbPlaces').removeClass('badge-info');
				$('#nbPlaces').html(_.size(this.selectablePlaces));
			}
			else{
				$('#nbPlaces').addClass('badge-info');	
				$('#nbPlaces').html(_.join(' / ', _.size(this.selectedPlaces), _.size(this.selectablePlaces)));
			}

			app.views.calendarPlanningView.fetchEvents();
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
			e.preventDefault();
			e.stopPropagation();
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


		/** Set the quantity of an equipment
		*/
		setQuantity: function(e){
			var target = $(e.target);

			var equipmentId = target.parents('li').data('id');

			this.selectedEquipmentsQuantity[equipmentId] = _($(e.target).text()).toNumber();
		},


		filterResources : function(e){

			var partnerId = app.views.advancedSelectBoxClaimerView.getSelectedItem();

		},



		/** Load Bookable collection
		*/
		initCollection: function(){

			// Create Fetch params //
			var fetchParamsPlaces = {
				silent  : true,
				data : {
					filters : AppHelpers.calculSearch({search: 'site' }, BookableModel.prototype.searchable_fields)
				}
			};

			var fetchParamsEquipments = {
				silent  : true,
				data : {
					filters : AppHelpers.calculSearch({search: 'materiel' }, BookableModel.prototype.searchable_fields)
				}
			};


			// Fetch the collections //
			return $.when(this.selectablePlaces.fetch(fetchParamsPlaces), this.selectableEquipments.fetch(fetchParamsEquipments), this.selectableClaimers.count())
			.fail(function(e){
				console.log(e);
			});

		}
	


	});

return SideBarPlanningSelectResourcesView;

})