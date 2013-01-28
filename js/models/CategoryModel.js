/******************************************
* Assignement Request Model
*/
app.Models.Category = Backbone.RelationalModel.extend({
    
	model_name : 'openstc.task.category',	
	
	url: "/#category/:id",

	relations: [
            {
				type: Backbone.HasMany,
				key: 'tasksAssigned',
				relatedModel: 'app.Models.Task',
		        reverseRelation: {
					type: Backbone.HasOne,
		            key: 'belongsToCategory',
		            includeInJSON: 'id',
		        }
            },
      ],
      
    defaults:{
		id:0,
		name: null,
		code: null,
		unit: null,
		parent_id: null,
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
    
    getUnit : function() {
        return this.get('unit');
    },
    setUnit : function(value) {
    	if( value == 'undefined') return;
        this.set({ unit : value });
    }, 
    
    getParent : function() {
        return this.get('parent_id');
    },
    setParent : function(value) {
    	if( value == 'undefined') return;
        this.set({ parent_id : value });
    },  

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Category Request Model initialization');
    },



    /** Model Parser
    */
    parse: function(response) {    	
        return response;
    },
    
    update: function(params) {
		this.setName( params.name );
		this.setCode( params.code );
		this.setUnit( params.unit );
		this.setParent( params.parent_id );
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
