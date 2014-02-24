/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'genericModel',
	'moment'

], function(app, GenericModel, moment){

	'use strict';


	/******************************************
	* Equipment Model
	*/
	var EquipmentModel = GenericModel.extend({

		urlRoot: '/api/openstc/equipments',

		fields : ['id', 'name', 'maintenance_service_ids', 'internal_use', 'immat', 'marque', 'usage', 'type', 'cv',
					'year', 'time', 'km', 'energy_type', 'length_amort', 'purchase_price', 'default_code', 'categ_id',
					'service_names', 'maintenance_service_names', 'complete_name', 'warranty_date','built_date',
					'purchase_date', 'hour_price', 'internal_booking','external_booking','service_bookable_ids',
					'service_bookable_names','partner_type_bookable_ids', 'partner_type_bookable_names',
					'qty_available', 'product_product_id','color', 'block_booking'],


		searchable_fields: [
			{ key  : 'name', type : 'text' },
			{ key  : 'immat', type : 'text' }
		],

		getImmat : function() {
			return this.get('immat');
		},
		setImmat : function(value) {
			this.set({ immat : value });
		},


		getService : function() {
			return this.get('service');
		},
		setService : function(value) {
			this.set({ service : value });
		},

		//service IDs //
		getServices : function(type){

			var equipmentServices = [];

			_.each(this.get('service_names'), function(s){
				switch (type){
					case 'id':
						equipmentServices.push(s[0]);
						break;
					case 'json':
						equipmentServices.push({id: s[0], name: s[1]});
						break;
					default:
						equipmentServices.push(s[1]);
				}
			});

			if(type == 'string'){
				return _.toSentence(equipmentServices, ', ', ' '+app.lang.and+' ');
			}
			else{
				return equipmentServices;
			}
		},
		setServices : function(value, silent) {
			this.set({ service_ids : [[6, 0, value]] }, {silent: silent});
		},


		getMaintenanceServiceNames : function(type){

			var equipmentServices = [];

			_.each(this.get('maintenance_service_names'), function(s){
				switch (type){
					case 'id':
						equipmentServices.push(s[0]);
						break;
					case 'json':
						equipmentServices.push({id: s[0], name: s[1]});
						break;
					default:
						equipmentServices.push(s[1]);
				}
			});

			if(type === 'string'){
				return _.toSentence(equipmentServices, ', ', ' '+app.lang.and+' ');
			}
			else{
				return equipmentServices;
			}
		},

		getInternalBooking: function(){
			return this.get('internal_booking');
		},

		setInternalBooking: function(val, silent){
			this.set({internal_booking: val},{silent:silent});
		},


		getBookingServices : function(type){

			var placeBookingServices = [];

			_.each(this.get('service_bookable_names'), function(s){
				switch (type){
					case 'id':
						placeBookingServices.push(s[0]);
						break;
					case 'json':
						placeBookingServices.push({id: s[0], name: s[1]});
						break;
					default:
						placeBookingServices.push(s[1]);
				}
			});

			if(type == 'string'){
				return _.toSentence(placeBookingServices, ', ', ' '+app.lang.and+' ');
			}
			else{
				return placeBookingServices;
			}
		},

		setBookingServices: function(val, silent){
			this.set({service_bookable_ids: [[6,0,val]]},{silent:silent});
		},

		getExternalBooking: function(){
			return this.get('external_booking');
		},

		setExternalBooking: function(val, silent){
			this.set({external_booking: val},{silent:silent});
		},

		getBookingClaimers : function(type){

			var placeBookingClaimers = [];

			_.each(this.get('partner_type_bookable_names'), function(s){
				switch (type){
					case 'id':
						placeBookingClaimers.push(s[0]);
						break;
					case 'json':
						placeBookingClaimers.push({id: s[0], name: s[1]});
						break;
					default:
						placeBookingClaimers.push(s[1]);
				}
			});

			if(type == 'string'){
				return _.toSentence(placeBookingClaimers, ', ', ' '+app.lang.and+' ');
			}
			else{
				return placeBookingClaimers;
			}
		},

		setBookingClaimers: function(val, silent){
			this.set({partner_type_bookable_ids: [[6,0,val]]},{silent:silent});
		},

		getAvailableQty: function(){
			return this.get('qty_available');
		},

		getMarque : function() {
			return this.get('marque');
		},
		setMarque : function(value) {
			this.set({ marque : value });
		},

		getCode : function() {
			return this.get('default_code');
		},

		getType : function() {
			return this.get('type');
		},
		setType : function(value) {
			this.set({ type : value });
		},

		getEnergy: function(){
			return this.get('energy_type');
		},

		getUsage : function() {
			return this.get('usage');
		},
		setUsage : function(value) {
			this.set({ usage : value });
		},

		getCategory : function(type) {

			var returnCat;

			switch (type){
				case 'id':
					returnCat = this.get('categ_id')[0];
					break;
				case 'json':
					returnCat = {id: this.get('categ_id')[0], name: this.get('categ_id')[1]};
					break;
				default:
					returnCat = this.get('categ_id')[1];
			}

			return returnCat;
		},

		getCV : function() {
			return this.get('usage');
		},
		setCV : function(value) {
			this.set({ cv : value });
		},

		getKm : function() {
			return _.numberFormat(this.get('km'), 0, '.', ' ');
		},
		setKm : function(value) {
			this.set({ km : value });
		},

		getYear : function() {
			if(this.get('year') !== 0){
				return this.get('year');
			}
			else{
				return '';
			}
		},
		setYear : function(value) {
			this.set({ year : value });
		},


		getTime : function() {
			return _.numberFormat(this.get('time'), 0, '.', ' ');
		},
		setTime : function(value) {
			this.set({ time : value });
		},

		isTechnicalVehicle : function() {
			return this.get('technical_vehicle');
		},
		setTechnicalVehicle : function(value) {
			this.set({ technical_vehicle : value });
		},

		isCommercialVehicle : function() {
			return this.get('commercial_vehicle');
		},
		setCommercialVehicle : function(value) {
			this.set({ commercial_vehicle : value });
		},

		isSmallMaterial : function() {
			return this.get('small_material');
		},
		setSmallMaterial : function(value) {
			this.set({ small_material : value });
		},

		isFatMaterial : function() {
			return this.get('fat_material');
		},
		setFatMaterial : function(value) {
			this.set({ fat_material : value });
		},

		getPurchasePrice: function(){
			return this.get('purchase_price');
		},

		getDateEndWarranty: function(type){
			var format = type;
			if(_.isUndefined(format)){
				format = 'YYYY-MM-DD';
			}
			var ret = this.get('warranty_date');

			if(!ret){
				return '';
			}
			else{
				return moment(ret).format(format);
			}
		},

		getBuiltDate: function(type){
			var format = type;

			if(_.isUndefined(format)){
				format = 'YYYY-MM-DD';
			}
			var ret = this.get('built_date');

			if(!ret){
				return '';
			}
			else{
				return moment(ret).format(format);
			}
		},

		getPurchaseDate: function(type){
			var format = type;
			if(_.isUndefined(format)){
				format = 'YYYY-MM-DD';
			}
			var ret = this.get('purchase_date');

			if(!ret){
				return '';
			}
			else{
				return moment(ret).format(format);
			}
		},

		getHourPrice: function(){
			return this.get('hour_price');
		},

		getInternalUse: function(){
			return this.get('internal_use');
		},

		/** Get Informations of the model
		*/
		getLengthAmort: function(){
			return this.get('length_amort');
		},

		getInformations : function(){
			var informations = {};

			informations.name = this.getName();

			if(!_.isEmpty(this.getImmat())){
				informations.infos = {};
				informations.infos.key = _.capitalize(app.lang.immat);
				informations.infos.value = this.getImmat();
			}

			return informations;
		},

		getBookable: function(type){

			var returnVal;

			switch (type){
				case 'id':
					returnVal = this.get('product_product_id')[0];
					break;
				case 'json':
					returnVal = {id: this.get('product_product_id')[0], name: this.get('product_product_id')[1]};
					break;
				default:
					returnVal = this.get('product_product_id')[1];
			}

			return returnVal;
		},

		updateAvailableQty:function(newQuantity){

			return $.ajax({
				url:'/api/openresa/bookables/' + this.getBookable('id') + '/update_available_quantity',
				type:'GET',
				data: app.objectifyFilters({
					new_quantity: newQuantity
				})
			});
		},

		/** Model Initialization
		*/
		initialize: function(){
			//console.log('Equipment Model initialization');
			if (_.isUndefined(this.get('color'))) {
				this.set('color', ('#' + Math.floor(Math.random()*16777215).toString(16)));
			}
		}


	});

	return EquipmentModel;

});