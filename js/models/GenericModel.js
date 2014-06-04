/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'backbone',
	'appHelpers',
	'moment',

], function(Backbone, AppHelpers, moment){

	'use strict';

	/******************************************
	* Generic Model
	*/
	var GenericModel = Backbone.Model.extend({


		defaults:{
			id : null,
		},

		searchable_fields: [
			{ key: 'name',  type: 'text' }
		],


		getId : function() {
			return this.get('id');
		},
		setId : function(value, silent) {
			this.set({ id: value }, {silent: silent});
		},

		getName : function() {
			return _.titleize(this.get('name').toLowerCase());
		},
		setName : function(value, silent) {
			this.set({ name: value }, {silent: silent});
		},

		getActions : function(){
			return this.get('actions');
		},
		hasAction: function(action){
			var acts = this.getAttribute('actions',[]);
			return acts.indexOf(action) > -1;
		},

		getDateFr: function(field){
			var val = this.getAttribute(field,'');
			if(val !== ''){
				val = moment(val).format('DD/MM/YYYY');
			}
			return val;
		},

		getDatetime: function(field){
			var val = this.getAttribute(field,'1970-01-01 00:00:00');
			val = AppHelpers.convertDateToTz(val);
			return val.format('YYYY-MM-DD HH:mm:ss');
		},

		getCurrencyString: function(field, decimalSeparator, thousandSeparator, currency){
			var decimalSep = decimalSeparator || ',';
			var thousandSep = thousandSeparator || ' ';
			var cur = currency || '&euro;';

			var value = parseFloat(this.getAttribute(field,0.00));
			var ret = _.numberFormat(value, 2, decimalSep, thousandSep);
			return ret + '' + cur;
		},

		//method to retrieve attribute with standard return form
		getAttribute: function(key,default_value){
			var val = this.get(key);
			if(_.isUndefined(default_value)){
				default_value = false;
			}
			if(!_.isUndefined(val) && val !== '' && val !== false && val !== null){
				return val;
			}
			else{
				return default_value;
			}
		},

		/**
		 * @return array : empty array if value of 'fieldName' not refer to a *2many save-value, else return value of 'fieldName'
			a correct *2many save-value is an Array of Array (correctVal = [ [0,0,{...}] ], [4,ID],... ] )
		 */
		check2ManyAction: function(fieldName){
			var ret = [];
			var field = this.getAttribute(fieldName,[]);
			_.each(field, function(value){
				//if value is number, means that it refers to an ID (from a fetch), we want only to keep action values.
				//Not the best way to do that, must be reracto soon
				if(!_.isNumber(value)){
					ret.push(value);
				}
			});

			return ret;
		},

		checkMany2OneAction: function(fieldName){
			var val = this.getAttribute(fieldName,false);
			if(_.isArray(val)){
				val = val[0];
			}
			return val;
		},
		
		checkMany2ManyAction: function(fieldName){
			var ret = [];
			var val = this.getAttribute(fieldName, []);
			if(_.isArray(val)){
				ret = [[6,0,val]];
			}
			return ret;
		},

		/**
		 * to move to GenericCollection
		 */
		getSaveVals: function(attributes){
			var fields = {};
			var self = this;
			if(!_.isUndefined(attributes)){
				_.each(attributes, function(field){
					fields[field] = self.collection.fieldsMetadata[field];
				});
			}
			else{
				fields = this.collection.fieldsMetadata;
			}
			var ret = {};
			if(!_.isUndefined(this.collection)){
				_.map(fields, function(fieldDefinition, fieldName){
					if(!_.contains(self.readonlyFields, fieldName)){
						switch(fieldDefinition.type){
						case 'many2one':
							ret[fieldName] = self.checkMany2OneAction(fieldName);
							break;
						case 'one2many':
							ret[fieldName] = self.check2ManyAction(fieldName);
							break;
						case 'many2many':
							ret[fieldName] = self.checkMany2ManyAction(fieldName);
							break;
						default:
							ret[fieldName] = self.getAttribute(fieldName, false);
						}
					}
				});
			}
			else{
				console.warning('Swif error: Could not save model because not any collection is linked with, and so can not retrieve metadata fields.');
			}
			console.log(ret);
			return ret;
		},

		saveToBackend: function(){
			var self = this;
			var vals = this.getSaveVals();
			var ret = this.save(vals,{patch:!this.isNew(), wait:true}).then(function(data){
				if(self.isNew()){
					self.set({id:data});
				}
				return self.fetch();
			});
			return ret;

		},
		fetchMetadata: function(){
			var self = this;
			return $.ajax({
				url      : this.urlRoot,
				method   : 'HEAD',
				dataType : 'text',
				success  : function(data,status,request){

					self.fieldsMetadata = {};
					//for backward compatibility only
					if(_.isUndefined(self.collection)){
						self.collection = {};
					}
					//Set advanced filters for collection with metadatas
					try {
						self.fieldsMetadata = JSON.parse(request.getResponseHeader('Model-Fields'));
						//for backward compatibility only
						self.collection.fieldsMetadata = self.fieldsMetadata;
						_.each(self.advanced_searchable_fields, function(fieldToKeep){
							var field = _.find(self.fieldsMetadata,function(value,key){
								return fieldToKeep.key == key;
							});
							_.extend(fieldToKeep, field);
						});
					}
					catch(e){
						console.log('Meta data are not valid');
					}

					//Get model Id to obtain his filters
					self.modelId = request.getResponseHeader('Model-Id');

				}

			});
		},
	});



	return GenericModel;

});