define([
	'app',
	'appHelpers',

	'bookingsCollection',
	'bookingModel',

	'genericListView',
	'paginationView',
	'itemBookingView',	
	'toolbarButtonsView'

], function(app, AppHelpers, BookingsCollection, BookingModel, GenericListView, PaginationView, ItemBookingView, ToolbarButtonsView){

	'use strict';


	/******************************************
	* Bookings List View
	*/
	var bookingsListView = GenericListView.extend({
	
		templateHTML : '/templates/lists/bookingsList.html',
		
		//overrides url GenericListView's url parameters to add 'recurrence parameter'  
		urlParameters: ['recurrence', 'id', 'search', 'filter', 'sort', 'page'],
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'click #filterStateBookingList li a' 	: 'setFilterState',	
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
	
	
			this.initCollections().done(
				function(){
					app.router.render(self);
					// Unbind & bind the collection //
					self.collection.off();
					self.listenTo(self.collection, 'add',self.add);
				}
			);
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
				GenericListView.prototype.render(self.options);
				
				// Create item booking view //				
				_.each(self.collection.models, function(booking, i){
					var itemView = new ItemBookingView( {model: booking} );
					$('#booking-items').append(itemView.render().el);	
				});


				// Render Filter Link on the Table //
				if(!_.isUndefined(self.options.filter)){

					$('#filterStateBooking').removeClass('filter-disabled');
					$('#filterStateBookingList li.delete-filter').removeClass('disabled');

					$('a.filter-button').addClass('text-'+BookingModel.status[self.options.filter.value].color);
				}
				else{
					$('#filterStateBooking').addClass('filter-disabled');
					$('#filterStateBookingList li.delete-filter').addClass('disabled');
				}

				
				//Toolbar buttons : factory actions for multiple bookings ( confirm/cancel:close booking)
				app.views.toolbarButtonsView = new ToolbarButtonsView( { collection: self.collection } );
				
				// Pagination view //
				app.views.paginationView = new PaginationView({ 
					page       : self.options.page.page,
					collection : self.collection
				})
				
			});
			$(this.el).hide().fadeIn();
			return this;
		},
		
		
		/** Filter Requests on the State
			*/
		setFilterState: function(e){
			e.preventDefault();
	
			if($(e.target).is('i')){
				var filterValue = _($(e.target).parent().attr('href')).strRightBack('#');
			}else{
				var filterValue = _($(e.target).attr('href')).strRightBack('#');
			}
	
			// Set the filter value in the options of the view //
			if(filterValue != 'delete-filter'){
				this.options.filter = { by: 'state', value: filterValue};
				delete this.options.page;
			}
			else{
				delete this.options.filter;
			}
			
			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
		},
		
		/** Filter Requests on the State of the Badge
		 	*/
		badgeFilter: function(e){
		 	e.preventDefault();
		 	delete this.options.recurrence
		 		
			var filterValue = $(e.target).data('filter');
	
			// Set the filter value in the options of the view //
			if(filterValue != ''){
				this.options.filter = { by: 'state', value: filterValue};
				delete this.options.search;
				delete this.options.page;
			}
	
			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
		},
		

		/**
		 * Init reservation collection with url params
		 */	
		initCollections: function(){
			var self = this;
			
			// Check if the collections are instantiated //
			if(_.isUndefined(this.collection)){ this.collection = new BookingsCollection(); }
			else{this.collection.reset();}
			
	
	
			this.options.page = AppHelpers.calculPageOffset(this.options.page);
	
			if(!_.isUndefined(this.options.filter)){
				this.options.filter = AppHelpers.calculPageFilter(this.options.filter);
			}
	
			if(_.isUndefined(this.options.sort)){
				this.options.sort = this.collection.default_sort;
			}
			else{
				this.options.sort = AppHelpers.calculPageSort(this.options.sort);	
			}
				
			// Create Fetch params //
			this.fetchParams = {
				silent     : true,
				data       : {
					limit  : app.config.itemsPerPage,
					offset : this.options.page.offset,
					sort   : this.options.sort.by+' '+this.options.sort.order,					
				}
			};
			
			if(_.isUndefined(this.fetchParams.data.filters))
				this.fetchParams.data.filters = new Object();			
				
			var globalSearch = {};			
	
			if(!_.isUndefined(this.options.search)){
				globalSearch.search = this.options.search;
			}
			if(!_.isUndefined(this.options.filter)){
				globalSearch.filter = this.options.filter;
			}
	
			if(!_.isEmpty(globalSearch)){
				this.fetchParams.data.filters = AppHelpers.calculSearch(globalSearch, BookingModel.prototype.searchable_fields);
			}
			
			//Add filter on recurrence selected
			if(!_.isUndefined(this.options.recurrence)){
				this.fetchParams.data.filters  = _.toArray(this.fetchParams.data.filters);
				this.fetchParams.data.filters.push({field: 'recurrence_id.id', operator:'=', value:this.options.recurrence})				
				this.fetchParams.data.filters = app.objectifyFilters(this.fetchParams.data.filters)
			}
			
			var ajaxRequests = [this.collection.fetch(this.fetchParams)]					

			var deferred = $.Deferred();
			$.when.apply( $, ajaxRequests )
				.done(function(){
					deferred.resolve();
				})
				.fail(function(e){
					console.error(e);
				})
			
			return deferred;
		}	  
	});	
	
	return bookingsListView;
});