/******************************************
* MapView 
*/
 app.Views.MapRequestView = Backbone.View.extend({
	 
	  el: '#rowContainer',
	  templateHTML: 'cartorequest',
	  
	  events: {
	 	'submit #formAddIntervention'	: 'saveIntervention', 
 	  },

      initialize: function() {
          _.bindAll(this, 'initMap');         
      },
      
      highlightLayer:null,

      initMap: function(map) {
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

		this.style = new OpenLayers.Style({});
		
		var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.6;
        layer_style.graphicOpacity = 1;
        var style_blue = OpenLayers.Util.extend({}, layer_style);
        style_blue.strokeColor = "orange";
        style_blue.fillColor = "#1E90FF";
        style_blue.graphicName = "circle";
        style_blue.pointRadius = 8;
        style_blue.strokeWidth = 2;
        //style_blue.rotation = 45;
        //style_blue.strokeLinecap = "butt";

	    this.siteLayer = new OpenLayers.Layer.Vector("Sites", {
	        //minScale: 15000000,
	        strategies: [new OpenLayers.Strategy.BBOX()],
	        protocol: new OpenLayers.Protocol.WFS({
	            url: app.urlGEO_WFS,	           
	            featureType: "openstc_site",
	            featureNS: app.urlGEO_NS
	        }),
	        styleMap: new OpenLayers.StyleMap(style_blue) ,
		});
	    this.siteLayer.displayInLayerSwitcher=false;
        
        osmLayer = new OpenLayers.Layer.OSM();
        //osmLayer.displayInLayerSwitcher=false;

       
        var ign_options = {
		    name: "IGN - cartes",
		    url: "http://gpp3-wxs.ign.fr/" + app.geoportail_key + "/wmts",
		    layer: "GEOGRAPHICALGRIDSYSTEMS.MAPS",
		    matrixSet: "PM",
		    style: "normal",
		    numZoomLevels: 19,
		    group : 'IGN',
		    attribution: '&copy;IGN <a href="http://www.geoportail.fr/" target="_blank"><img src="http://api.ign.fr/geoportail/api/js/2.0.0beta/theme/geoportal/img/logo_gp.gif"></a> <a href="http://www.geoportail.gouv.fr/depot/api/cgu/licAPI_CGUF.pdf" alt="TOS" title="TOS" target="_blank">Terms of Service</a>'
		};
		
		var ign_scans = new OpenLayers.Layer.WMTS(ign_options);
		
		//Changement des options nécessaires pour l'ortho
		ign_options.name = "IGN - vue aérienne";
		ign_options.layer = "ORTHOIMAGERY.ORTHOPHOTOS";
		ign_options.numZoomLevels = 20;
		var ign_orthos = new OpenLayers.Layer.WMTS(ign_options);
		    
	
        
        map.addLayers([ this.siteLayer, osmLayer , ign_scans, ign_orthos   ]);

        /****************END INIT LAYERS***********************/
        /****************INIT LAYER CONTROLS***********************/

//        var report = function(e) {
//            //OpenLayers.Console.log(e.type, e.feature.id);
//        	this.displayFormAddIntervention(e);
//        };

        var select = new OpenLayers.Control.SelectFeature(this.siteLayer, {
            click: true,
            toggle: true,
            //highlightOnly: true,
            renderIntent: "temporary",
            eventListeners: {
                //beforefeaturehighlighted: this.displayFormAddIntervention,
                featurehighlighted: this.displayFormAddIntervention,
                //featureunhighlighted: 
            }
        });
        select.displayInLayerSwitcher=false;

	    // add the LayerSwitcher (a.k.a. Map Legend)
        layerSwitcher = new OpenLayers.Control.LayerSwitcher();
        layerSwitcher.ascending = false;
        layerSwitcher.useLegendGraphics = true;
              
        map.addControls([select, layerSwitcher]);  
        select.activate();  
        /****************END INIT LAYERS***********************/
       
        var self = this;
        map.events.register('changelayer', null, function(evt){
		  if(evt.property === "visibility") {
//		          alert(evt.layer.name + " layer visibility changed to " +
//		        		  evt.layer.visibility );
		          self.getLegend();
		       }
		   }
		);

        map.setCenter(new OpenLayers.LonLat(-470000, 6084169.29897), 13);
        
        this.getLegend();
        
      },

      getLegend: function() {
			var renderers = ['SVG', 'VML', 'Canvas'];
		
			for (var i = 0, len = renderers.length; i < len; ++i) {
			   var rendererClass = OpenLayers.Renderer[renderers[i]];
			      if (rendererClass && rendererClass.prototype.supported()) {
			         var rendererIcon = new rendererClass(document.getElementsByClassName('dataLayersDiv')[0], null);
			         break;
			      }
			}

//			var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
//            rendererIcon = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
			
		    rendererIcon.map = {
            resolution:1,
			getResolution: (function () {
                return this.resolution;
            })};
	    	rendererIcon.setSize(new OpenLayers.Size(100,100));
	    	rendererIcon.resolution = 1;
	    	rendererIcon.setExtent(new OpenLayers.Bounds(-5,0,20,20), true);
	    	
	    	var point = new OpenLayers.Geometry.Point(10, 10)
	    	point.pointRadius = 20;
	    	var pointFeature = new OpenLayers.Feature.Vector(point);
	    	var feature = pointFeature;
	    	
	    	rendererIcon.clear();
	    	var style = this.siteLayer.styleMap.styles['default'].clone();
	    	var styleDefault = style.defaultStyle
	    	styleDefault.label = "STC Sites";
	    	styleDefault.fontColor = "white"
	    	//styleDefault.labelAlign ="cm"
	    	styleDefault.pointerEvents = "none";
	    	styleDefault.labelOutlineColor = "white";
	    	styleDefault.labelOutlineWidth = 0;
	    	styleDefault.labelXOffset = 50;
	    	styleDefault.labelYOffset = -15;
	    	styleDefault.fontSize ="13px";
	    	styleDefault.fontFamily = "Courier New, monospace";
	    	styleDefault.fontWeight = "bold";
	    	//styleDefault.xOffset = -18;
	    	//styleDefault.labelOutlineWidth = 10;
            var pointFeature = new OpenLayers.Feature.Vector(point,null,styleDefault);

            
	        rendererIcon.drawFeature(pointFeature);
      },

      render: function(){	
    	 var self = this;
    	 $.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {lang: app.lang});

			$(self.el).html(template);
			self.initMap(self.map);

			
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
   
	/** Save the intervention */
    saveIntervention: function (e) {
	     
    	e.preventDefault();

	     var self = this;
	     
	     input_service_id = null;
	     if ( app.views.selectListServicesView && app.views.selectListServicesView.getSelected())
	    	 input_service_id = app.views.selectListServicesView.getSelected().toJSON().id;
	     
	     var params = {	
		     name: this.$('#interventionName').val(),
		     description: this.$('#interventionDescription').val(),
		     state: this.$('#isTemplate').is(':checked')?"template":"open",
		     service_id: input_service_id,
		     site1: this.$('#interventionPlace').val(),
		     site_details: this.$('#interventionPlacePrecision').val(),
	     };
	     
	    
	    app.models.intervention.saveAndRoute(0,params,$('#modalAddInter'), this, "#nouvelle-intervention");
    },

       
  });