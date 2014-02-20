/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'bookingsCollection',
	'bookingModel',

	'genericListView',
	'paginationView',

	'itemBookingView',	
	'toolbarButtonsView',
	
	'metaDataModel'

], function(app, AppHelpers, BookingsCollection, BookingModel, GenericListView, PaginationView, ItemBookingView, 
				ToolbarButtonsView, MetaDataModel){

	'use strict';


	/******************************************
	* Bookings List View
	*/
	var bookingsListView = GenericListView.extend({

		templateHTML : '/templates/lists/bookingsList.html',
		
		model : BookingModel,
		
		//overrides url GenericListView's url parameters to add 'recurrence parameter'
		urlParameters: ['recurrence', 'id', 'search', 'filter', 'sort', 'page'],

		// The DOM events //
		events: function(){
			return _.defaults({
				'click #badgeActions[data-filter!=""]'  : 'badgeFilter',
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize : function(params) {
			var self = this;

			this.options = params;
			
			
			// Check if the collections are instantiated //
			if(_.isUndefined(this.collection)){ this.collection = new BookingsCollection(); }
			else{this.collection.reset();}

			GenericListView.prototype.initialize.apply(self, arguments);
		},



		add: function(model){
			//TODO : add item after new booking created
		},



		/** Partial Render of the view : refresh toolbar buttons
		*/
		partialRender: function(model){
			var self = this;
			if(! _.isNull(model) && !_.isUndefined(model) ) {
				if( model.getRecurrence('id')!= false )
					app.views.toolbarButtonsView.initialize( { collection: this.collection } );
			}
			this.collection.specialCount().done(function(){
				$('#badgeActions').html(self.collection.specialCpt);
				app.views.paginationView.render();
			});
		},


		/** Display the view
		*/
		render : function() {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.resa.viewsTitles.bookingsList);


			// Retrieve the HTML template //
			$.get(app.menus.openresa + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang             : app.lang,
					bookings         : self.collection,
					nbBookings       : self.collection.specialCpt,
					BookingModel	 : BookingModel,
					bookingsState    : BookingModel.status,
				});


				$(self.el).html(template);


				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);
				
				// Create item booking view //
				_.each(self.collection.models, function(booking, i){
					var itemView = new ItemBookingView( {model: booking} );
					$('#booking-items').append(itemView.render().el);
				});

				//Toolbar buttons : factory actions for multiple bookings ( confirm/cancel:close booking)
				app.views.toolbarButtonsView = new ToolbarButtonsView( { collection: self.collection } );

			});
			$(this.el).hide().fadeIn();
			return this;
		},

		/** Filter Bookings on the State of the Badge
		 	*/
		badgeFilter: function(e){
		 	e.preventDefault();

		 	delete this.options.recurrence;
			var filterValue = $(e.target).data('filter');

			// Set the filter value in the options of the view //
			if(filterValue != ''){
				this.options.filter = [{field: 'state', operator: 'in', value: [filterValue] }];
				delete this.options.search;
				delete this.options.page;
			}

			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
		},		
 
	});	
	
	return bookingsListView;
});