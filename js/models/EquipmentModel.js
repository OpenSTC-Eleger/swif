/******************************************
* Equipment Model
*/
app.Models.Equipment = Backbone.Model.extend({
    
	model_name : 'openstc.equipment',
	
	url: "/equipment/:id",
	
	
	defaults:{
		id:0,
		name: null,
		immat: null,
		service:0,
		marque: null,
		type: null,
		usage: null,
		cv: 0,
		year: 0,
		time: 0,
		technical: false,
		small: false,
	},

	getName : function() {
        return this.get('name');
    },
    setName : function(value) {
    	if( value == 'undefined') return;
        this.set({ name : value });
    }, 
    
    getImmat : function() {
        return this.get('immat');
    },
    setImmat : function(value) {
    	if( value == 'undefined') return;
        this.set({ immat : value });
    },  
    
    
    getService : function() {
        return this.get('service');
    },
    setService : function(value) {
    	if( value == 'undefined') return;
        this.set({ service : value });
    },  
    
    //service IDs //
	getServicesId: function() {
	    return this.get('service_ids');
	},
	setServicesID : function(value) {
		if( value == 'undefined') return;
		this.set({ service_ids : value });
	},

    getMarque : function() {
        return this.get('code');
    },
    setMarque : function(value) {
    	if( value == 'undefined') return;
        this.set({ marque : value });
    }, 
    
    getType : function() {
        return this.get('type');
    },
    setType : function(value) {
    	if( value == 'undefined') return;
        this.set({ type : value });
    }, 
    
    getUsage : function() {
        return this.get('usage');
    },
    setUsage : function(value) {
    	if( value == 'undefined') return;
        this.set({ usage : value });
    }, 
    
    getCV : function() {
        return this.get('usage');
    },
    setCV : function(value) {
    	if( value == 'undefined') return;
        this.set({ cv : value });
    }, 
    
    getKM : function() {
        return this.get('km');
    },
    setKM : function(value) {
    	if( value == 'undefined') return;
        this.set({ km : value });
    }, 
    
    getYear : function() {
        return this.get('year');
    },
    setYear : function(value) {
    	if( value == 'undefined') return;
        this.set({ year : value });
    }, 
    
    getTime : function() {
        return this.get('time');
    },
    setTime : function(value) {
    	if( value == 'undefined') return;
        this.set({ time : value });
    }, 
    
    isTechnicalVehicle : function() {
        return this.get('technical_vehicle');
    },
    setTechnicalVehicle : function(value) {
    	if( value == 'undefined') return;
        this.set({ technical_vehicle : value });
    }, 
    
    isCommercialVehicle : function() {
        return this.get('commercial_vehicle');
    },
    setCommercialVehicle : function(value) {
    	if( value == 'undefined') return;
        this.set({ commercial_vehicle : value });
    }, 
    
    isSmallMaterial : function() {
        return this.get('small_material');
    },
    setSmallMaterial : function(value) {
    	if( value == 'undefined') return;
        this.set({ small_material : value });
    }, 
    
    isFatMaterial : function() {
        return this.get('fat_material');
    },
    setFatMaterial : function(value) {
    	if( value == 'undefined') return;
        this.set({ fat_material : value });
    }, 

	/** Model Initialization
	*/
	initialize: function(){
		//console.log('Equipment Model initialization');
	},



	/** Model Parser */
	parse: function(response) {    	
		return response;
	},


	update: function(params) {
		this.setName( params.name );
		this.setImmat( params.immat );
		this.setService( params.service );
		this.setMarque( params.marque );
		this.setType( params.type );
		this.setUsage( params.usage );
		this.setCV( params.cv );
		this.setYear( params.year );
		this.setTime( params.time );
		this.setTechnicalVehicle( params.technical_vehicle );
		this.setCommercialVehicle( params.commercial_vehicle );
		this.setSmallMaterial( params.small_material );
		this.setFatMaterial( params.fat_material );
		this.setServicesID( params.service_ids );
		this.setKM( params.km );
	},
	
	updateKM: function( km ){
		this.setKM( km );
	},

	/** Save Model
	*/
	save: function(data, id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(),options);
	},



	/** Delete category
	*/
	delete: function (options) {	
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	}

});
