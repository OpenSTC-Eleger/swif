/******************************************
* MapView 
*/
 app.Views.MapInterView = Backbone.View.extend({
	 
	 el: '#rowContainer',
	 templateHTML: 'cartointer',
	
	 initialize: function() {
	     _.bindAll(this, 'initMap');
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
	
	   
	   this.addInterLayers( map );
	   
	   select = new OpenLayers.Layer.Vector("Selection", {styleMap: 
	       new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
	   });
	   select.displayInLayerSwitcher=false;
	   
	   osmLayer = new OpenLayers.Layer.OSM();
	   osmLayer.displayInLayerSwitcher=false;
	   //var osmLayer = new OpenLayers.Layer.OSM("Local Tiles", "css/openlayers/tiles/map.png", {numZoomLevels: 19, alpha: true, isBaseLayer: true});
	   //map.addLayer(newLayer);
	   
	   map.addLayers([ select, osmLayer ]);
	   //map.addLayers(interLayers);
	   //map.setLayerIndex(statisticLayer, 3)
	
	   /****************END INIT LAYERS***********************/
	   /****************INIT LAYER CONTROLS***********************/
	
	   // add the LayerSwitcher (a.k.a. Map Legend)
	   layerSwitcher = new OpenLayers.Control.LayerSwitcher();
	   layerSwitcher.ascending = false;
	   layerSwitcher.useLegendGraphics = true;
	         
	   map.addControls([layerSwitcher]);  
	   /****************END INIT LAYERS***********************/
	   
	
	   map.setCenter(new OpenLayers.LonLat(-470000, 6084169.29897), 13);
	   
		var self = this;
		_.each(map.layers, function( layer, index) {			
			if( layer.styleMap && layer.styleMap.styles )
				self.getLegend( layer, index );
		})
	 },
	 
	
	 
	 addInterLayers: function( map ) {
	
			var layers = [];			
			_.each(app.Models.Intervention.state, function( state ) {
				var style = new OpenLayers.Style(
				{
					'pointRadius': 10,
					'strokeWidth': 2, 
					'strokeOpacity': 0.5,
	//				'externalGraphic': "icon-map-marker",
	//				'backgroundGraphic': "icon-map-marker",					
					'externalGraphic': OpenLayers.ImgPath + state.externalGraphic,
					//'backgroundGraphic': OpenLayers.ImgPath + "marker_shadow.png",
				});
				
				var rule = new OpenLayers.Rule({ 
					name : state.traduction,
					filter: new OpenLayers.Filter.Comparison({
					  type: OpenLayers.Filter.Comparison.EQUAL_TO,
					  property: "state",
					  value: state.value          
					}),
					//symbolizer: {'fillColor': 'label-'+state.color }
				});
				
	//			OpenLayers.Element.addClass($(rule.symbolizer), 'mapmarker');
	//			OpenLayers.Element.addClass($(rule.symbolizer), 'label-'+state.color);
				style.addRules([rule]); 
				
				var styleMap = new OpenLayers.StyleMap(style);
				var interLayer = new OpenLayers.Layer.Vector(state.traduction, {
			        //minScale: 15000000,
			        strategies: [new OpenLayers.Strategy.BBOX()],
			        protocol: new OpenLayers.Protocol.WFS({
			            url: app.urlGEO_WFS,
			            featureClass: 'label-'+state.color,
			            featureType: "openstc_intervention",
			            featureNS: app.urlGEO_NS
			        }),
			        styleMap: styleMap,
				});	
				interLayer.displayInLayerSwitcher=false;
				layers.push(interLayer)
			});
			
			map.addLayers(layers);
			
			
	 },
	 
	 getLegend: function( layer, index ) {
			var renderers = ['SVG', 'VML', 'Canvas'];
		
//			var rendererIcon = null
//			for (var i = 0, len = renderers.length; i < len; ++i) {
//			   var rendererClass = OpenLayers.Renderer[renderers[i]];
//			      if (rendererClass && rendererClass.prototype.supported()) {
//			    	 var dataLayersDiv = document.getElementsByClassName('dataLayersDiv')[0];
//			         rendererIcon = new rendererClass(dataLayersDiv.appendChild(document.createElement("div")), null);
//			         break;
//			      }
//			}
			
			var rendererClass = OpenLayers.Renderer[renderers[0]]
			var dataLayersDiv = document.getElementsByClassName('dataLayersDiv')[0];
			var newDiv = document.createElement("div");
			newDiv.id = "svg_" + index;
			var rendererIcon = new rendererClass(newDiv, null);

//			var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
//            rendererIcon = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
			
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
	    	var style = layer.styleMap.styles['default'].clone();
	    	var styleDefault = style.defaultStyle
	    	styleDefault.label = style.rules[0].name;
	    	styleDefault.labelAlign ="cm"
	    	styleDefault.pointerEvents = "visiblePainted";
	    	styleDefault.labelOutlineColor = "white";
	    	styleDefault.labelOutlineWidth = 3;
	    	styleDefault.labelXOffset = 50;
	    	styleDefault.labelYOffset = -15;
	    	styleDefault.fontSize ="12px";
	    	styleDefault.fontFamily = "Courier New, monospace";
	    	styleDefault.fontWeight = "bold";
	    	styleDefault.xOffset = -18;
	    	//styleDefault.labelOutlineWidth = 10;
            var pointFeature = new OpenLayers.Feature.Vector(point,null,styleDefault);

            
	        rendererIcon.drawFeature(pointFeature);
	        dataLayersDiv.appendChild(rendererIcon.container);
      },
	
	 render: function(){	
    	 var self = this;
    	 $.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {lang: app.lang});

			$(self.el).html(template);
			self.initMap(self.map);			
			
			//document.getElementsByClassName(
			_.each(document.getElementsByClassName('circle[name^="OpenLayers.Geometry.Point_"]'), function(element){
				element.addClass('mapmarker');
				element.addClass('label-info');
			})
			//$('input[name^="OpenLayers.Geometry.Point_"]').addClass('label-info');
			
		});
    	 
		return this;
	 },	 


       
  });