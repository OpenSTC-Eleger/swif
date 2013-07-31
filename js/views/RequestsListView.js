/******************************************
* Requests List View
*/
app.Views.RequestsListView = app.Views.GenericListView.extend({

	templateHTML: 'requestsList',

	filters: 'requestsListFilter',



	// The DOM events //
	events: function(){
		return _.defaults({
			'change #requestService' 				: 'filterCategory',

			'submit #formValidRequest' 				: 'validRequest',
			'submit #formRefuseRequest' 			: 'refuseRequest',
			'submit #formConfirmDSTRequest' 		: 'confirmDSTRequest',

			'change #createAssociatedTask' 			: 'accordionAssociatedTask',

			'click #filterStateRequestList li:not(.disabled) a' 	: 'setFilter'
		}, 
			app.Views.GenericListView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize: function () {
		var self = this;

		this.initCollection().done(function(){
			// Unbind & bind the collection //
			self.collection.off();
			self.listenTo(self.collection, 'add', self.add);

			app.router.render(self);
		});
	},



	/** Display the view
	*/
	render: function () {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.requestsList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		// Retrieve the template //
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang: app.lang,
				nbRequests: self.collection.cpt
			});

			$(self.el).html(template);


			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);


			// Create item request view //
			_.each(self.collection.models, function(request, i){
				var itemRequestView = new app.Views.ItemRequestView({model: request});
				$('#rows-items').append(itemRequestView.render().el);
			});


			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page       : self.options.page.page,
				collection : app.collections.requests
			})
			app.views.paginationView.render();

		});

		$(this.el).hide().fadeIn();

		return this;
	},



	/** Display informations about the request in the Modal view
	*/
	setInfoModal: function(e){

		var btn = $(e.target);

		// Retrieve the ID of the request //
		this.pos = btn.parents('tr').attr('id');
		this.model = app.collections.requests.get(this.pos);
		this.selectedRequest = this.model.toJSON();


		if(btn.hasClass("buttonValidRequest")){
			$('#requestName').val(this.selectedRequest.name);
			$('#infoModalValidRequest').children('small').html(this.selectedRequest.description);
			
			//search no technical services
			var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
				return service.attributes.technical != true 
			});

			// Remove no technical services //
			app.collections.claimersServices.remove(noTechnicalServices);
			
			app.views.selectServicesView = new app.Views.DropdownSelectListView({el: $("#requestService"), collection: app.collections.claimersServices})
			app.views.selectServicesView.clearAll();
			app.views.selectServicesView.addEmptyFirst();
			app.views.selectServicesView.addAll();
			if( this.selectedRequest.service_id )
				app.views.selectServicesView.setSelectedItem( this.selectedRequest.service_id[0] );

			
			app.views.selectAssignementsView = new app.Views.DropdownSelectListView({el: $("#requestAssignement"), collection: app.collections.categoriesInterventions})
			app.views.selectAssignementsView.clearAll();
			app.views.selectAssignementsView.addEmptyFirst();
			app.views.selectAssignementsView.addAll();

			
			$('#requestNote').val(this.selectedRequest.description);

			// Set the current date to the input date Deadline //
			$('#requestDeadline').val(moment().format("L"));
			
			// Enable the datePicker //
			$('.datePicker').datepicker({
				format: 'dd/mm/yyyy',
				weekStart: 1,
				autoclose: true,
				language: 'fr'
			});

			// Filter Task category //
			this.filterCategory();

		}
		else if(btn.hasClass('buttonRefusedRequest')){
			$('#infoModalRefusedRequest').children('p').html(this.selectedRequest.name);
			$('#infoModalRefusedRequest').children('small').html(this.selectedRequest.description);
		}
		else if(btn.hasClass('buttonConfirmRequest')){
			$('#infoModalConfirmDST').children('p').html(this.selectedRequest.name);
			$('#infoModalConfirmDST').children('small').html(this.selectedRequest.description);
		}
		
	},



	/** Valid the request
	*/
	validRequest: function(e){
		e.preventDefault();

	    var duration = $("#taskHour").val().split(":");
	    var mDuration = moment.duration ( { hours:duration[0], minutes:duration[1] });

		params = {
				//ask_id: this.model.getId(),	

				request_state: app.Models.Request.status.valid.key,
				email_text: app.Models.Request.status.valid.translation,
				project_state: app.Models.Intervention.status.open.key,
				date_deadline: new moment($('#requestDateDeadline').val(), 'DD-MM-YYYY').add('hours',2).toDate(),
				description: $('#requestNote').val(),
				intervention_assignement_id: $('#requestAssignement').val(),
				service_id: $('#requestService').val(),	
				site1: this.model.getSite1()[0],
				planned_hours: mDuration.asHours(),
				category_id: _($('#taskCategory').val()).toNumber(),
				create_task: $('#createAssociatedTask').is(':checked'),
		};

	    this.model.valid(params,
			{
				success: function(data){
					$('#modalValidRequest').modal('hide');
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
				}
			}
		);
	},



	/** Refuse the request
	*/
	refuseRequest: function(e){
		e.preventDefault();

		params = {
		        state: app.Models.Request.status.refused.key,
		        email_text: app.Models.Request.status.refused.translation,
		        refusal_reason: $('#motifRefuse').val(),		
		};		
		this.saveNewState( params,$('#modalRefusedRequest') );
	},



	/** Set the request state to Confirm DST
	*/
	confirmDSTRequest: function(e){
		e.preventDefault();
		params = {
		        state: app.Models.Request.status.confirm.key,
		        email_text: app.Models.Request.status.confirm.translation,
		        note: $('#motifDST').val(),		
		};
		this.saveNewState( params, $('#modalConfirmRequest') );

	},



	saveNewState: function(params, element) {
		var self = this;
		self.element = element;
		self.params = params
		this.model.save(params, {
		    success: function (data) {
			        console.log(data);
			        if(data.error){
			    		app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
			        }
			        else{
			           	console.log('NEW STATE REQUEST SAVED');
			            if( self.element!= null )
			            	self.element.modal('hide');
			            self.model.update(params);

			            route = Backbone.history.fragment;
						Backbone.history.loadUrl(route);
			        }
			    },
			    error: function () {
					console.error('ERROR - Unable to valid the Request - RequestsListView.js');
			    },           
			},false);
	},



	/** Filter Requests
	*/
	setFilter: function(event){
		event.preventDefault();

		var link = $(event.target);

		var filterValue = _(link.attr('href')).strRightBack('#');

		// Set the filter in the local Storage //
		if(filterValue != 'delete-filter'){
			sessionStorage.setItem(this.filters, filterValue);
		}
		else{
			sessionStorage.removeItem(this.filters);
		}

		if(this.options.page <= 1){
			this.render();
		}
		else{
			app.router.navigate(app.routes.requestsInterventions.baseUrl, {trigger: true, replace: true});
		}
		
	},



	/** Display or Hide Create associated Task Section
	*/
	accordionAssociatedTask: function(event){
		event.preventDefault();

		// Toggle Slide Create associated task section //
		$('fieldset.associated-task').stop().slideToggle(function(){
			$('#modalValidRequest div.modal-body').animate({scrollTop: $('#modalValidRequest div.modal-body').height()}, 400);
		});
	},



	/** Filter Task category
	*/
	filterCategory: function(e){
	    
	    // Retrieve the Request Intervention Service //
	    var requestServiceID = _($('#requestService').val()).toNumber();

        
        // Display only categories in dropdown belongs to intervention //
        var categoriesTasksFiltered = _.filter(app.collections.categoriesTasks.models, function(item){ 
			var services = [];
	        _.each( item.attributes.service_ids.models, function(service){
	        	services.push( service.toJSON().id );
	        });
        	return ($.inArray(requestServiceID, services)!=-1);
		});
		
		var collectionFilter = _.clone(app.collections.categoriesTasks);

		app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), collection: collectionFilter.reset(categoriesTasksFiltered) });			
		app.views.selectListAssignementsView.clearAll();
		app.views.selectListAssignementsView.addEmptyFirst();
		app.views.selectListAssignementsView.addAll();	
	        
	},




	initCollection: function(){
		var self = this;

		
		this.options.sort = app.calculPageSort(this.options.sort);
		this.options.page = app.calculPageOffset(this.options.page);



		// Check if the collections is instantiate //
		if(_.isUndefined(app.collections.requests)){ app.collections.requests = new app.Collections.Requests(); }
		this.collection = app.collections.requests;

		
		// Create Fetch params //
		var fetchParams = {
			silent      : true,
			limitOffset : {limit: app.config.itemsPerPage, offset: this.options.page.offset},
			sortBy      : this.options.sort.by+' '+this.options.sort.order
		};
		if(!_.isUndefined(this.options.search)){
			fetchParams.search = app.calculSearch(this.options.search);
		}


		var deferred = $.Deferred();

		// Fetch the collections //
		app.loader('display');
		$.when(
			self.collection.fetch(fetchParams)
		)
		.done(function(){
			deferred.resolve();
		})
		.fail(function(e){
			console.error(e);
		})
		.always(function(){
			app.loader('hide');
		});

		return deferred;

	},

});