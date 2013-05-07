/******************************************
* Claimer Model
*/
app.Models.Claimer = Backbone.RelationalModel.extend({
    
	// Model name in the database //
	model_name : 'res.partner',	
	
	url: "/#demandeurs/:id",


	relations: [
        {
			type: Backbone.HasMany,
			key: 'address',
			relatedModel: 'app.Models.ClaimerContact',
			includeInJSON: true,
	        reverseRelation: {
				type: Backbone.HasOne,
	            key: 'livesIn',
	            includeInJSON: true,
	        }
        },
    ],
    
    
    defaults:{
		id:0,
		name: null,
		type_id: null,
		service_id: null,
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
    
    getServiceId : function() {
        return this.get('service_id');
    },
    setServiceId : function(value) {
    	if( value == 'undefined') return;
        this.set({ service_id : value });
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
	
    
	/** Model Initialization
	*/
    initialize: function(){
        console.log('Claimer Model initialization');
        this.fetchRelated('service_id');
    },



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },



    update: function( params ) {
    	this.setName(params.name);
		this.setTypeId( params.type_id );
		this.setServiceId( params.service_id );
		this.setTechnicalServiceId( params.technical_service_id );
		this.setTechnicalSiteId( params.technical_site_id );		
	},
	


	/** Save Model
	*/
	save: function(data,id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(),options);
	},
	


	/** Delete Claimer
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
