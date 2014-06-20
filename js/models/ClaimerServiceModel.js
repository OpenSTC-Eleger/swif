/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'genericModel',

], function(app, GenericModel){

	'use strict';


	/******************************************
	* Claimer Service Model
	*/
	var ClaimerServiceModel = GenericModel.extend({


		fields       : ['id', 'name', 'code', 'manager_id', 'elected_member_id', 'service_id', 'technical', 'user_ids', 'buying_threshold', 'actions'],

		urlRoot      : '/api/openstc/departments',


		searchable_fields: [
			{
				key  : 'name',
				type : 'text'
			},
			{
				key  : 'code',
				type : 'text'
			}
		],


		/** Check if the Service is a technical service
		*/
		isTechnical: function() {
			return this.get('technical');
		},

		getCode: function(){
			return this.get('code');
		},

		getParentService : function(type) {
			var id, name = '';

			// Check if the place have a parent place //
			if(this.get('service_id')){
				id = this.get('service_id')[0];
				name = _.titleize(this.get('service_id')[1].toLowerCase());
			}

			var returnVal;
			switch (type){
				case 'id':
					returnVal = id;
					break;
				case 'all':
					returnVal = this.get('service_id');
					break;
				case 'json':
					returnVal = {id: id, name: name};
					break;
				default:
					returnVal = name;
			}

			return returnVal;
		},

		getManager: function(type) {

			var id, name = '';

			// Check if the place have a parent place //
			if(this.get('manager_id')){
				id = this.get('manager_id')[0];
				name = _.titleize(this.get('manager_id')[1].toLowerCase());
			}

			var returnVal;

			switch (type){
				case 'id':
					returnVal = id;
					break;
				case 'all':
					returnVal = this.get('manager_id');
					break;
				case 'json':
					returnVal = {id: id, name: name};
					break;
				default:
					returnVal = name;
			}

			return returnVal;
		},


		getElectedMember: function(type) {

			var id, name = '';

			// Check if the place have a parent place //
			if(this.get('elected_member_id')){
				id = this.get('elected_member_id')[0];
				name = _.titleize(this.get('elected_member_id')[1].toLowerCase());
			}

			var returnVal;

			switch (type){
				case 'id':
					returnVal = id;
					break;
				case 'all':
					returnVal = this.get('manager_id');
					break;
				case 'json':
					returnVal = {id: id, name: name};
					break;
				default:
					returnVal = name;
			}

			return returnVal;
		},



		getUsersId: function(){
			return this.get('user_ids');
		},


		getActions: function(){
			return this.get('actions');
		},


		getBuyingThreshold: function(){
			return _.numberFormat(this.get('buying_threshold'), 2, '.', ' ');
		},


		/** Get Informations of the model
		*/
		getInformations : function(){
			var informations = {};

			informations.name = this.getName();

			if(!_.isEmpty(this.getCode())){
				informations.infos = {};
				informations.infos.key = _.capitalize(app.lang.code);
				informations.infos.value = this.getCode();
			}

			return informations;
		}

	});

	return ClaimerServiceModel;

});