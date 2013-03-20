/******************************************
* Claimers List View
*/
app.Views.CartoInterView = Backbone.View.extend({

	
	el : '#rowContainer',
	
	templateHTML: 'cartointer',
	
	numberListByPage: 25,

    // The DOM events //
    events: {
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
        app.router.setPageTitle(app.lang.viewsTitles.cartoSites);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.cartographie);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var places = app.collections.places;

		var len = places.length;
		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				places: places.toJSON(),
				lang: app.lang,
				nbPlaces: len,				
			});
			
			$(self.el).html(template);
			
			var map = new app.Views.MapInterView({ el: $("#map") });
//			$('input[name^="OpenLayers.Geometry.Point_"]').addClass('mapmarker');
//			$('input[name^="OpenLayers.Geometry.Point_"]').addClass('label-info');
			
		});

		$(this.el).hide().fadeIn('slow');
		
        return this;
    },
    


    preventDefault: function(event){
    	event.preventDefault();
    },

});