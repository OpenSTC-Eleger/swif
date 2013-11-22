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
	'modalValidBookingsListView'

], function(app, AppHelpers, BookingsCollection, BookingModel, BookingRecurrenceModel, GenericListView, PaginationView, ItemBookingView, ItemBookingOccurrencesListView, ModalValidBookingsListView){

	'use strict';


	/******************************************
	* Bookings List View
	*/
	var bookingsListView = GenericListView.extend({
	
		templateHTML: 'lists/bookingsList',
		
		urlParameters : ['recurrence', 'id', 'search', 'filter', 'sort', 'page'],
	
		collections:  {},
		
		//searchReccurent    : 'form.form-search input',
		actionsForm    : 'form.form-actions',
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'click #filterStateBookingList li a' 	: 'setFilterState',	
				'click #badgeActions[data-filter!=""]'  : 'badgeFilter',
				'click .btn-info'             		: 'unbindOccurences',
				'click .btn-success'             	: 'validOccurences',
				'click .btn-danger'             		: 'refuseOccurences',
				
			}, 
				GenericListView.prototype.events
			);
		},
	
	
	
		/** View Initialization
		*/
		initialize : function(params) {
			var self = this;
	
			this.options = params;
	
	
			this.initCollections().done(function(){
				app.router.render(self);
				// Unbind & bind the collection //
				self.collection.off();
				self.listenTo(self.collection, 'add',self.add);
			});
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
					$(self.actionsForm).addClass('hide');				
				}
				else{				
					$(self.actionsForm).removeClass('hide');
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
	
		
		/** valid occurences booking
		*/
		validOccurences: function(e){
			e.preventDefault();
			var self = this;	
			
			//var booking = this.model.toJSON();
			console.debug('Valid occurences');
			
			e.preventDefault(); e.stopPropagation();
	
			var model = new BookingRecurrenceModel({id: this.options.recurrence });
			
			var deferred = $.Deferred();
			model.fetch().done(function(){
				app.views.modalValidBookingsListView = new ModalValidBookingsListView({
					el      : '#modalValidBookingsList',
					model   : model
				});
				deferred.resolve();
			})
			.fail(function(e){
				console.error(e);
			})
			
			return deferred;
	
	
		},
		
		/** valid occurences booking
		*/
		refuseOccurences: function(e){
			e.preventDefault();
			var self = this;	
			
			//var booking = this.model.toJSON();
			console.debug('refuse occurences');
	
		},
		
		/** unbind occurences 
		*/
		unbindOccurences: function(e){
			e.preventDefault();
			var self = this;	
			
			delete this.options.recurrence
			
			app.router.navigate(app.views.bookingsListView.urlBuilder(), {trigger: true, replace: true});
	
			//var booking = this.model.toJSON();
			console.debug('unbind occurences');
	
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
					//sort   : this.options.sort.by+' '+this.options.sort.order
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
				fetchParams.data.filters.push({ 'field' : 'recurrence_id.id', 'operator' : '=', 'value' : this.options.recurrence})
			}
			
	
			
			var deferred = $.Deferred();
			//retrieve bookings and tasks associated (use domain ('project_id','in',[...] to retrieve tasks associated)
			this.collection.fetch(fetchParams)
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