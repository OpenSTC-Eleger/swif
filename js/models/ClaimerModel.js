/******************************************
* Claimer Model
*/
app.Models.Claimer = Backbone.Model.extend({

	urlRoot: "/api/open_object/partners",
	searchable_fields: [

		{
			key  : 'name',
			type : 'text'
		}
	],


    defaults:{
		name: null,
		type_id: null,
		technical_service_id: null,
		technical_site_id: null,
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

    getTechnicalServiceId : function() {
        return this.get('technical_service_id');
    },
    setTechnicalServiceId : function(value) {
    	if( value == 'undefined') return;
        this.set({ technical_service_id : value });
    }, 
    
    getTechnicalSiteId : function() {
        return this.get('technical_site_id');
    },
    setTechnicalSiteId : function(value) {
    	if( value == 'undefined') return;
        this.set({ technical_site_id : value });
    },

	getClaimerType : function() {
        return this.get('type_id');
    },

    setClaimerType : function(value) {
    	if( value == 'undefined') return;
        this.set({ type_id : value });
    },

	// Returns JSON addresses this is used in view to serialize object before template
	getAddresses: function () {
		var address_ids = this.get('address');
		var collection = new app.Collections.ClaimersContacts
		console.log(address_ids)
		if (address_ids == false) {
			return collection;
		} else {

			collection.fetch({
					data   : {filters: {0: {field: 'id', operator: 'in', value: this.get('address')}}},
					reset : true
				}
			).done( function () {
					collection.trigger('fetchDone');
				})
			return collection;
		}

	},

	objectifiedTypeId : function () {
		return app.Helpers.Main.many2oneObjectify(this.get('type_id'))
	},
	objectifiedTechnicalServiceId : function () {
		return app.Helpers.Main.many2oneObjectify(this.get('technical_service_id'))
	},
	objectifiedTechnicalSiteId : function () {
		return app.Helpers.Main.many2oneObjectify(this.get('technical_site_id'))
	},

	/** Model Initialization
	*/
    initialize: function(){

	},

    update: function( params ) {
    	this.setName(params.name);
		this.setTypeId( params.type_id );
		this.setTechnicalServiceId( params.technical_service_id );
		this.setTechnicalSiteId( params.technical_site_id );		
	},


//TODO remove this
//	/** Delete Claimer
//	*/
//	delete: function (options) {
//		app.deleteOE(
//			[[this.get("id")]],
//			this.model_name,
//			app.models.user.getSessionID(),
//			options
//		);
//	}

});
