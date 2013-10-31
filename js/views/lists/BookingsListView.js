/******************************************
* Bookings List View
*/
app.Views.BookingsListView = app.Views.GenericListView.extend({

	templateHTML: 'bookings',

	collections:  {},

	// The DOM events //
	events: function(){
		return _.defaults({
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
			self.collections.bookings.off();
			self.listenTo(self.collections.bookings, 'add',self.add);
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


		var bookings = this.collections.bookings.toJSON();

		// Retrieve the HTML template //
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang                   : app.lang,
				bookings          : bookings,
			});


			$(self.el).html(template);
			
			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);
			
			// Create item intervention view //
			_.each(self.collections.bookings.models, function(booking, i){
				var itemBookingView = new app.Views.ItemBookingView({model: booking});
				$('#booking-items').append(itemBookingView.render().el);				
			});
			
			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page       : self.options.page.page,
				collection : self.collections.bookings
			})
			
		});
		$(this.el).hide().fadeIn();
		return this;
	},

	initCollections: function(){
		var self = this;
		
		// Check if the collections are instantiated //
		if(_.isUndefined(this.collections.bookingLines)){ this.collections.bookingLines = new app.Collections.BookingLines(); }
		else{this.collections.bookingLines.reset();}
		
		if(_.isUndefined(this.collections.bookings)){this.collections.bookings = new app.Collections.Bookings();}
		else{this.collections.bookings.reset();}
		
		//check sort parameter
		if(_.isUndefined(this.options.sort)){
			this.options.sort = this.collections.bookings.default_sort;
		}
		else{
			this.options.sort = app.Helpers.Main.calculPageSort(this.options.sort);	
		}
		
		
		// Construction of the domain (filter and search, special domain if filter == overrun)
		var domain = [];
		var optionSearch = {};
		//Retrieve search domain given by search box and / or by filter
		if(!_.isUndefined(this.options.search)){
			// Collection Filter if not null //
			optionSearch.search = this.options.search;
		}
		if(!_.isUndefined(this.options.filter) && !_.isNull(this.options.filter)){
			this.options.filter = app.Helpers.Main.calculPageFilter(this.options.filter);

		}
		//'Unbuild' domain objectify to be able to add other filters (and objectify when all filters are added
		var searchDomain = app.Helpers.Main.calculSearch(optionSearch, app.Models.Intervention.prototype.searchable_fields);
		_.each(searchDomain,function(item, index){
			domain.push(item);
		});	
		
		this.options.page = app.Helpers.Main.calculPageOffset(this.options.page);

		// Create Fetch params //
		var fetchParams = {
			silent : true,
			data   : {
				limit  : app.config.itemsPerPage,
				offset : this.options.page.offset,
				filters: app.objectifyFilters(domain)
			}
		};
		if(!_.isUndefined(this.options.sort)){
			fetchParams.data.sort = this.options.sort.by+' '+this.options.sort.order;
		}
		
		fetchParams.data.fields = this.collections.bookings.fields;
		
		var deferred = $.Deferred();
		//retrieve bookings and tasks associated (use domain ('project_id','in',[...] to retrieve tasks associated)
		this.collections.bookings.fetch(fetchParams)
		.done(function(){
			deferred.resolve();
		})
		.fail(function(e){
			console.error(e);
		})
		
		return deferred;
	}
  
});