/******************************************
* Absent Type Model
*/
app.Models.AbsentType = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.absent.type',	
	
	url: '/#absent/:id',

      
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
    
    getDescription : function() {
        return this.get('description');
    },
    setDescription : function(value) {
    	if( value == 'undefined') return;
        this.set({ description : value });
    }, 

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Absent type Request Model initialization');
    },



    /** Model Parser
    */
    parse: function(response) {    	
        return response;
    },
    

    
    update: function(params) {
		this.setName( params.name );
		this.setCode( params.code );
		this.setDescription( params.description );
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
