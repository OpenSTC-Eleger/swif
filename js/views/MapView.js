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
	
	    OpenLayers.ProxyHost= "/cgi-bin/proxy.cgi?url=";
	    map = new OpenLayers.Map('map',{
//	    	controls: [
//	    	           //new OpenLayers.Control.PanZoom()
//	    	],
	    	projection: new OpenLayers.Projection("EPSG:900913"),
	    	maxExtent: new OpenLayers.Bounds(-473380.08102, 6080505.27911, -464411.53979, 6089000.79602),
	  //-470106.47140625,6082400.286713315,-465881.30984375,6085596.713286685
	    	//-470039.1875,6083801.0,-465948.59375,6084196.0
	    	//displayProjection: new OpenLayers.Projection("EPSG:4326")
	    });
 
	    //var panel = new OpenLayers.Control.NavToolbar();
        //map.addControl(panel);
        
	    siteLayer = new OpenLayers.Layer.WMS(
	        "Openstc Site",
	        "http://localhost:8080/geoserver/ows",
	        
	        {
	        	layers: 'openstc:openstc_site_v', 
	            transparent: true,
	        	//format: 'image/gif',	  
	        	
	        },
	         {isBaseLayer:false}
	    );
	    
//	    var highlight = new OpenLayers.Layer.Vector("Highlighted Features", {
//            displayInLayerSwitcher: false, 
//            isBaseLayer: false 
//        });
	    //osmLayer = new OpenLayers.Layer.OSM();
	    //map.addLayer(siteLayer);
	    
        select = new OpenLayers.Layer.Vector("Selection", {styleMap: 
            new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
        });
//        hover = new OpenLayers.Layer.Vector("Hover");
        osmLayer = new OpenLayers.Layer.OSM();
        map.addLayers([siteLayer, select, osmLayer]);
        map.setLayerIndex(siteLayer, 3)
        
//        
        control = new OpenLayers.Control.GetFeature({
            protocol: OpenLayers.Protocol.WFS.fromWMSLayer(siteLayer),
            clickTolerance: 10,
            //box: true,
            //hover: true,
            //multipleKey: "shiftKey",
            //toggleKey: "ctrlKey"
        });
        control.events.register("featureselected", this, function(e) {     
//        	var siteId = e.feature.attributes.id;
//        	site = app.collections.places.get( siteId )
//        	var nbInters = 0;
//        	if( site ) {
//        		var siteJSON = site.toJSON();
//        		nbInters = siteJSON.intervention_ids.length;
//        	}
        	
        	var tooltipPopup = new OpenLayers.Popup.FramedCloud(
							            "carto_site_popup", 
							            new OpenLayers.LonLat(e.feature.geometry.x, e.feature.geometry.y),
							            //ou feature.geometry.getBounds().getCenterLonLat(),
							            null,
							            e.feature.attributes.name + ", interventions :" + e.feature.attributes.nbinters + 
							            ", id : " + e.feature.attributes.id + "\n\r service : " + e.feature.attributes.service,
							            null,
							            true
							    	);
//        	tooltipPopup.contentDiv.style.backgroundColor='ffffcb';
//            tooltipPopup.closeDiv.style.backgroundColor='ffffcb';
//            tooltipPopup.contentDiv.style.overflow='hidden';
//            tooltipPopup.contentDiv.style.padding='3px';
//            tooltipPopup.contentDiv.style.margin='0';
//            tooltipPopup.closeOnMove = true;
//            tooltipPopup.autoSize = true;
        	
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
              
        map.addControl(control);  
        control.activate();  
	    
	    //map.addControl(new OpenLayers.Control.LayerSwitcher());
	    //map.zoomToExtent(siteLayer.getMaxExtent(), 2);
        map.setCenter(new OpenLayers.LonLat(-469028.25721, 6085169.29897), 13.4);	
      },

      render: function(){	
		return this;
      },
       
  });