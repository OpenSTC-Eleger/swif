/******************************************
* MapView 
*/
 app.Views.MapStatView = Backbone.View.extend({
	 
	  el: '#rowContainer',
	  templateHTML: 'cartostat',

      initialize: function() {
          _.bindAll(this, 'initMap');
          this.render();
      },
      
      highlightLayer:null,

      initMap: function( map ) {
		var layer, select, hover, control;
	
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
	    statisticLayer = new OpenLayers.Layer.WMS(
	        "Statistique sites",
	        app.urlGEO_OWS,	        
	        {
	        	layers: 'openstc:openstc_site_v', 
	            transparent: true,
	        	format: 'image/gif',
	        },
	         {isBaseLayer:false}
	    );
	    statisticLayer.displayInLayerSwitcher=false;
	    
        select = new OpenLayers.Layer.Vector("Selection", {styleMap: 
            new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
        });
        select.displayInLayerSwitcher=false;
        
        osmLayer = new OpenLayers.Layer.OSM();
        osmLayer.displayInLayerSwitcher=false;
        //var osmLayer = new OpenLayers.Layer.OSM("Local Tiles", "css/openlayers/tiles/map.png", {numZoomLevels: 19, alpha: true, isBaseLayer: true});
        //map.addLayer(newLayer);
        
        map.addLayers([ statisticLayer, select, osmLayer ]);
        //map.addLayers(interLayers);
        //map.setLayerIndex(statisticLayer, 3)
     
        /****************END INIT LAYERS***********************/
        /****************INIT LAYER CONTROLS***********************/
        control = new OpenLayers.Control.GetFeature({
            protocol: OpenLayers.Protocol.WFS.fromWMSLayer(statisticLayer),
            clickTolerance: 15,
        });
        control.events.register("featureselected", self, function(e) {
        	var tooltipPopup = new OpenLayers.Popup.FramedCloud(
							            "carto_popup", 
							            new OpenLayers.LonLat(e.feature.geometry.x, e.feature.geometry.y),
							            //ou feature.geometry.getBounds().getCenterLonLat(),
							            null,
							            "Nom: " + e.feature.attributes.name + "<br> nb inter. :" + e.feature.attributes.nbinters + 
							            "<br>Id : " + e.feature.attributes.id + "<br> Service : " + e.feature.attributes.service,
							            null,
							            true
							    	);
        	//tooltipPopup.contentDiv.style.backgroundColor='ffffcb';        	
        	map.addPopup( tooltipPopup );
            e.feature.popup = tooltipPopup;
        });
        	
        control.events.register("featureunselected", self, function(e) {     
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
        
        var services = _.first(app.collections.claimersServices.toJSON(), 7);
        var self = this;
        _.each(services, function( service, index ){
        	if( service.technical && service.category_ids.length>0  )
        		self.getLegend( service, index )
        })
      },
      
      getLegend: function( service, index ) {
		var renderers = ['SVG', 'VML', 'Canvas'];
		
		var rendererClass = OpenLayers.Renderer[renderers[0]]
		var dataLayersDiv = document.getElementsByClassName('dataLayersDiv')[0];
		var newDiv = document.createElement("div");
		newDiv.id = "svg_" + index;
		var rendererIcon = new rendererClass(newDiv, null);
		
	    rendererIcon.map = {
        resolution:1,
		getResolution: (function () {
            return this.resolution;
        })};
    	rendererIcon.setSize(new OpenLayers.Size(160,50));
    	rendererIcon.resolution = 1;
    	rendererIcon.setExtent(new OpenLayers.Bounds(-20,0,20,20), true);
    	
    	var point = new OpenLayers.Geometry.Point(10, 10)
    	point.pointRadius = 20;
    	var pointFeature = new OpenLayers.Feature.Vector(point);
    	var feature = pointFeature;
    	
    	rendererIcon.clear();
    	var styleDefault = new OpenLayers.Style( {
		    						'pointRadius': 10,
		    						'strokeWidth': 2, 
		    						'strokeOpacity': 0.5,
		    				});
        styleDefault.strokeColor = "blue";
        styleDefault.fillColor = service.favcolor;
        styleDefault.fontColor = "white"
        styleDefault.graphicName = "circle";
        styleDefault.pointRadius = 10;
        styleDefault.strokeWidth = 3;
    	styleDefault.label = service.name;
    	styleDefault.labelAlign ="cm"
    	styleDefault.pointerEvents = "none";
    	styleDefault.labelOutlineColor = "white";
    	styleDefault.labelOutlineWidth = 0;
    	styleDefault.labelXOffset = 50;
    	styleDefault.labelYOffset = -15;
    	styleDefault.fontSize ="12px";
    	styleDefault.fontFamily = "Courier New, monospace";
    	styleDefault.fontWeight = "bold";
    	styleDefault.xOffset = -18;
        var pointFeature = new OpenLayers.Feature.Vector(point,null,styleDefault);

        
        rendererIcon.drawFeature(pointFeature);
        dataLayersDiv.appendChild(rendererIcon.container);
    },
      

	render: function(){	
		var self = this;
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {lang: app.lang});
		
			$(self.el).html(template);
			self.initMap( self.map );
			
		});
		
		return this;
	},	 

       
  });