/******************************************
* MapView 
*/
 app.Views.MapRequestView = Backbone.View.extend({
	 
	  el: '#map',
	  templateHTML: 'cartorequest',
	  

      initialize: function() {
          _.bindAll(this, 'initMap');
          this.initMap();
          this.render();
      },
      
      highlightLayer:null,

      initMap: function() {
		var layer, select, hover, control;
	
		/****************INIT MAP***********************/
	    OpenLayers.ProxyHost= "/cgi-bin/proxy.cgi?url=";
	    this.map = new OpenLayers.Map('map',{
	    	projection: new OpenLayers.Projection("EPSG:900913"),
	    	maxExtent: new OpenLayers.Bounds(-473380.08102, 6080505.27911, -464411.53979, 6089000.79602),
	    });
	    //control map
		this.map.addControl(new OpenLayers.Control.MousePosition({ div: document.getElementById('mapMousePosition'), numdigits: 5 }));    
		this.map.addControl(new OpenLayers.Control.Scale('mapScale'));
		this.map.addControl(new OpenLayers.Control.ScaleLine());
		// display the map projection
		document.getElementById('mapProjection').innerHTML = this.map.projection;
		/****************END INIT MAP***********************/
			
		/****************INIT LAYERS***********************/

//	    siteLayer = new OpenLayers.Layer.WMS(
//	        "Sites",
//	        app.urlGEO_OWS,	        
//	        {
//	        	layers: 'openstc:openstc_site', 
//	            transparent: true,
//	        	//format: 'image/gif',
//	        },
//	         {isBaseLayer:false}
//	    ); 

		var style = new OpenLayers.Style(
				{
					
					'pointRadius': 10,
					'strokeWidth': 2, 
					'strokeColor': 'green',
					'fillColor': 'orange',
					'strokeOpacity': 0.5,
				});

	    var siteLayer = new OpenLayers.Layer.Vector("Sites", {
	        //minScale: 15000000,
	        strategies: [new OpenLayers.Strategy.BBOX()],
	        protocol: new OpenLayers.Protocol.WFS({
	            url: app.urlGEO_WFS,	           
	            featureType: "openstc_site",
	            featureNS: app.urlGEO_NS
	        }),
	        styleMap: new OpenLayers.StyleMap(style) ,
		});
		
        
        osmLayer = new OpenLayers.Layer.OSM();
        //var osmLayer = new OpenLayers.Layer.OSM("Local Tiles", "css/openlayers/tiles/map.png", {numZoomLevels: 19, alpha: true, isBaseLayer: true});
        //map.addLayer(newLayer);
        
        this.map.addLayers([ siteLayer, osmLayer ]);
        //this.map.addLayers(interLayers);
        //map.setLayerIndex(statisticLayer, 3)
     
        /****************END INIT LAYERS***********************/
        /****************INIT LAYER CONTROLS***********************/

//        var report = function(e) {
//            //OpenLayers.Console.log(e.type, e.feature.id);
//        	this.displayFormAddIntervention(e);
//        };

        var select = new OpenLayers.Control.SelectFeature(siteLayer, {
            click: true,
            highlightOnly: true,
            renderIntent: "temporary",
            eventListeners: {
                //beforefeaturehighlighted: this.displayFormAddIntervention,
                featurehighlighted: this.displayFormAddIntervention,
                //featureunhighlighted: report
            }
        });
        select.displayInLayerSwitcher=false;

	    // add the LayerSwitcher (a.k.a. Map Legend)
        layerSwitcher = new OpenLayers.Control.LayerSwitcher();
        layerSwitcher.ascending = false;
        layerSwitcher.useLegendGraphics = true;
              
        this.map.addControls([select, layerSwitcher]);  
        select.activate();  
        /****************END INIT LAYERS***********************/
        

        this.map.setCenter(new OpenLayers.LonLat(-470000, 6084169.29897), 13);	
      },


      render: function(){	
    	 $.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData);

			$(self.el).html(template);

			
		});
      
    	
		return this;
      },
      
	/** Display the form to add a new Intervention
		    */
    displayFormAddIntervention: function(e){
    	
   		//search no technical services
		var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
			return service.attributes.technical != true 
		});
		//remove no technical services
		app.collections.claimersServices.remove(noTechnicalServices);

		app.views.selectListServicesView = new app.Views.DropdownSelectListView({el: $("#interventionDetailService"), collection: app.collections.claimersServices})
		app.views.selectListServicesView.clearAll();
		app.views.selectListServicesView.addEmptyFirst();
		app.views.selectListServicesView.addAll();
		

		// Fill select Places  //
		app.views.selectListPlacesView = new app.Views.DropdownSelectListView({el: $("#interventionPlace"), collection: app.collections.places})
		app.views.selectListPlacesView.clearAll();
		app.views.selectListPlacesView.addEmptyFirst();
		app.views.selectListPlacesView.addAll();	
        
		
        $('#modalAddInter').modal();
   },

       
  });