/******************************************
* Equipment Model
*/
app.Models.Equipment = app.Models.GenericModel.extend({
	
	model_name : 'openstc.equipments',

	urlRoot: "/api/openstc/equipments",



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

	getInformations: function(){
		return {name: this.get('name')}
	},


	/** Model Initialization
	*/
	initialize: function(){
		//console.log('Equipment Model initialization');
	},


});