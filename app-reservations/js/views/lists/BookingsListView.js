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
				'click #badge[data-filter!=""]'  : 'badgeFilter',
				'click a.createModel'            : 'createResa'
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
			GenericListView.prototype.partialRender.apply(self);
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


		/** Got to create Resa form
		*/
		createResa: function(e){
			e.preventDefault();
			// forward to new route (go to form 'create resa')
			app.router.navigate(_.join('/',_(Backbone.history.fragment).strLeft('/'), 'planning-des-reservations'), {trigger: true, replace: true});
		},

		// TODO GenericListView
		/*//add filter for claimer to fetch only their own bookings
		if(!app.current_user.isResaManager()){
			this.fetchParams.data.filters  = _.toArray(this.fetchParams.data.filters);
			this.fetchParams.data.filters.push({field: 'partner_id.address.id', operator:'in', value:app.current_user.get('contact_id')});
			this.fetchParams.data.filters = app.objectifyFilters(this.fetchParams.data.filters);
		}

		//Add filter on recurrence selected
		if(!_.isUndefined(this.options.recurrence)){
			this.fetchParams.data.filters  = _.toArray(this.fetchParams.data.filters);
			this.fetchParams.data.filters.push({field: 'recurrence_id.id', operator:'=', value:this.options.recurrence})
			this.fetchParams.data.filters = app.objectifyFilters(this.fetchParams.data.filters)
		}*/

	});

	return bookingsListView;
});