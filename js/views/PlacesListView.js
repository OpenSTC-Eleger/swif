/******************************************
* Places List View
*/
app.Views.PlacesListView = Backbone.View.extend({

	el            : '#rowContainer',

	templateHTML  : 'places',

	selectedPlace : '',


	// The DOM events //
	events: {
		'click ul.sortable li'			: 'preventDefault',

		'click table.table-sorter th[data-column]' : 'sort',

		'click a.modalDeletePlace'  	: 'modalDeletePlace',
		'click button.btnDeletePlace'	: 'deletePlace',
			
		'click a.modalSavePlace'	  	: 'modalSavePlace',
		'submit #formSavePlace' 		: "savePlace"
	},



	/** View Initialization
	*/
	initialize: function () {

	},


	/** Display the view
	*/
	render: function () {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.placesList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		var places = app.collections.places;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang: app.lang,
				places: places.toJSON(),
				nbPlaces: app.collections.places.cpt,
			});

			$(self.el).html(template);

			$('*[data-toggle="tooltip"]').tooltip();
			
			$('#placeServices, #servicesList').sortable({
				connectWith: 'ul.sortableServicesList',
				dropOnEmpty: true,
				forcePlaceholderSize: true,
				forceHelperSize: true,
				placeholder: 'sortablePlaceHold',
				containment: '.servicesDroppableArea',
				cursor: 'move',
				opacity: '.8',
				revert: 300,
				receive: function(event, ui){
					self.updateSites( );
				}
			});


			// Advance Select List View //
			app.views.advancedSelectBoxPlaceTypeView = new app.Views.AdvancedSelectBoxView({el: $("#placeType"), model: app.Models.PlaceType.prototype.model_name })
			app.views.advancedSelectBoxPlaceTypeView.render();

			app.views.advancedSelectBoxPlaceParentView = new app.Views.AdvancedSelectBoxView({el: $("#placeParentPlace"), model: app.Models.Place.prototype.model_name })
			app.views.advancedSelectBoxPlaceParentView.render();


			// Display sort icon if there is a sort //
			if(self.options.sort.order == 'ASC'){ var newIcon = "icon-sort-up"; }else{ var newIcon = "icon-sort-down"; }
			$("th[data-column='"+self.options.sort.by+"'] > i").removeClass('icon-sort icon-muted')
			.addClass('active ' + newIcon);




			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page   : self.options.page,
				nbPage : Math.ceil(app.collections.places.cpt / app.config.itemsPerPage) 
			})
			app.views.paginationView.render();

		});

		$(this.el).hide().fadeIn('slow');

		return this;
	},




	/** Display user services 
	*/
	displayServices: function(e){
		e.preventDefault();
	
		// Retrieve the ID of the intervention //
		var link = $(e.target);
		var id = _(link.parents('tr').attr('id')).strRightBack('_');
		
		// Clear the list of the user //
		$('#placeServices li, #servicesList li').remove();
	
		var placeServices = new Array();
		if( id ) {
			this.selectedPlace = _.filter(app.collections.places.models, function(item){ return item.attributes.id == id });
			var selectedPlaceJson = this.selectedPlace[0].toJSON();	
			
			// Display the services of the team //
			_.each(selectedPlaceJson.service_ids, function (service, i){
				$('#placeServices').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
				placeServices[i] = service.id;
			});
		};

		//search no technical services
		var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
			return service.attributes.technical != true 
		});
		//remove no technical services
		app.collections.claimersServices.remove(noTechnicalServices);
		app.collections.claimersServices.toJSON()
	
		// Display the remain services //
		_.filter(app.collections.claimersServices.toJSON(), function (service, i){ 
			if(!_.contains(placeServices, service.id)){
				$('#servicesList').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
			}
		});
	
		var nbRemainServices = $('#servicesList li').length;
		$('#badgeNbServices').html(nbRemainServices);
		
	},



	getIdInDopDown: function(view) {
		if ( view && view.getSelected() )
			return view.getSelected().toJSON().id;
		else 
			return 0
	},



	setModel: function(e) {
	
		this.model = null;
		this.selectedPlaceJson = null;
		
		e.preventDefault();
		this.displayServices(e);
		var link = $(e.target);
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');
		this.selectedPlace = _.filter(app.collections.places.models, function(item){ return item.attributes.id == id });
		if( this.selectedPlace.length>0 ) {
			this.model = this.selectedPlace[0];
			this.selectedPlaceJson = this.model.toJSON();        
		}
	},



	/** Add a new categorie
	*/
	modalSavePlace: function(e){  
		this.setModel(e);	
		
		if( this.selectedPlaceJson ) {
			$('#placeName').val(this.selectedPlaceJson.name);
			
			if( this.selectedPlaceJson.type )
				app.views.advancedSelectBoxPlaceTypeView.setSelectedItem(this.selectedPlaceJson.type);
			if( this.selectedPlaceJson.site_parent_id )
				app.views.advancedSelectBoxPlaceParentView.setSelectedItem(this.selectedPlaceJson.site_parent_id);
			
			$('#placeWidth').val(this.selectedPlaceJson.width);
			$('#placeLenght').val(this.selectedPlaceJson.lenght);
			$('#placeArea').val(this.selectedPlaceJson.surface);			
		}
		else {
			$('#placeName, #placeWidth, #placeLenght, #placeArea').val('');
			app.views.advancedSelectBoxPlaceTypeView.reset();
			app.views.advancedSelectBoxPlaceParentView.reset();
		}   

	},



	/** Save the place
	*/
	savePlace: function (e) {


		e.preventDefault();


		var self = this;

	 
		this.services = _.map($("#placeServices").sortable('toArray'), function(service){ return _(_(service).strRightBack('_')).toNumber(); });     


		this.params = {	
			name: this.$('#placeName').val(),
			service_ids: [[6, 0, this.services]],
			type: app.views.advancedSelectBoxPlaceTypeView.getSelectedItem(),
			site_parent_id: app.views.advancedSelectBoxPlaceParentView.getSelectedItem(),
			width: this.$('#placeWidth').val(),
			lenght: this.$('#placeLenght').val(),
			surface: this.$('#placeArea').val(),
		};

		this.modelId = this.selectedPlaceJson==null?0: this.selectedPlaceJson.id;
		var self = this;
		
		app.Models.Place.prototype.save(
			this.params, 
			this.modelId, {
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					$('#modalSavePlace').modal('hide');
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
					console.log('Success SAVE PLACE');
				}
			},
			error: function () {
				console.log('ERROR - Unable to save the Place');
			},	
		});
	},



	/** Display information in the Modal view
	*/
	modalDeletePlace: function(e){

		this.setModel(e);

		$('#infoModalDeletePlace p').html(this.selectedPlaceJson.name);
		$('#infoModalDeletePlace small').html(this.selectedPlaceJson.type[1]);
	},



	/** Delete the selected place
	*/
	deletePlace: function(e){
		//e.preventDefault();
		var self = this;
		this.model.delete({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.places.remove(self.model);
					$('#modalDeletePlace').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.placeDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer le site");
			}

		});    
	},



	/** Update possible parent site belongs to services selected
	*/
	updateSites: function ( ) {
		//Selected services in list choice
		var services = _.map($("#placeServices").sortable('toArray'), function(service){ return _(_(service).strRightBack('_')).toNumber()});
		
		var self = this;
		this.placesFiltered = []
		places = app.collections.places.models;
		
		//for each selected service
		_.each(services, function( service ) {
			//keep only places belongs to service
			self.currentService = service;		
			keepedPlaces = _.filter(places, function(item){ 
				var placeJSON = item.toJSON();
				var placeServices = placeJSON.service_ids;	
				var placeServices = [];
				_.each( item.attributes.service_ids.models, function(s){
					placeServices.push( s.toJSON().id );
				});				
				return $.inArray(self.currentService, placeServices)!=-1
			});
			self.placesFiltered = _.union( self.placesFiltered , keepedPlaces );	
		});

	},



	sort: function(e){

		if(!$(e.target).is('i')){
			var sortBy = $(e.target).data('column');
		}
		else{
			var sortBy = $(e.target).parent('th').data('column');	
		}

		// Retrieve the current Sort //
		var currentSort = this.options.sort;


		// Calcul the sort Order //
		var sortOrder = '';
		if(sortBy == currentSort.by){
			if(currentSort.order == 'ASC'){
				sortOrder = 'DESC';
			}
			else{
				sortOrder = 'ASC';
			}
		}
		else{
			sortOrder = 'ASC';
		}

		app.router.navigate(app.routes.places.baseUrl+'/sort/'+sortBy+'-'+sortOrder, {trigger: true, replace: true});
	},



	preventDefault: function(event){
		event.preventDefault();
	},

});