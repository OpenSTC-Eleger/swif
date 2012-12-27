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

		'click a.modalDeletePlace'  	: 'setInfoModal',

		'submit #formAddPlace' 			: "addPlace", 
		'click button.btnDeletePlace'  	: 'deletePlace'
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



    /** Display information in the Modal view
    */
    setInfoModal: function(e){
        
        // Retrieve the ID of the intervention //
        var link = $(e.target);

        var id = _(link.parents('tr').attr('id')).strRightBack('_');
        
        this.selectedPlace = _.filter(app.collections.places.models, function(item){ return item.attributes.id == id });
        this.selectedPlace = this.selectedPlace[0].toJSON();

        $('#infoModalDeletePlace p').html(this.selectedPlace.name);
        $('#infoModalDeletePlace small').html(this.selectedPlace.service[1]);
    },



    /** Add a new place
    */
    addPlace: function(e){
        e.preventDefault();

        alert('TODO: save the new place');

    },



    /** Delete the selected place
    */
    deletePlace: function(e){
        
  		alert('TODO: delete place with id '+ this.selectedPlace.id);

    },



    preventDefault: function(event){
    	event.preventDefault();
    },

});