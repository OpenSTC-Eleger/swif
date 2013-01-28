/******************************************
* Place Model
*/
app.Models.ClaimerType = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.partner.type',
	
	url: "/type-demandeurs/:id",


	relations: [{
		type: Backbone.HasMany,
		key: 'claimers',
		relatedModel: 'app.Models.Claimer',
		collectionType: 'app.Collections.Claimers',
		includeInJSON: true,
	}],
	
	defaults:{
		id:0,
		name: null,
		code: null,
	},
      
	getName : function() {
        return this.get('name');
    },
    setName : function(value) {
    	if( value == 'undefined') return;
        this.set({ name : value });
    },  
    
    getCode : function() {
        return this.get('code');
    },
    setCode : function(value) {
    	if( value == 'undefined') return;
        this.set({ code : value });
    }, 



	/** Model Initialization
	*/
	initialize: function(){
		console.log('Claimer Type Model initialization');
		this.fetchRelated('claimers');
	},



	/** Model Parser */
	parse: function(response) {    	
		return response;
	},


	update: function(params) {
		this.setName( params.name );
		this.setCode( params.code );
	},


	test:function(){console.debug("coucou")},
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
