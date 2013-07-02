/******************************************
* Places List View
*/
app.Views.PlacesListView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'places',

	numberListByPage: 25,

	selectedPlace : '',


	// The DOM events //
	events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',
		'click ul.sortable li'			: 'preventDefault',
		
//		'change #placeService'			: 'fillDropdownService',

		'click a.modalDeletePlace'  	: 'modalDeletePlace',
		'click button.btnDeletePlace'	: 'deletePlace',
			
		'click a.modalSavePlace'	  	: 'modalSavePlace',
		'submit #formSavePlace' 		: "savePlace", 

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
				page: self.options.page, 
				pageCount: Math.ceil(app.collections.places.cpt / app.config.itemsPerPage)
			});
			
			$(self.el).html(template);
			
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
		});

		$(this.el).hide().fadeIn('slow');

		return this;
	},



	loadDropDownList: function() {
		app.views.selectListPlaceTypesView = new app.Views.DropdownSelectListView({el: $("#placeType"), collection: app.collections.placetypes})
		app.views.selectListPlaceTypesView.clearAll();
		app.views.selectListPlaceTypesView.addEmptyFirst();
		app.views.selectListPlaceTypesView.addAll();	

		
		app.views.selectListPlacesView = new app.Views.DropdownSelectListView({el: $("#placeParentPlace"), collection: app.collections.places})
		app.views.selectListPlacesView.clearAll();
		app.views.selectListPlacesView.addEmptyFirst();
		app.views.selectListPlacesView.addAll();
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
		this.loadDropDownList();
		
		if( this.selectedPlaceJson ) {
			$('#placeName').val(this.selectedPlaceJson.name);
			
			if( this.selectedPlaceJson.type )
				app.views.selectListPlaceTypesView.setSelectedItem( this.selectedPlaceJson.type[0] );
			if( this.selectedPlaceJson.site_parent_id )
				app.views.selectListPlacesView.setSelectedItem( this.selectedPlaceJson.site_parent_id[0] );
			
			$('#placeWidth').val(this.selectedPlaceJson.width);
			$('#placeLenght').val(this.selectedPlaceJson.lenght);
			$('#placeArea').val(this.selectedPlaceJson.surface);			
		}
		else {
			$('#placeName').val('');
			$('#placeWidth').val('');
			$('#placeLenght').val('');
			$('#placeArea').val('');
		}   

	},



	/** Save the place
	*/
	savePlace: function (e) {
		 e.preventDefault();
		 
		 var self = this;
		 
		 var input_type_site_id = this.getIdInDopDown(app.views.selectListPlaceTypesView);
		 var input_site_id = this.getIdInDopDown(app.views.selectListPlacesView);
		 
		 this.services = _.map($("#placeServices").sortable('toArray'), function(service){ return _(_(service).strRightBack('_')).toNumber(); });     

		 
		 this.params = {	
			 name: this.$('#placeName').val(),
			 type: input_type_site_id,
			 service_ids: [[6, 0, this.services]],
			 site_parent_id: input_site_id,
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
				console.log('ERROR - Unable to save the Intervention - InterventionView.js');
			},	
		});
	},



	/** Display information in the Modal view
	*/
	modalDeletePlace: function(e){    
		
		this.setModel(e);
		$('#infoModalDeletePlace p').html(this.selectedPlaceJson.name);
		$('#infoModalDeletePlace small').html(this.selectedPlaceJson.service[1]);
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
		
		//fill in list for parent site input
		app.views.selectListPlacesView.collection = new app.Collections.Places(this.placesFiltered);
		app.views.selectListPlacesView.clearAll();
		app.views.selectListPlacesView.addEmptyFirst();
		app.views.selectListPlacesView.addAll();
	},



	preventDefault: function(event){
		event.preventDefault();
	},

});