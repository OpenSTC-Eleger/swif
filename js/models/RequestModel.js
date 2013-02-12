/******************************************
* Request Model
*/
app.Models.Request = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'openstc.ask',	
	
	url: "/#demandes-dinterventions/:id",
	
	relations: [{
		type: Backbone.HasMany,
		key: 'intervention_ids',
		relatedModel: 'app.Models.Intervention',
		collectionType: 'app.Collections.Interventions',
		includeInJSON: true,
		reverseRelation: {
			type: Backbone.HasOne,
			key: 'ask',
			includeInJSON: ['id','manager_id'],
		}
	}],
	
	defaults: {
		id: 0,
		name: "",
		site1:"",
		state: "",
		description: "",
		date_deadline: "",
		belongsToAssignement: "",
		belongsToService: "",
		service_id: [],
		note: "",
		refusal_reason: "",
		test: "",
		infoMessage: null,
		intervention_ids : []
	},

    
	getId : function() {
        return this.get('id');
    },
    setName : function(value) {
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
    
    getInfoMessage : function() {
        return this.get('infoMessage');
    },
    setInfoMessage : function(value) {
    	if( value == 'undefined') return;
        this.set({ infoMessage : value });
    },
    
    getSite1 : function() {
        return this.get('site1');
    },
    setSite1 : function(value) {
    	if( value == 'undefined') return;
        this.set({ site1 : value });
    },

	getDescription : function() {
        return this.get('description');
    },
    setDescription : function(value) {
    	if( value == 'undefined') return;
        this.set({ description : value });
    },
    
    getDeadline_date : function() {
        return this.get('date_deadline');
    },
    setDeadline_date : function(value) {
    	if( value == 'undefined') return;
        this.set({ date_deadline : value });
    },
    
    setDescription : function(value) {
    	if( value == 'undefined') return;
        this.set({ deadline_date : value });
    },
    
	getRefusalReason : function() {
        return this.get('refusal_reason');
    },
    setRefusalReason  : function(value) {
    	if( value == 'undefined') return;
        this.set({ refusal_reason : value });
    },
    
    getState : function() {
        return this.get('state');
    },
    setState : function(value) {
    	if( value == 'undefined') return;
        this.set({ state : value });
    },
    
    getNote : function() {
        return this.get('note');
    },
    setNote : function(value) {
    	if( value == 'undefined') return;
        this.set({ note : value });
    },
    
//    getService : function() {
//        return this.get('belongsToService');
//    },
//    setService : function(value) {
//        this.set({ belongsToService : value });
//    },

    getService : function() {
        return this.get('service_id');
    },
    setService : function(value) {
    	if( value == 'undefined') return;
        this.set({ service_id : value });
    },
    
    getAssignement : function() {
        return this.get('belongsToAssignement');
    },
    setAssignement : function(value) {
    	if( value == 'undefined') return;
    	this.set({ belongsToAssignement : value });
    },

    getInterventions : function() {
        return this.get('intervention_ids');
    },
    setInterventions : function(value) {
    	if( value == 'undefined') return;
    	this.set({ intervention_ids : value });
    },




	/** Model Initialization
	*/
	initialize: function (model) {
	   	console.log("Request Model Initialization");

	   	// Initialization Traduction request state //
	   	app.Models.Request.state[0].traduction = app.lang.refused;
	   	app.Models.Request.state[1].traduction = app.lang.wait;
	   	app.Models.Request.state[2].traduction = app.lang.confirm;
	   	app.Models.Request.state[3].traduction = app.lang.valid;
	   	app.Models.Request.state[4].traduction = app.lang.closed;
	   	//this.fetchRelated('service_id');
	   	//this.fetchRelated('site1');
	   	//this.fetchRelated(this.relations[key]);
	   	//this.fetchRelated("site1");
	},



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },


	/** Save Model
	*/
	save: function(data,options) { 
		app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(), options);
	},
	
	update: function(params) {
		this.setDescription( params.description );
		//this.setService( params.service_id );
		//this.setAssignement( params.intervention_assignement_id );
		this.setState( params.state );
		this.setRefusalReason( params.refusal_reason );
		this.setNote( params.note );
		this.setDeadline_date( params.date_deadline);
		//this.set({ service_id : params.service_id });
	},

	/** Destroy Model
	*/
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
            value       : 'refused',
            color       : 'important',
            traduction  : '',
        },
        {
            value       : 'wait',
            color       : 'info',
            traduction  : '',
        },
        {
            value       : 'confirm',
            color       : 'warning',
            traduction  : '', 
        },
        {
            value       : 'valid',
            color       : 'success',
            traduction  : '',   
        },
        {
            value       : 'closed',
            color       : 'muted',
            traduction  : '',  
        }
    ]

});