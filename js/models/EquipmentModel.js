/******************************************
* Equipment Model
*/
app.Models.Equipment = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.equipment',
	
	url: "/equipment/:id",

	
	defaults:{
		id:0,
		name: null,
		marque: null,
		type: null,
		usage: null,
		cv: 0,
		year: 0,
		time: 0,
	},

	getName : function() {
        return this.get('name');
    },
    setName : function(value) {
    	if( value == 'undefined') return;
        this.set({ name : value });
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

	/** Model Initialization
	*/
	initialize: function(){
		console.log('Equipment Model initialization');
	},



	/** Model Parser */
	parse: function(response) {    	
		return response;
	},


	update: function(params) {
		this.setName( params.name );
		this.setMarque( params.marque );
		this.setType( params.type );
		this.setUsage( params.usage );
		this.setCV( params.cv );
		this.setYear( params.year );
		this.setTime( params.time );
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
