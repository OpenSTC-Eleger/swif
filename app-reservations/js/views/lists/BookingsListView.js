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
	'modalUpdateBookingsListView'

], function(app, AppHelpers, BookingsCollection, BookingModel, BookingRecurrenceModel, GenericListView, PaginationView, ItemBookingView, ItemBookingOccurrencesListView, ModalUpdateBookingsListView){

	'use strict';


	/******************************************
	* Bookings List View
	*/
	var bookingsListView = GenericListView.extend({
	
		templateHTML: 'lists/bookingsList',
		
		urlParameters : ['recurrence', 'id', 'search', 'filter', 'sort', 'page'],
	
		collections:  {},
		
		//DOM actions elements, buttons : all valid, all refuse, all close
		btnActions    : 'span.btn-actions',
		
		bookingRecurrenceSelectedModel : null,
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'click #filterStateBookingList li a' 	: 'setFilterState',	
				'click #badgeActions[data-filter!=""]'  : 'badgeFilter',
				
				'click .actions'						: 'updateOccurences',
				'click #unbindOccurences'           	: 'unbindOccurences',				
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
		partialRender: function (type) {
		},
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.bookingsList);
	
	
			
			// Retrieve the HTML template //
			$.get(app.moduleUrl+'/templates/' + this.templateHTML + ".html", function(templateData){
				var template = _.template(templateData, {
					lang             : app.lang,
					bookings         : self.collection,
					nbBookings       : self.collection.specialCpt,	
					BookingModel	 : BookingModel,
					bookingsState    : BookingModel.status,
					recurrenceModel  : self.bookingRecurrenceSelectedModel
				});
	
	
				$(self.el).html(template);	
				
	
				// Call the render Generic View //
				GenericListView.prototype.render(self.options);
				
				// Create item intervention view //
				_.each(self.collection.models, function(booking, i){
					var detailedView = null;
					if( booking.isTemplate() )
						detailedView = new ItemBookingOccurrencesListView({model: booking});
					var simpleView = new ItemBookingView({model: booking });
					$('#booking-items').append(simpleView.render().el);	
					if( booking.isTemplate() )
						$('#booking-items').append(detailedView.render().el);
					simpleView.detailedView = detailedView;	
				});
				
				// Pagination view //
				app.views.paginationView = new PaginationView({ 
					page       : self.options.page.page,
					collection : self.collection
				})
	
	
				if(self.options.recurrence == null){
					if( !_.isUndefined(self.bookingRecurrenceSelectedModel) 
						&& !_.isNull(self.bookingRecurrenceSelectedModel) ){
							self.bookingRecurrenceSelectedModel.off();
					}						
					$(self.btnActions).addClass('hide');				
				}
				else{
//					self.bookingRecurrenceSelectedModel = new BookingRecurrenceModel({id: self.options.recurrence });
//					self.bookingRecurrenceSelectedModel.fetch();
//					self.listenTo(self.bookingRecurrenceSelectedModel, 'change', self.render);						
					//TODO : calculates actions buttons to display with self.bookingRecurrenceSelectedModel.getActions();
					$(self.btnActions).removeClass('hide');
				}
				
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
	
		/** valid all occurences booking
		*/
		updateOccurences: function(e){
			e.preventDefault();
			var self = this;		
			this.openModal(e.currentTarget.id);	
		},
		
		/** unbind occurences : return to list
		*/
		unbindOccurences: function(e){
			e.preventDefault();
			var self = this;				
			delete this.options.recurrence		
			app.router.navigate(app.views.bookingsListView.urlBuilder(), {trigger: true, replace: true});	
		},
		
		openModal: function(state){
//			var model = new BookingRecurrenceModel({id: this.options.recurrence });
//			this.listenTo(model, 'change', this.render);
			//var deferred = $.Deferred();
			//this.selectedBookingRecurrence.fetch().done(function(){
				app.views.modalUpdateBookingsListView = new ModalUpdateBookingsListView({
					el      	: '#modalUpdateBookingsList',
					model   	: this.bookingRecurrenceSelectedModel,
					booking		: this.collection.at(0),
					state		: state
				});
//				deferred.resolve();
//			})
//			.fail(function(e){
//				console.error(e);
//			})			
//			return deferred;
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
			if( !_.isUndefined(this.options.recurrence) 
					&& !_.isNull(this.options.recurrence) ){
				this.bookingRecurrenceSelectedModel = new BookingRecurrenceModel({id: this.options.recurrence });		
				this.listenTo(this.bookingRecurrenceSelectedModel, 'change', this.render);		
				//Add ajax request for update intervention
				ajaxRequests.push(this.bookingRecurrenceSelectedModel.fetch())
			}	
			
			var deferred = $.Deferred();
			//retrieve bookings and tasks associated (use domain ('project_id','in',[...] to retrieve tasks associated)
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