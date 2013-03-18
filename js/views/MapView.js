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
		var map, layer, select, hover, control;
	
		/****************INIT MAP***********************/
	    OpenLayers.ProxyHost= "/cgi-bin/proxy.cgi?url=";
	    map = new OpenLayers.Map('map',{
	    	projection: new OpenLayers.Projection("EPSG:900913"),
	    	maxExtent: new OpenLayers.Bounds(-473380.08102, 6080505.27911, -464411.53979, 6089000.79602),
	    });
	    //control map
		map.addControl(new OpenLayers.Control.MousePosition({ div: document.getElementById('mapMousePosition'), numdigits: 5 }));    
		map.addControl(new OpenLayers.Control.Scale('mapScale'));
		map.addControl(new OpenLayers.Control.ScaleLine());
		// display the map projection
		document.getElementById('mapProjection').innerHTML = map.projection;
		/****************END INIT MAP***********************/
			
		/****************INIT LAYERS***********************/
	    siteLayer = new OpenLayers.Layer.WMS(
	        "Statistique sites",
	        "http://localhost:8080/geoserver/ows",	        
	        {
	        	layers: 'openstc:openstc_site_v', 
	            transparent: true,
	        	format: 'image/gif',
	        },
	         {isBaseLayer:false}
	    );
	    
	    interLayer = new OpenLayers.Layer.WMS(
		        "Interventions",
		        "http://localhost:8080/geoserver/ows",		        
		        {
		        	layers: 'openstc:openstc_intervention', 
		            transparent: true,
		        	format: 'image/gif',
		        	styleMap: this.getStyleMap(),
		        },
		         {isBaseLayer:false}
		    );
	    
        select = new OpenLayers.Layer.Vector("Selection", {styleMap: 
            new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
        });
        select.displayInLayerSwitcher=false;
        
        osmLayer = new OpenLayers.Layer.OSM();
        //var osmLayer = new OpenLayers.Layer.OSM("Local Tiles", "css/openlayers/tiles/map.png", {numZoomLevels: 19, alpha: true, isBaseLayer: true});
        //map.addLayer(newLayer);
        
        map.addLayers([siteLayer, interLayer, select, osmLayer]);
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
        	map.addPopup( tooltipPopup );
            e.feature.popup = tooltipPopup;
        });
        	
        control.events.register("featureunselected", this, function(e) {     
			var feature = e.feature;
	        if(feature != null && feature.popup != null){
	            map.removePopup(feature.popup);
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
              
        map.addControls([control, layerSwitcher]);  
        control.activate();  
        /****************END INIT LAYERS***********************/
        

        map.setCenter(new OpenLayers.LonLat(-470000, 6084169.29897), 13);	
      },
      
      getStyleMap: function() {
		var style = new OpenLayers.Style(
			{
				strokeColor: "green", 
				strokeWidth: 2, 
				strokeOpacity: 0.5,
			});
	
		var scheduledStyle = new OpenLayers.Rule({ 
			filter: new OpenLayers.Filter.Comparison({
			  type: OpenLayers.Filter.Comparison.EQUAL_TO,
			  property: "state",
			  value: 'scheduled'          
			}),
			symbolizer: {'fillColor': '#3a87ad'}
		});
		
		var openStyle = new OpenLayers.Rule({ 
			filter: new OpenLayers.Filter.Comparison({
			  type: OpenLayers.Filter.Comparison.EQUAL_TO,
			  property: "state",
			  value: 'scheduled'          
			}),
			symbolizer: {'fillColor': '#f89406'}
		});
		
		var closedStyle = new OpenLayers.Rule({ 
			filter: new OpenLayers.Filter.Comparison({
			  type: OpenLayers.Filter.Comparison.EQUAL_TO,
			  property: "state",
			  value: 'closed'          
			}),
			symbolizer: {'fillColor': '#468847'}
		});
		
		var pendingStyle = new OpenLayers.Rule({ 
			filter: new OpenLayers.Filter.Comparison({
			  type: OpenLayers.Filter.Comparison.EQUAL_TO,
			  property: "state",
			  value: 'pending'          
			}),
			symbolizer: {'fillColor': '#999999'}
		});
		
		var cancelledStyle = new OpenLayers.Rule({ 
			filter: new OpenLayers.Filter.Comparison({
			  type: OpenLayers.Filter.Comparison.EQUAL_TO,
			  property: "state",
			  value: 'cancelled'          
			}),
			symbolizer: {'fillColor': '#b94a48'}
		});
		
		style.addRules([scheduledStyle, openStyle, closedStyle, pendingStyle, cancelledStyle]); 
		 
		return new OpenLayers.StyleMap({'default': style});
      },

      render: function(){	
		return this;
      },
       
  });