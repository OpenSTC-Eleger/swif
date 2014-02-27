/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericModel',
	'bookableModel'

], function(app, GenericModel, BookableModel){

	'use strict';


	/******************************************
	* Booking Model
	*/
	var bookingLine = GenericModel.extend({

		urlRoot: '/api/openresa/booking_lines',

		fields : ['id', 'name', 'reserve_product', 'qte_dispo', 'qte_reserves', 'pricelist_amount','dispo'],


		searchable_fields: [
			{ key: 'id', type : 'numeric' },
			{ key: 'name', type : 'text' }
		],

		getId: function(){
			return this.get('id');
		},

		getName: function(){
			return this.get('name');
		},

		getResource : function(type) {
			if(this.get('reserve_product')){

				var returnVal;
				switch(type){
					case 'id':
						returnVal = this.get('reserve_product')[0];
						break;
					default:
						returnVal = _.titleize(this.get('reserve_product')[1].toLowerCase());
				}

				return returnVal;
			}
			else{
				return false;
			}
		},

		getAvailableQtity: function(){
			return this.get('qte_dispo');
		},

		setAvailableQtity: function(qty){
			this.set({qte_dispo:qty},{silent:true});
			this.updateAvailable();
		},

		getQuantity: function(){
			return this.get('qte_reserves');
		},

		setQuantity: function(qty){
			this.set({qte_reserves:qty},{silent:true});
			this.updateAvailable();
		},

		getAvailable: function(){
			return this.get('dispo');
		},

		// not really a setter, used by other setters of the module to trigger change event
		updateAvailable: function(){
			this.set({dispo:this.getAvailableQtity() >= this.getQuantity()});
		},

		getPricing: function(){
			return this.get('pricelist_amount');
		},

		fetchAvailableQtity: function(checkin, checkout){
			var self = this;
			var deferred = $.Deferred();
			$.ajax({
				url:'/api/openresa/bookables/' + self.getResource('id') + '/available_quantity',
				type: 'GET',
				data: app.objectifyFilters({
					checkin:checkin,
					checkout:checkout
				}),
				success: function(data){
					self.setAvailableQtity(data);
					deferred.resolve();
				},
				error: function(e){
					console.log(e);
					deferred.reject();
				}
			});
			return deferred;
		},

		fetchPricing: function(partner_id, checkin, checkout){
			var self = this;
			var prodAndQty = [{prod_id:this.getResource('id'),qty:this.getQuantity()}];
			return $.when($.ajax({
					url:'/api/open_object/partners/' + partner_id + '/get_bookables_pricing',
					type: 'GET',
					data: app.objectifyFilters({
						checkin:checkin,
						checkout:checkout,
						prodAndQties:prodAndQty
					}),
					success: function(data){
						self.set({pricelist_amount:data[self.getResource('id').toString()]});
					},
					error: function(e){
						console.log(e);
					}
				})
			);
		},

		getParentBookingModel: function(){
			return this.parentBookingModel;
		},


		setParentBookingModel: function	(model){
			this.parentBookingModel = model;
			if(!model.isNew()){
				this.set({line_id:model.getId()});
			}
		},

		setBookable: function(idBooking, nameBooking){
			this.bookable = new BookableModel({id:idBooking});
			this.set({reserve_product:[idBooking,nameBooking]});
		},


		saveToBackend: function(){
			var self = this;
			var vals = {
				reserve_product:this.getResource('id'),
				qte_reserves:this.getQuantity(),
				pricelist_amount: this.getPricing()
			};

			//if new, POST new values and fetch the model to retrieve values stored on backend
			if(this.isNew()){
				vals.line_id = this.parentBookingModel.getId();
				return this.save(vals, {silent:true, wait:true}).done(function(data){
					self.set({id:data},{silent:true});
					self.fetch({silent:true});
				});
			}
			//if new, PATCH updated values and fetch the model to retrieve values updated on backend
			else{
				return this.save(vals, {silent:true, wait:true,patch:true}).done(function(){
					self.fetch({silent:true});
				});
			}
			return false;
		},



		destroyOnBackend: function(){
			this.getParentBookingModel().lines.remove(this);
			this.getParentBookingModel().linesToRemove.add(this.clone().off());
			this.bookable = null;
			this.set({id:null},{silent:true});
			this.destroy();
		},



		/** Model Initialization
		*/
		initialize: function(){
			//console.log('Booking Model initialization');
			this.parentBookingModel = null;
		},


	}, {
		// BookingLine State Initialization //
		status : {
			dispo:{
				icon : 'fa fa-check',
				key  : 'dispo',
				color: 'success'
			},
			not_dispo:{
				icon : 'fa fa-times',
				key  : 'not_dispo',
				color: 'danger'
			}
		}

	});

	return bookingLine;

});