/******************************************
* Places List View
*/
app.Views.PlacesView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'places',

	numberListByPage: 25,

	selectedPlace : '',


    // The DOM events //
    events: {
    	'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',

		'click a.modalDeletePlace'  	: 'modalDeletePlace',		
		'click a.modalSavePlace'  		: 'modalSavePlace',

		'submit #formAddPlace' 			: "savePlace", 
		'click button.btnDeletePlace'	: 'deletePlace'
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


		var places = app.collections.places.models;
		var nbPlaces = _.size(places);

		console.debug(places);


		var len = places.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				places: app.collections.places.toJSON(),
				lang: app.lang,
				nbPlaces: nbPlaces,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});

			$(self.el).html(template);
		});

		$(this.el).hide().fadeIn('slow');

		return this;
    },

    setModel: function(e) {
    	var link = $(e.target);
    	var id =  _(link.parents('tr').attr('id')).strRightBack('_');
        this.selectedPlace = _.filter(app.collections.places.models, function(item){ return item.attributes.id == id });
        this.model = this.selectedPlace[0];
        this.selectedPlaceJson = this.model.toJSON();
    },

    /** Display information in the Modal view
    */
    modalDeletePlace: function(e){    	
        this.setModel(e);
        $('#infoModalDeletePlace p').html(selectedPlaceJson.name);
        $('#infoModalDeletePlace small').html(selectedPlaceJson.service[1]);
    },



    /** Add a new place
    */
    modalSavePlace: function(e){
		e.preventDefault();
		alert('TODO: save the new place');
		
		this.setModel(e);
		

		
		
		
		$('#modalSavePlace .placeName').html(this.selectedPlaceJson.name);
		$('#placeType').html(this.selectedPlaceJson.type[1]);		
		$('#placeService').html(this.selectedPlaceJson.service[1]);
		$('#placeParentPlace').html(this.selectedPlaceJson.site_parent_id[1]?"":this.selectedPlaceJson.site_parent_id[1]);		
		$('#placeWidth').html(this.selectedPlaceJson.width);
		$('#placeLenght').html(this.selectedPlaceJson.lenght);
		$('#placeArea').html(this.selectedPlaceJson.surface);
		
		$('#modalSavePlace').modal();
	},
	
	
	/** Save  place
	*/
	savePlace: function(e) {		     
//    	e.preventDefault();
//
//	     var self = this;
//	     
//	     input_service_id = null;
//	     if ( app.views.selectListServicesView )
//	    	 input_service_id = app.views.selectListServicesView.getSelected().toJSON().id;
//	     
//	     var params = {	
//		     name: this.$('#placeName').val(),
//		     type: this.$('#placeType').val(),
//		     date_deadline: this.$('#interventionDateDeadline').val(),
//		     service_id: input_service_id,
//		     site1: this.$('#interventionPlace').val(),
//		     site_details: this.$('#interventionPlacePrecision').val(),
//	     };
//
//	    this.model.save(params,{
//			success: function (data) {
//				console.log(data);
//				if(data.error){
//					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
//				}
//				else{
//					app.router.navigate('#interventions' , true);
//					console.log('Success SAVE INTERVENTION');
//				}
//			},
//			error: function () {
//				console.log('ERROR - Unable to save the Intervention - InterventionDetailsView.js');
//			},	     
//		});
	},



	/** Delete the selected place
	*/
	deletePlace: function(e){
		var self = this;
		this.selectedPlace[0].delete({
			success: function(e){
				app.collections.places.remove(self.selectedPlace[0]);
				$('#modalDeletePlace').modal('hide');
				app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.placeDeleteOk);
				self.render();
			},
			error: function(e){
				alert("Impossible de supprimer le site");
			}

		});
	},



    preventDefault: function(event){
    	event.preventDefault();
    },

});