/******************************************
 * place Details View
 */
app.Views.PlaceView = Backbone.View.extend({

	el : '#rowContainer',
	
	templateHTML: 'placeDetails',

	
	// The DOM events //
	events: {
		'submit #formPlace'			: 'savePlace',
		'change #placeService'		: 'fillDropdownService',
	},



	/** View Initialization
	 */
	initialize: function (model) {
	    this.model = model;
    },



    /** Display the view
    */
    render: function () {
		

		// Change the page title depending on the create value //
		if(this.create){
			app.router.setPageTitle(app.lang.viewsTitles.newPlace);
		}
		else{
			app.router.setPageTitle(app.lang.viewsTitles.placeDetail + 'n° ' + this.model.id);
			console.debug(this.model);
		}

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);
		
		
		//self.collection = this.collection;
		var self = this;
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
				
				var template = _.template(templateData, {lang: app.lang, place: self.model.toJSON()});
				$(self.el).html(template);		     


				app.views.selectListPlaceTypesView = new app.Views.DropdownSelectListView({el: $("#placeType"), collection: app.collections.placetypes})
				app.views.selectListPlaceTypesView.clearAll();
				app.views.selectListPlaceTypesView.addEmptyFirst();
				app.views.selectListPlaceTypesView.addAll();	
				

				app.views.selectListServicesView = new app.Views.DropdownSelectListView({el: $("#placeService"), collection: app.collections.claimersServices})
				app.views.selectListServicesView.clearAll();
				app.views.selectListServicesView.addEmptyFirst();
				app.views.selectListServicesView.addAll();
				
				app.views.selectListPlacesView = new app.Views.DropdownSelectListView({el: $("#placeParentPlace"), collection: app.collections.places})
				app.views.selectListPlacesView.clearAll();
				app.views.selectListPlacesView.addEmptyFirst();
				app.views.selectListPlacesView.addAll();
				
				this.selectedPlaceJson = self.model.toJSON();
				if( this.selectedPlaceJson ) {
					$('#placeName').val(this.selectedPlaceJson.name);
					
					if( this.selectedPlaceJson.type )
						app.views.selectListPlaceTypesView.setSelectedItem( this.selectedPlaceJson.type[0] );	
					if( this.selectedPlaceJson.service )
						app.views.selectListServicesView.setSelectedItem( this.selectedPlaceJson.service[0] );	
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
	
		});

		$(this.el).hide().fadeIn('slow'); 
		return this;
    },
    

    getIdInDopDown: function(view) {
    	if ( view && view.getSelected() )
    		return view.getSelected().toJSON().id;
    	else 
    		return 0
    },

	/** Save the place
	 */
    savePlace: function (e) {
		 e.preventDefault();
		 
	     var self = this;
	     
	     var input_type_site_id = this.getIdInDopDown(app.views.selectListPlaceTypesView);
	     var input_service_id = this.getIdInDopDown(app.views.selectListServicesView);
	     var input_site_id = this.getIdInDopDown(app.views.selectListPlacesView);
	     
	     var params = {	
		     name: this.$('#placeName').val(),
		     type: input_type_site_id,
		     service: input_service_id,
		     site_parent_id: input_site_id,
		     width: this.$('#placeWidth').val(),
		     lenght: this.$('#placeLenght').val(),
		     surface: this.$('#placeArea').val(),
	     };		     
	   
	    this.model.create(params,{
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.router.navigate('#sites' , true);
					console.log('Success SAVE PLACE');
				}
			},
			error: function () {
				console.log('ERROR - Unable to save the Intervention - InterventionView.js');
			},	
	    });
    },
	
	renderService: function ( service ) {
		if( service!= null ) {
			app.views.selectListServicesView.setSelectedItem( service );
			places = app.collections.places.models;
			var placesFiltered = _.filter(places, function(item){ 
				return item.attributes.service[0] == service; 
	        });
			app.views.selectListPlacesView.collection = new app.Collections.Places(placesFiltered);
			app.views.selectListPlacesView.clearAll();
			app.views.selectListPlacesView.addEmptyFirst();
			app.views.selectListPlacesView.addAll();
			
		}
	},
	 
	fillDropdownService: function(e){
		e.preventDefault();
		$('#placeParentPlace').val('');
		this.renderService($(e.target).attr('value'));
	},


});

