/******************************************
* Equipment Model
*/
app.Models.Equipment = app.Models.GenericModel.extend({
	
	urlRoot: "/api/openstc/equipments",
	
	fields : ['id', 'name', 'maintenance_service_ids', 'internal_use', 'service_ids', 'immat', 'marque', 'usage', 'type', 'cv', 'year', 'time', 'km', 'energy_type', 'length_amort', 'purchase_price', 'default_code', 'categ_id', 'service_names', 'maintenance_service_names', 'complete_name', 'warranty', 'hour_price'],


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

	getEnergy: function(){
		return this.get('energy_type');
	},

	getUsage : function() {
		return this.get('usage');
	},
	setUsage : function(value) {
		this.set({ usage : value });
	}, 

	getCategory : function(type) {
		switch (type){ 
			case 'id': 
				return this.get('categ_id')[0];
			break;
			case 'json':
				return {id: this.get('categ_id')[0], name: this.get('categ_id')[1]};
			break;
			default:
				return this.get('categ_id')[1];
		}
	},

	getCV : function() {
		return this.get('usage');
	},
	setCV : function(value) {
		this.set({ cv : value });
	}, 

	getKm : function() {
		return this.get('km');
	},
	setKm : function(value) {
		this.set({ km : value });
	}, 

	getYear : function() {
		if(this.get('year') != 0){
			return this.get('year');
		}
		else{
			return '';
		}
	},
	setYear : function(value) {
		this.set({ year : value });
	},

	getWarranty: function(){
		return this.get('warranty');
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

	getPurchasePrice: function(){
		return this.get('purchase_price');
	}


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