/******************************************
* Place Model
*/
app.Models.Place = Backbone.RelationalModel.extend({
	
	model_name : 'openstc.site',	
    
	url: "/#places/:id",
	
	relations: [ {
		type: Backbone.HasMany,
		key: 'asksBelongsto',
		relatedModel: 'app.Models.Request',
		//includeInJSON: true,
	    reverseRelation: {
			type: Backbone.HasOne,
			key: 'belongsToSite',
			includeInJSON: 'id',
		}
	},],

	
	defaults:{
		id:0,
		name: null,
		type: 0,
		service: 0,
		site_parent_id: 0,
		width: null,
		lenght: null,
		surface: null,
	},
	
	getSurface : function() {
        return this.get('type');
    },
    setSurface : function(value) {
    	if( value == 'undefined') return;
        this.set({ surface : value });
    }, 
	
	getLenght : function() {
        return this.get('type');
    },
    setLenght : function(value) {
    	if( value == 'undefined') return;
        this.set({ lenght : value });
    },  
	
	getWidth : function() {
        return this.get('type');
    },
    setWidth : function(value) {
    	if( value == 'undefined') return;
        this.set({ width : value });
    },  	

	getParent : function() {
        return this.get('type');
    },
    setParent : function(value) {
    	if( value == 'undefined') return;
        this.set({ site_parent_id : value });
    },  
	
	getService : function() {
        return this.get('type');
    },
    setService : function(value) {
    	if( value == 'undefined') return;
        this.set({ service : value });
    },  

	getType : function() {
        return this.get('type');
    },
    setType : function(value) {
    	if( value == 'undefined') return;
        this.set({ type : value });
    },  

	getName : function() {
        return this.get('name');
    },
    setName : function(value) {
    	if( value == 'undefined') return;
        this.set({ name : value });
    },  

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Place Model initialization');
    },

    
    /** Model Parser */
    parse: function(response) {    	
        return response;
    },
    
    update: function(params) {
		this.setName( params.name );
		this.setType( params.type );
		this.setService( params.service );
		this.setParent( params.site_parent_id );
		this.setWidth( params.width );
		this.setLenght( params.lenght );
		this.setSurface( params.surface );
	},
    
    /** Save Model
	*/
	save: function(data,options) { 
		app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(),options);
		//this.save(params)
	},

	
	/** Delete place
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