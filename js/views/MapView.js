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
	
	    OpenLayers.ProxyHost= "http://swif2/cgi-bin/proxy.cgi?url=";
	    map = new OpenLayers.Map('map',{
	    	projection: new OpenLayers.Projection("EPSG:900913"),
	    	maxExtent: new OpenLayers.Bounds(-471665.6491956826,6081773.03548929,-466752.21540089155,6086029.28540361),
	  //-470106.47140625,6082400.286713315,-465881.30984375,6085596.713286685
	    	//-470039.1875,6083801.0,-465948.59375,6084196.0
	    	//displayProjection: new OpenLayers.Projection("EPSG:4326")
	    });
 
	    siteLayer = new OpenLayers.Layer.WMS(
	        "Openstc Site",
	        "http://localhost:8080/geoserver/ows",
	        
	        {
	        	layers: 'openstc:openstc_site', 
	            transparent: true,
	        	format: 'image/gif',	  
	        	
	        },
	         {isBaseLayer:false}
	    );
	    
	    this.highlightLayer = new OpenLayers.Layer.Vector("Highlighted Features", {
            displayInLayerSwitcher: false, 
            isBaseLayer: false 
            }
        );        

        var  hover =  new OpenLayers.Control.WMSGetFeatureInfo({
            url: 'http://localhost:8080/geoserver/ows', 
	        title: 'Identify features by clicking',
	        layers: [siteLayer],
	        hover: true,
	        // defining a custom format options here
//	        formatOptions: {
//	            typeName: 'water_bodies', 
//	            featureNS: 'http://www.openplans.org/topp'
//	        },
	        queryVisible: true
        })
     
        map.addLayers([siteLayer,this.highlightLayer]);     
        hover.events.register("getfeatureinfo", this, this.showInfo);
        map.addControl(hover);  
        hover.activate();
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        
	    
	    map.addLayer(new OpenLayers.Layer.OSM());
	    map.zoomToExtent(siteLayer.getMaxExtent());
      },
      
       showInfo: function(evt) {
        if (evt.features && evt.features.length) {
             this.highlightLayer.destroyFeatures();
             this.highlightLayer.addFeatures(evt.features);
             this.highlightLayer.redraw();
        } else {
            //document.getElementById('responseText').innerHTML = evt.text;
        	alert("not found");
        }
      },

      render: function(){	
		return this;
      },
       
  });