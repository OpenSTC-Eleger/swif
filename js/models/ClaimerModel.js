/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericModel',
	'claimersContactsCollection',
	'appHelpers'

], function(app, GenericModel, ClaimersContactsCollection, AppHelpers){

	'use strict';


	/******************************************
	* Claimer Model
	*/
	var ClaimerModel = GenericModel.extend({

		urlRoot : '/api/open_object/partners',

		defaults:{
			name: null,
			type_id: null,
			technical_service_id: null,
			technical_site_id: null,
		},

		getId: function(){
			return this.get('id');
		},

		setId: function(value){
			this.set({ id: value });
		},

		getName : function() {
			return this.get('name');
		},
		setName : function(value) {
			this.set({ name: value });
		},

		getTypeId : function() {
			return this.get('type_id');
		},

		setTypeId : function(value) {
			this.set({ type_id: value });
		},

		getTechnicalService : function(type) {
			if(this.get('technical_service_id')){

				var val;

				switch (type){
					case 'id':
						val = this.get('technical_service_id')[0];
						break;
					case 'json':
						val = {id: this.get('technical_service_id')[0], name: this.get('technical_service_id')[1]};
						break;
					default:
						val = this.get('technical_service_id')[1];
				}

				return val;
			}
			else{
				return false;
			}
		},
		setTechnicalService : function(value) {
			this.set({ technical_service_id: value });
		},

		getTechnicalSite : function(type) {
			if(this.get('technical_site_id')){

				var val;
				switch (type){
					case 'id':
						val = this.get('technical_site_id')[0];
						break;
					case 'json':
						val =  {id: this.get('technical_site_id')[0], name: this.get('technical_site_id')[1]};
						break;
					default:
						return this.get('technical_site_id')[1];
				}

				return val;
			}
			else{
				return false;
			}
		},
		setTechnicalSite : function(value) {
			this.set({ technical_site_id: value });
		},

		getClaimerType : function() {
			return this.get('type_id');
		},

		setClaimerType : function(value) {
			this.set({ type_id: value });
		},

		getAddresses: function () {
			var collection = new ClaimersContactsCollection();

			collection.fetch({
				data   : {filters: {0: {field: 'partner_id.id', operator: '=', value: this.get('id')}}},
				reset : true
			})
			.done(function() {
				collection.trigger('fetchDone');
			});

			return collection;
		},

		getInformations: function () {
			return {name: this.get('name')};
		},

		// Returns the many2one id fields in form of an object {name:'name',id:'id'}
		objectifiedTypeId : function () {
			return AppHelpers.many2oneObjectify(this.get('type_id'));
		},
		objectifiedTechnicalServiceId : function () {
			return AppHelpers.many2oneObjectify(this.get('technical_service_id'));
		},
		objectifiedTechnicalSiteId : function () {
			return AppHelpers.many2oneObjectify(this.get('technical_site_id'));
		},

	});


	return ClaimerModel;

});