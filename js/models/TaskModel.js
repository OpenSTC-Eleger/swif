/******************************************
* Request Model
*/
app.Models.Task = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'project.task',	
	
	url: "/#taches/:id",

	defaults:{
		id:0,
		effective_hours:0,
		total_hours: 0,
		remaining_hours: 0,
		state: null,
		user_id: null,
		date_end: null,
		date_start: null,
	},
	
    getId : function() {
        return this.get('id');
    },
    setId: function(value) {
    	if( value == 'undefined') return;
        this.set({ id : value });
    },
    getState : function() {
        return this.get('state');
    },
    setState : function(value) {
    	if( value == 'undefined') return;
        this.set({ state : value });
    },    
    getUserId : function() {
        return this.get('user_id');
    },
    setUserId : function(value) {
    	if( value == 'undefined') return;
        this.set({ user_id : value });
    },
    getDateEnd : function() {
        return this.get('date_end');
    },
    setDateEnd : function(value) {
    	if( value == 'undefined') return;
        this.set({ date_end : value });
    },
    getDateStart : function() {
        return this.get('date_start');
    },
    setDateStart : function(value) {
    	if( value == 'undefined') return;
        this.set({ date_start : value });
    },


//	relations: [
//	{
//		// Create a cozy, recursive, one-to-one relationship
//		type: Backbone.HasOne,
//		key: 'project_id',
//		relatedModel: 'app.Models.Intervention',
//		includeInJSON: true,
//		reverseRelation: {
//			key: 'tasks'
//		}
//	}],
	

	/** Model Initialization
	*/
	initialize: function (model) {
	   	console.log("Request task Initialization");
	},



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },
    
	/** Save Model
		*/
	
	save: function(data,options) { 
		app.saveOE(this.get("id"), data, this.model_name,app.models.user.getSessionID(), options);
	},
	
	update: function(params) {
		this.setState( params.state );
		this.setUserId( params.user_id );
		this.setDateEnd( params.date_end );
		this.setDateStart( params.date_start );
	},
	
	destroy: function (options) {	
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	},


}, {

// Request State Initialization //
state:  [        
	{
        value       : 'draft',
        color       : 'important',
        traduction  : '',
    },
    {
        value       : 'open',
        color       : 'info',
        traduction  : '',
    },
    {
        value       : 'pending',
        color       : 'warning',
        traduction  : '', 
    },
    {
        value       : 'done',
        color       : 'success',
        traduction  : '',   
    },
    {
        value       : 'cancelled',
        color       : '',
        traduction  : '',  
    }
]

});