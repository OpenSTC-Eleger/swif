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
    	e.preventDefault();
    	var link = $(e.target);
    	var id =  _(link.parents('tr').attr('id')).strRightBack('_');
        this.selectedPlace = _.filter(app.collections.places.models, function(item){ return item.attributes.id == id });
        if( this.selectedPlace.length>0 ) {
        	this.model = this.selectedPlace[0];
        	this.selectedPlaceJson = this.model.toJSON();        
        }
        else {
        	app.notify('', 'error', app.lang.infoMessages.information, app.lang.infoMessages.placeDeleteNOk);
        }
        
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
			success: function(e){
				app.collections.places.remove(self.model);
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