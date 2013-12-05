define([
	'app',
	'appHelpers',

	'bookingsCollection',
	'bookingModel',
	'bookingRecurrenceModel',

	'genericListView',
	'paginationView',
	'itemBookingView',
	'itemBookingOccurrencesListView',
	'modalUpdateBookingsListView',
	'toolbarButtonsView'

], function(app, AppHelpers, BookingsCollection, BookingModel, BookingRecurrenceModel, GenericListView, PaginationView, ItemBookingView, ItemBookingOccurrencesListView, ModalUpdateBookingsListView, ToolbarButtonsView){

	'use strict';


	/******************************************
	* Bookings List View
	*/
	var bookingsListView = GenericListView.extend({
	
		templateHTML : '/templates/lists/bookingsList.html',

		urlParameters: ['recurrence', 'id', 'search', 'filter', 'sort', 'page'],

		collections  :  {},
		
		//DOM actions elements, buttons : all valid, all refuse, all close
		btnActions    : 'span.btn-actions',
		
		//bookingRecurrenceSelectedModel : null,
	
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
	
	
			this.initCollections().then(
				function(){
					app.router.render(self);
					// Unbind & bind the collection //
					self.collection.off();
					self.listenTo(self.collection, 'add',self.add);
				}
			);
		},
	
	
	
		add: function(model){
		},
		

	
		/** Partial Render of the view
		*/
		partialRender: function(){
		},
		

	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.bookingsList);
	
	
			
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
				
				// Create item intervention view //
				
				_.each(self.collection.models, function(booking, i){
					var simpleView = new ItemBookingView( {model: booking} );
					$('#booking-items').append(simpleView.render().el);	
				});
				
				self.toolbarButtonsView = new ToolbarButtonsView( { collection: self.collection } );
				
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
			var fetchParams = {
				silent     : true,
				data       : {
					limit  : app.config.itemsPerPage,
					offset : this.options.page.offset,
					sort   : this.options.sort.by+' '+this.options.sort.order
				}
			};
			
	
			var globalSearch = {};
			
	
			if(!_.isUndefined(this.options.search)){
				globalSearch.search = this.options.search;
			}
			if(!_.isUndefined(this.options.filter)){
				globalSearch.filter = this.options.filter;
			}
	
			if(!_.isEmpty(globalSearch)){
				fetchParams.data.filters = AppHelpers.calculSearch(globalSearch, BookingModel.prototype.searchable_fields);
			}
			
			if(!_.isUndefined(this.options.recurrence)){
				fetchParams.data.filters  = _.toArray(fetchParams.data.filters);
				fetchParams.data.filters.push({field: 'recurrence_id.id', operator:'=', value:this.options.recurrence})				
				fetchParams.data.filters = app.objectifyFilters(fetchParams.data.filters)
			}
			
			var ajaxRequests = [this.collection.fetch(fetchParams)]					

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