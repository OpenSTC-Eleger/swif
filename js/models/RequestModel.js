/******************************************
* Request Model
*/
app.Models.Request = app.Models.GenericModel.extend({


	fields     : ['id', 'name', 'actions', 'tooltip', 'create_date', 'create_uid', 'date_deadline', 'description', 'manager_id', 'note', 'partner_address', 'partner_id', 'partner_phone', 'partner_service_id', 'partner_type', 'partner_type_code', 'people_name', 'people_email', 'people_phone', 'refusal_reason', 'service_id', 'site1', 'site_details', 'state', 'intervention_assignement_id'],

	urlRoot    : '/api/openstc/intervention_requests',


	searchable_fields: [
		{
			key  : 'id',
			type : 'numeric'
		},
		{
			key  : 'name', 
			type : 'text'
		}
	],


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
	setSite : function(value, silent) {
		this.set({ site1 : value }, {silent: silent});
	},

	getDescription : function() {
		if(this.get('description')){
			return this.get('description');
		}
	},
	setDescription : function(value, silent) {
		this.set({ description : value }, {silent: silent});
	},
	
	getRefusalReason : function() {
		return this.get('refusal_reason');
	},
	setRefusalReason  : function(value, silent) {
		this.set({ refusal_reason : value }, {silent: silent});
	},

	getState : function() {
		return this.get('state');
	},
	setState : function(value, silent) {
		this.set({ state : value }, {silent: silent});
	},

	// Note for the DST //
	getNote : function() {
		return this.get('note');
	},
	setNote : function(value) {
		this.set({ note : value });
	},

	getService : function(type) {
		var id = this.get('service_id')[0];
		var name = _.titleize(this.get('service_id')[1].toLowerCase());

		switch(type){
			case 'id': 
				return id;
			break;
			case 'json':
				return {id: id, name: name};
			break;
			default:
				return name;
		}
	},
	setService : function(value) {
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


	/** Model Initialization
	*/
	initialize: function (model) {
		//console.log("Request Model Initialization");

		// Set the translation for the states / actions //
		app.Models.Request.status.wait.translation     = app.lang.wait;
		app.Models.Request.status.valid.translation    = app.lang.valid;
		app.Models.Request.status.confirm.translation  = app.lang.confirm;
		app.Models.Request.status.refused.translation  = app.lang.refused;
		app.Models.Request.status.closed.translation   = app.lang.finished;

		app.Models.Request.actions.valid.translation   = app.lang.actions.validate;
		app.Models.Request.actions.confirm.translation = app.lang.actions.confirmChief;
		app.Models.Request.actions.refused.translation = app.lang.actions.refuse;

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
			color 		: 'danger',
			translation : ''
		},
		closed: {
			key 		: 'closed',
			color 		: 'default',
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