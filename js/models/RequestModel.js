/******************************************
* Request Model
*/
app.Models.Request = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'openstc.ask',	
	
	url: "/#demandes-dinterventions/:id",
	
	relations: [
	            {
					type: Backbone.HasOne,
					key: 'site1',
					relatedModel: 'app.Models.Place',
					collectionType: 'app.Collections.Places',
					includeInJSON: true,
	            },
//				{
//					// Create a cozy, recursive, one-to-one relationship
//					type: Backbone.HasOne,
//					key: 'service_id',
//					relatedModel: 'app.Models.Request',
//					reverseRelation: {
//						key: 'asksBelongsto'
//					}
//				},
//				{
//					type: Backbone.HasOne,
//					key: 'service_id',
//					relatedModel: 'app.Models.ClaimerService',
//					collectionType: 'app.Collections.ClaimersServices',
//					includeInJSON: true,
//				},
            ],

    
    defaults: {
		id: null,
		name: "",
		description: "",
		deadline_date: null,
		belongsToAssignement: null,
		belongsToService: null,
		service_id: [],
	},

	getDescription : function() {
        return this.get('description');
    },
    setDescription : function(value) {
        this.set({ description : value });
    },
    
    getDeadline_date : function() {
        return this.get('deadline_date');
    },
    setDescription : function(value) {
        this.set({ deadline_date : value });
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
        this.set({ service_id : value });
    },
    
    getAssignement : function() {
        return this.get('belongsToAssignement');
    },
    setAssignement : function(value) {
        this.set({ belongsToAssignement : value });
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
		this.set({ description : params.description });
		this.set({ service_id : params.service_id });
		this.set({ intervention_assignement_id : params.intervention_assignement_id });
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
            color       : '',
            traduction  : '',  
        }
    ]

});