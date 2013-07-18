/******************************************
* Category Intervention  Model - Intervention classification for budget
*/
app.Models.CategoryIntervention = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.intervention.assignement',	
	
	url: '/#assignement/:id',

    defaults:{
		id:0,
		name: null,
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
        //console.log('Category Intervention Model initialization');
    },
    


    /** Model Parser */
    parse: function(response) {    	
        return response;
    },



    update: function(params) {
		this.setName(params.name);
		this.setCode(params.code);
	},
    

    
    /** Save Model
	*/
	save: function(data, id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(), options);
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
