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
			includeInJSON: ['id', 'manager_id', 'people_name', 'people_phone', 'partner_address', 'people_email', 'partner_id', 'partner_type', 'partner_phone', 'partner_email', 'intervention_assignement_id'],
		}
	}],
	
	defaults: {
		id: 0,
		name: "",
		site1:"",
		state: "",
		description: "",
		belongsToAssignement: "",
		belongsToService: "",
		service_id: [],
		note: "",
		refusal_reason: "",
		test: "",
		intervention_ids : []
	},

	
	
	getId : function() {
		return this.get('id');
	},
	setId : function(value) {
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

	getSite : function(type) {
		if(this.get('site1')){

			switch(type){
				case 'id': 
					return this.get('site1')[0];
				break;
				default:
					return _.titleize(this.get('site1')[1].toLowerCase());
			}
		}
	},
	setSite : function(value) {
		if( value == 'undefined') return;
		this.set({ site1 : value });
	},

	getDescription : function() {
		if(this.get('description')){
			return this.get('description');
		}
	},
	setDescription : function(value) {
		if( value == 'undefined') return;
		this.set({ description : value });
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
	
	// Note for the DST //
	getNote : function() {
		return this.get('note');
	},
	setNote : function(value) {
		if( value == 'undefined') return;
		this.set({ note : value });
	},

	getService : function(type) {
		switch(type){
			case 'id': 
				return this.get('service_id')[0];
			break;
			default:
				return _.capitalize(this.get('service_id')[1].toLowerCase());
		}
	},
	setService : function(value) {
		if( value == 'undefined') return;
		this.set({ service_id : value });
	},


	// Claimer of the resquest //
	getClaimer: function(type){
		var claimer = {}

		claimer.type = this.get('partner_type')[1]

		// Check if the claimer is a partner //
		if(this.get('partner_id')){
			claimer.id =  this.get('partner_id')[0];
			claimer.name = _.capitalize(this.get('partner_id')[1].toLowerCase());

			claimer.person = _.capitalize(this.get('partner_address')[1]);
		}
		// It's an Administré //
		else{
			claimer.name = _.capitalize(this.get('people_name'));
		}

		return claimer;
	},

	getManager: function(type){
		switch(type){
			case 'id': 
				return this.get('manager_id')[0];
			break;
			default:
				return _.capitalize(this.get('manager_id')[1]);
		}
	},

	getCreateDate: function(type){

		switch(type){
			case 'fromNow': 
				return moment(this.get('create_date'), 'YYYY-MM-DD HH:mm:ss').add('hours',1).fromNow();
			break;
			default:
				return moment(this.get('create_date'), 'YYYY-MM-DD HH:mm:ss').add('hours',1).format('LLL');
		}
	},

	getCreateAuthor: function(type){
		switch(type){
			case 'id': 
				return this.get('create_uid')[0];
			break;
			default:
				return _.capitalize(this.get('create_uid')[1]);
		}
	},

	getInformations: function(){
		return this.get('tooltip');
	},

	getActions: function(){
		return this.get('actions');
	},



	/** Model Initialization
	*/
	initialize: function (model) {
		//console.log("Request Model Initialization");

		// Set the translation for the states / actions //
		app.Models.Request.status.wait.translation = app.lang.wait;
		app.Models.Request.status.valid.translation = app.lang.valid;
		app.Models.Request.status.confirm.translation = app.lang.confirm;
		app.Models.Request.status.refused.translation = app.lang.refused;
		app.Models.Request.status.closed.translation = app.lang.finished;

		app.Models.Request.actions.valid.translation = app.lang.actions.validate;
		app.Models.Request.actions.confirm.translation = app.lang.actions.confirmChief;
		app.Models.Request.actions.refused.translation = app.lang.actions.refuse;

	},



	/** Save Model
	*/
	save: function(data,options) { 
		app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(), options);
	},


	update: function(params) {
		this.setDescription( params.description );
		this.setState( params.state );
		this.setRefusalReason( params.refusal_reason );
		this.setNote( params.note );
	},



	valid: function(params, options) {
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "valid", app.models.user.getSessionID(), options);
	},



}, {

	// Status of the requests //
	status : {
		wait: {
			key 		: 'wait',
			color 		: 'info',
			translation : ''
		},
		valid: {
			key 		: 'valid',
			color 		: 'success',
			translation : ''
		},
		confirm: {
			key 		: 'confirm',
			color 		: 'warning',
			translation : ''
		},
		refused: {
			key 		: 'refused',
			color 		: 'important',
			translation : ''
		},
		closed: {
			key 		: 'closed',
			color 		: 'muted',
			translation : ''
		}
	},

	
	// Actions of the requests //
	actions : {
		valid: {
			key 		: 'valid',
			color 		: 'success',
			icon 		: 'icon-ok',
			translation : ''
		},
		confirm: {
			key 		: 'confirm',
			color 		: 'warning',
			icon 		: 'icon-level-up',
			translation : ''
		},
		refused: {
			key 		: 'refused',
			color 		: 'danger',
			icon 		: 'icon-remove',
			translation : ''
		},
	}

});