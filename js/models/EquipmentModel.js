/******************************************
* Equipment Model
*/
app.Models.Equipment = app.Models.GenericModel.extend({
	
	urlRoot: "/api/openstc/equipments",


	searchable_fields: [
		{
			key  : 'name',
			type : 'text'
		},
		{
			key  : 'immat', 
			type : 'text'
		}
	],


	getImmat : function() {
		return this.get('immat');
	},
	setImmat : function(value) {
		this.set({ immat : value });
	},  


	getService : function() {
		return this.get('service');
	},
	setService : function(value) {
		this.set({ service : value });
	},  

	//service IDs //
	getServicesId: function() {
		return this.get('service_ids');
	},
	setServicesID : function(value) {
		this.set({ service_ids : value });
	},

	getMarque : function() {
		return this.get('code');
	},
	setMarque : function(value) {
		this.set({ marque : value });
	}, 

	getType : function() {
		return this.get('type');
	},
	setType : function(value) {
		this.set({ type : value });
	}, 

	getUsage : function() {
		return this.get('usage');
	},
	setUsage : function(value) {
		this.set({ usage : value });
	}, 

	getCV : function() {
		return this.get('usage');
	},
	setCV : function(value) {
		this.set({ cv : value });
	}, 

	getKM : function() {
		return this.get('km');
	},
	setKM : function(value) {
		this.set({ km : value });
	}, 

	getYear : function() {
		return this.get('year');
	},
	setYear : function(value) {
		this.set({ year : value });
	}, 

	getTime : function() {
		return this.get('time');
	},
	setTime : function(value) {
		this.set({ time : value });
	}, 
	
	isTechnicalVehicle : function() {
		return this.get('technical_vehicle');
	},
	setTechnicalVehicle : function(value) {
		this.set({ technical_vehicle : value });
	}, 
	
	isCommercialVehicle : function() {
		return this.get('commercial_vehicle');
	},
	setCommercialVehicle : function(value) {
		this.set({ commercial_vehicle : value });
	}, 
	
	isSmallMaterial : function() {
		return this.get('small_material');
	},
	setSmallMaterial : function(value) {
		this.set({ small_material : value });
	}, 
	
	isFatMaterial : function() {
		return this.get('fat_material');
	},
	setFatMaterial : function(value) {
		this.set({ fat_material : value });
	}, 


	/** Get Informations of the model
	*/
	getInformations : function(){
		var informations = {};

		informations.name = this.getName();

		if(!_.isEmpty(this.getImmat())){
			informations.infos = {};
			informations.infos.key = _.capitalize(app.lang.immat);
			informations.infos.value = this.getImmat();
		}

		return informations;
	},


	/** Model Initialization
	*/
	initialize: function(){
		//console.log('Equipment Model initialization');
	},


});