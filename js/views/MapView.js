/******************************************
* MapView 
*/
 app.Views.MapView = Backbone.View.extend({
	 
	  el: '#map',
	  

      initialize: function() {
          _.bindAll(this, 'initMap');
          this.initMap();
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
		document.getElementById('mapProjection').innerHTML = map.projection;
		/****************END INIT MAP***********************/
			
		/****************INIT LAYERS***********************/
	    siteLayer = new OpenLayers.Layer.WMS(
	        "Statistique sites",
	        app.urlGEO_OWS,	        
	        {
	        	layers: 'openstc:openstc_site_v', 
	            transparent: true,
	        	format: 'image/gif',
	        },
	         {isBaseLayer:false}
	    );
	    
	    this.addInterLayers();
	    
        select = new OpenLayers.Layer.Vector("Selection", {styleMap: 
            new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
        });
        select.displayInLayerSwitcher=false;
        
        osmLayer = new OpenLayers.Layer.OSM();
        //var osmLayer = new OpenLayers.Layer.OSM("Local Tiles", "css/openlayers/tiles/map.png", {numZoomLevels: 19, alpha: true, isBaseLayer: true});
        //map.addLayer(newLayer);
        
        this.map.addLayers([ siteLayer, select, osmLayer]);
        //this.map.addLayers(interLayers);
        //map.setLayerIndex(siteLayer, 3)
     
        /****************END INIT LAYERS***********************/
        /****************INIT LAYER CONTROLS***********************/
        control = new OpenLayers.Control.GetFeature({
            protocol: OpenLayers.Protocol.WFS.fromWMSLayer(siteLayer),
            clickTolerance: 10,
        });
        control.events.register("featureselected", this, function(e) {
        	var tooltipPopup = new OpenLayers.Popup.FramedCloud(
							            "carto_site_popup", 
							            new OpenLayers.LonLat(e.feature.geometry.x, e.feature.geometry.y),
							            //ou feature.geometry.getBounds().getCenterLonLat(),
							            null,
							            "Nom: " + e.feature.attributes.name + "\n\r nb inter. :" + e.feature.attributes.nbinters + 
							            ", id : " + e.feature.attributes.id + "\n\r service : " + e.feature.attributes.service,
							            null,
							            true
							    	);
        	//tooltipPopup.contentDiv.style.backgroundColor='ffffcb';        	
        	this.map.addPopup( tooltipPopup );
            e.feature.popup = tooltipPopup;
        });
        	
        control.events.register("featureunselected", this, function(e) {     
			var feature = e.feature;
	        if(feature != null && feature.popup != null){
	            this.map.removePopup(feature.popup);
	            feature.popup.destroy();
	            delete feature.popup;
	            tooltipPopup = null;
	            lastFeature = null;
	        }
	     });
        
	    // add the LayerSwitcher (a.k.a. Map Legend)
        layerSwitcher = new OpenLayers.Control.LayerSwitcher();
        layerSwitcher.ascending = false;
        layerSwitcher.useLegendGraphics = true;
              
        this.map.addControls([control, layerSwitcher]);  
        control.activate();  
        /****************END INIT LAYERS***********************/
        

        this.map.setCenter(new OpenLayers.LonLat(-470000, 6084169.29897), 13);	
      },
      

      
      addInterLayers: function() {

			var layers = [];
			_.each(app.Models.Intervention.state, function( state ) {
				var style = new OpenLayers.Style(
				{
					'pointRadius': 10,
					'strokeWidth': 2, 
					'strokeOpacity': 0.5,
					'externalGraphic': OpenLayers.ImgPath + "marker-gold.png",
					'backgroundGraphic': OpenLayers.ImgPath + "marker_shadow.png",
				});
				
				var rule = new OpenLayers.Rule({ 
					filter: new OpenLayers.Filter.Comparison({
					  type: OpenLayers.Filter.Comparison.EQUAL_TO,
					  property: "state",
					  value: state.value          
					}),
					symbolizer: {'fillColor': state.htmlColor /*'label-'+state.color*/ }
				});
				OpenLayers.Element.addClass($(rule.symbolizer), 'mapmarker');
				OpenLayers.Element.addClass($(rule.symbolizer), 'label-'+state.color);
				style.addRules([rule]); 
				
				var styleMap = new OpenLayers.StyleMap(style);
				var interLayer = new OpenLayers.Layer.Vector(state.traduction, {
			        //minScale: 15000000,
			        strategies: [new OpenLayers.Strategy.BBOX()],
			        protocol: new OpenLayers.Protocol.WFS({
			            url: app.urlGEO_WFS,
			            featureType: "openstc_intervention",
			            featureNS: app.urlGEO_NS
			        }),
			        styleMap: styleMap,
				});
				layers.push(interLayer)
			});
			
			this.map.addLayers(layers);
      },

      render: function(){	
		return this;
      },

       
  });