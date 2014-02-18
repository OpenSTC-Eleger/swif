define([
	'app',
	'genericModel',
	'moment'

], function(app, GenericModel, moment){

	'use strict';


	/******************************************
	* Request Model
	*/
	var RequestModel = GenericModel.extend({


		fields     : ['id', 'name', 'actions', 'tooltip', 'create_date', 'create_uid', 'date_deadline', 'description', 'manager_id', 'note', 'partner_address', 'partner_id', 'partner_name', 'partner_phone', 'partner_service_id', 'partner_type', 'partner_type_code', 'people_name', 'people_email', 'people_phone', 'refusal_reason', 'service_id', 'site1', 'site_details', 'state', 'intervention_assignement_id', 'has_equipment', 'equipment_id', 'is_citizen'],

		urlRoot    : '/api/openstc/intervention_requests',


		searchable_fields: [
			{ key: 'id',          type: 'numeric', label: 'N°' },
			{ key: 'name',        type: 'text',    label: app.lang.label },
			{ key: 'description', type: 'text',    label: app.lang.description }
		],


		getSite : function(type) {
			if(this.get('site1')){

				var returnVal;

				switch(type){
					case 'id':
						returnVal = this.get('site1')[0];
						break;
					case 'json':
						returnVal = {id: this.get('site1')[0], name: this.get('site1')[1]};
						break;
					default:
						returnVal = _.titleize(this.get('site1')[1].toLowerCase());
				}

				return returnVal;
			}
			else{
				return false;
			}
		},
		setSite : function(value, silent) {
			this.set({ site1 : value }, {silent: silent});
		},

		getEquipment : function(type) {

			if(this.onEquipment()){

				var returnVal;

				switch(type){
					case 'id':
						returnVal = this.get('equipment_id')[0];
						break;
					case 'json':
						returnVal = {id: this.get('equipment_id')[0], name: this.get('equipment_id')[1]};
						break;
					default:
						returnVal = _.titleize(this.get('equipment_id')[1].toLowerCase());
				}

				return returnVal;
			}
			else{
				return false;
			}
		},
		setEquipment : function(value, silent) {
			this.set({ equipment_id : value }, {silent: silent});
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

			var returnVal;
			switch(type){
				case 'id':
					returnVal = id;
					break;
				case 'json':
					returnVal = {id: id, name: name};
					break;
				default:
					returnVal = name;
			}

			return returnVal;
		},
		setService : function(value, silent) {
			this.set({ service_id : value }, {silent: silent});
		},


		// Claimer of the resquest //
		getClaimer: function(type){
			var returnVal;

			switch (type){
				case 'id':
					returnVal = this.get('partner_id')[0];
					break;
				case 'json':
					returnVal = {id: this.get('partner_id')[0], name: this.get('partner_id')[1]};
					break;
				default:
					returnVal = this.get('partner_id')[1];
			}

			return returnVal;
		},

		setClaimerType: function(value, silent){
			this.set({ partner_type : value }, {silent: silent});
		},
		getClaimerType: function(type){
			if(this.get('partner_type')){

				var returnVal;
				switch (type){
					case 'id':
						returnVal = this.get('partner_type')[0];
						break;
					case 'json':
						returnVal = {id: this.get('partner_type')[0], name: this.get('partner_type')[1]};
						break;
					default:
						returnVal = this.get('partner_type')[1];
				}

				return returnVal;
			}
		},

		setClaimer: function(value, silent){
			this.set({ partner_id : value }, {silent: silent});
		},
		setClaimerContact: function(value, silent){
			this.set({ partner_address : value }, {silent: silent});
		},


		getClaimerPhone: function(){
			return this.get('partner_phone');
		},

		getClaimerContact: function(type){
			if(this.get('partner_address')){

				var returnVal;
				switch (type){
					case 'id':
						returnVal = this.get('partner_address')[0];
						break;
					case 'json':
						returnVal = {id: this.get('partner_address')[0], name: this.get('partner_address')[1]};
						break;
					default:
						returnVal = this.get('partner_address')[1];
				}

				return returnVal;
			}
		},


		getManager: function(type){

			var returnVal;
			switch(type){
				case 'id':
					returnVal = this.get('manager_id')[0];
					break;
				default:
					returnVal = _.capitalize(this.get('manager_id')[1]);
			}

			return returnVal;
		},

		getCreateDate: function(type){

			var returnVal;
			switch(type){
				case 'fromNow':
					returnVal = moment(this.get('create_date'), 'YYYY-MM-DD HH:mm:ss').add('hours',1).fromNow();
					break;
				default:
					returnVal = moment(this.get('create_date'), 'YYYY-MM-DD HH:mm:ss').add('hours',1).format('LLL');
			}

			return returnVal;
		},

		getCreateAuthor: function(type){

			var returnVal;
			switch(type){
				case 'id':
					returnVal = this.get('create_uid')[0];
					break;
				default:
					returnVal = _.capitalize(this.get('create_uid')[1]);
			}

			return returnVal;
		},

		onEquipment: function(){
			return this.get('has_equipment');
		},
		setOnEquipment : function(value, silent) {
			this.set({ has_equipment : value }, {silent: silent});
		},

		fromCitizen: function(){
			return this.get('is_citizen');
		},
		setFromCitizen: function(value, silent){
			this.set({ is_citizen : value }, {silent: silent});
		},


		getCitizenName: function(){
			if(this.fromCitizen()){
				return this.get('people_name');
			}
		},
		setCitizenName: function(value, silent){
			this.set({ people_name : value }, {silent: silent});
		},

		getCitizenPhone: function(){
			if(this.fromCitizen()){
				return this.get('people_phone');
			}
		},
		setCitizenPhone: function(value, silent){
			this.set({ people_phone : value }, {silent: silent});
		},
		getCitizenEmail: function(){
			if(this.fromCitizen()){
				return this.get('people_email');
			}
		},
		setCitizenEmail: function(value, silent){
			this.set({ people_email : value }, {silent: silent});
		},


		getPlaceDetails: function(){
			return this.get('site_details');
		},
		setPlaceDetails: function(value, silent) {
			this.set({ site_details : value }, {silent: silent});
		},


		getInformations: function(){
			return this.get('tooltip');
		},


		/** Model Initialization
		*/
		initialize: function () {
			//console.log("Request Model Initialization");
		},

	}, {

		// Status of the requests //
		status : {
			wait: {
				key        : 'wait',
				color      : 'info',
				translation: app.lang.wait
			},
			valid: {
				key        : 'valid',
				color      : 'success',
				translation: app.lang.valid
			},
			confirm: {
				key        : 'confirm',
				color      : 'warning',
				translation: app.lang.confirm
			},
			refused: {
				key        : 'refused',
				color      : 'danger',
				translation: app.lang.refused
			},
			closed: {
				key        : 'closed',
				color      : 'default',
				translation: app.lang.finished
			}
		},


		// Actions of the requests //
		actions : {
			valid: {
				key        : 'valid',
				color      : 'success',
				icon       : 'fa-check',
				translation: app.lang.actions.validate
			},
			confirm: {
				key        : 'confirm',
				color      : 'warning',
				icon       : 'fa-level-up',
				translation: app.lang.actions.confirmChief
			},
			refused: {
				key        : 'refused',
				color      : 'danger',
				icon       : 'fa-times',
				translation: app.lang.actions.refuse
			},
		}

	});

	return RequestModel;

});