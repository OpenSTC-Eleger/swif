/******************************************
* Claimer Model
*/
app.Models.Claimer = app.Models.GenericModel.extend({

	urlRoot : "/api/open_object/partners",

	defaults:{
		name: null,
		type_id: null,
		technical_service_id: null,
		technical_site_id: null,
	},

	getId: function(){
		return this.get('id');
	},
	
	setId: function(value){
		if( value == 'undefined') return;
        this.set({ id : value });
	},
	
	getName : function() {
        return this.get('name');
    },
    setName : function(value) {
    	if( value == 'undefined') return;
        this.set({ name : value });
    },  
	
	getTypeId : function() {
		return this.get('type_id');
	},

	setTypeId : function(value) {
		if( value == 'undefined') return;
		this.set({ type_id : value });
	}, 

	getTechnicalService : function(type) {
		if(this.get('technical_service_id')){

			switch (type){ 
				case 'id': 
					return this.get('technical_service_id')[0];
				break;
				case 'json':
					return {id: this.get('technical_service_id')[0], name: this.get('technical_service_id')[1]};
				break;
				default:
					return this.get('technical_service_id')[1];
			}
		}
		else{
			return false;
		}
	},
	setTechnicalService : function(value) {
		this.set({ technical_service_id : value });
	}, 
	
	getTechnicalSite : function(type) {
		if(this.get('technical_site_id')){

			switch (type){ 
				case 'id': 
					return this.get('technical_site_id')[0];
				break;
				case 'json':
					return {id: this.get('technical_site_id')[0], name: this.get('technical_site_id')[1]};
				break;
				default:
					return this.get('technical_site_id')[1];
			}
		}
		else{
			return false;
		}
	},
	setTechnicalSite : function(value) {
		this.set({ technical_site_id : value });
	},

	getClaimerType : function() {
		return this.get('type_id');
	},

	setClaimerType : function(value) {
		this.set({ type_id : value });
	},

	// Returns addresses collection fetched this is used in view to serialize object before template
	getAddresses: function () {
//		var address_ids = this.get('address');
		var collection = new app.Collections.ClaimersContacts
//		if (address_ids == false) {
//			return collection;
//		} else {

			collection.fetch({
//					data   : {filters: {0: {field: 'id', operator: 'in', value: this.get('address')}}},
					data   : {filters: {0: {field: 'partner_id.id', operator: '=', value: this.get('id')}}},
					reset : true
				}
			).done( function () {
					collection.trigger('fetchDone');
				})
			return collection;
//		}

	},
	getInformations: function () {
		return {name: this.get('name')};
	},



	// Returns the many2one id fields in form of an object {name:'name',id:'id'}
	objectifiedTypeId : function () {
		return app.Helpers.Main.many2oneObjectify(this.get('type_id'))
	},
	objectifiedTechnicalServiceId : function () {
		return app.Helpers.Main.many2oneObjectify(this.get('technical_service_id'))
	},
	objectifiedTechnicalSiteId : function () {
		return app.Helpers.Main.many2oneObjectify(this.get('technical_site_id'))
	},

});
