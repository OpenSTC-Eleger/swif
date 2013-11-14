/******************************************
* Bookings List View
*/
app.Views.BookingsListView = app.Views.GenericListView.extend({

	templateHTML: 'bookings',
	
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
			app.Views.GenericListView.prototype.events
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
		//app.router.setPageTitle(app.lang.viewsTitles.bookingsMonitoring);

		// Change the active menu item //
		//app.views.headerView.selectMenuItem(app.router.mainMenus.manageBookings);


		
		// Retrieve the HTML template //
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang             : app.lang,
				bookings         : self.collection,
				nbBookings       : self.collection.specialCpt,				
				bookingsState    : app.Models.Booking.status,
			});


			$(self.el).html(template);
			

			
			
			//$('#switch-reccurent').bootstrapSwitch();			

			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);
			
			// Create item intervention view //
			_.each(self.collection.models, function(booking, i){
				var detailedView = null;
				if( booking.isTemplate() )
					detailedView = new app.Views.ItemBookingOccurrenceListView({model: booking});
				var simpleView = new app.Views.ItemBookingView({model: booking });
				$('#booking-items').append(simpleView.render().el);	
				if( booking.isTemplate() )
					$('#booking-items').append(detailedView.render().el);
				simpleView.detailedView = detailedView;	
			});
			
			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
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
//		e.preventDefault();
//		var self = this;	
		
		//var booking = this.model.toJSON();
		console.debug('Valid occurences');
		
		e.preventDefault(); e.stopPropagation();

		app.views.modalValidBookingsListView = new app.Views.modalValidBookingsListView({
			el      : '#modalValidBookingsList',
			model   : this.collection
		});

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
	
//	search: function(e){
//		e.preventDefault();
//		delete this.options.recurrence
//		
//		app.Views.GenericListView.prototype.search.call(this, e);
//		//app.Views.BookingsListView.__super__.search(e);
//		
//	},



//	/** Sort the row of the table
//	*/
//	sort: function(e){
//		sessionStorage.removeItem('reccurent');
//		app.Views.GenericListView.prototype.search.call(this, e);
//		//app.Views.BookingsListView.__super__.search(e);
//
//	},
	

	initCollections: function(){
		var self = this;
		
		// Check if the collections are instantiated //
		if(_.isUndefined(this.collection)){ this.collection = new app.Collections.Bookings(); }
		else{this.collection.reset();}
		


		this.options.page = app.Helpers.Main.calculPageOffset(this.options.page);

		if(!_.isUndefined(this.options.filter)){
			this.options.filter = app.Helpers.Main.calculPageFilter(this.options.filter);
		}

		if(_.isUndefined(this.options.sort)){
			this.options.sort = this.collection.default_sort;
		}
		else{
			this.options.sort = app.Helpers.Main.calculPageSort(this.options.sort);	
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
			fetchParams.data.filters = app.Helpers.Main.calculSearch(globalSearch, app.Models.Booking.prototype.searchable_fields);
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