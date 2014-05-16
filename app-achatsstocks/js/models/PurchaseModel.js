define([
	'app',
	'appHelpers',
	'genericModel',
	


], function(app, AppHelpers, GenericModel){

	'use strict';
	
	/******************************************
	* Booking Model
	*/
	return GenericModel.extend({
		
		urlRoot: '/api/open_achats_stock/purchases',

		fields: ['id', 'name', 'description', 'service_id', 'partner_id', 'amount_total', 'state'],
		
		//readonlyFields: ['contract_line_names', 'contract_line', 'id', 'state'],
		
		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric',
				label: 'N°'
			},
			{
				key  : 'name',
				type : 'text',
				label: 'Libellé'
			}
		],
		
		getUserMainAction: function(){
			return 'confirm';
		},
		/**
		 * Method used to compute actions authorized for user, and compute the mainAction to display on itemListViews
		 */
		getUserActions: function(){
			var actions = this.getAttribute('actions',[]);
			var mainAction = this.getUserMainAction();
			return {mainAction: mainAction, otherActions: _.without(actions, mainAction)};
		},
		
		getId: function(){
			return this.get('id');
		},
		
		getName: function(){
			return this.get('name');
		},
		
		getInformations: function(){
			var ret = {};
			ret.name = this.getAttribute('name','');
			return ret;
		},
		
		addLineToRemove: function(model){
			this.linesToRemove.push([2,model.get('id')]);
		},

		
		saveToBackend: function(){
			var self = this;
			var vals = this.getSaveVals();
			//vals.contract_line = this.linesToRemove;
			var ret = this.save(vals,{patch:!this.isNew(), wait:true}).then(function(data){
				if(self.isNew()){
					self.set({id:data});
				}
				return self.fetch();
			});
			return ret;
		},
		
		/** Model Initialization
		*/
		initialize: function(){
			this.linesToRemove = [];
		},
	
	
	}, {
		// Request State Initialization //
		status : {
			confirm: {
				key					: 'confirm',
				color				: 'success',
				translation			: app.lang.valid
			},
			done: {
				key					: 'done',
				color				: 'default',
				icon				: 'fa-thumbs-o-up',
				translation			: app.lang.closed
			},
			
		},
		
			// Actions of the requests //
		actions : {
		}
	});
});