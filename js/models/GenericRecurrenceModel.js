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
	* RecurrenceModel
	*/
	var RecurrenceModel = GenericModel.extend({


		fields     : ['id', 'recur_periodicity', 'recur_week_monday', 'recur_week_tuesday', 'recur_week_wednesday', 'recur_week_thursday', 'recur_week_friday', 'recur_week_saturday', 'recur_week_sunday', 'recur_month_type', 'recur_month_absolute', 'recur_month_relative_weight', 'recur_month_relative_day', 'recur_type', 'date_start', 'recur_length_type','date_end'],

		urlRecurrenceRoot    : '/recurrence_dates',

		searchable_fields: [
			{ key: '', type : '' }
		],

		

		initialize: function() {

		},
		
		fetchFieldMetadata: function(){
			return $.ajax({
				url      : this.url,
				method   : 'HEAD',
				dataType : 'text',
				data     : {filters: {}},
				success  : function(data,status,request){

					self.fieldsMetadata = {};
					
					//Set advanced filters for collection with metadatas
					try {
						self.fieldsMetadata = JSON.parse(request.getResponseHeader('Model-Fields'));
						//TODO: I keep self.collection for backward compatibility, must be refactored
						self.collection = {};
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
		
		fetchDates: function(){
			var self = this;
			var deferred = $.Deferred;
			return this.saveToBackend().done(function(){
				$.ajax({
					method	: 'GET',
					url		: self.urlRoot + "/" + self.getId()  + self.urlRecurrenceRoot,
					success : function(){
						self.fetch().done(function(){
							self.trigger('recurrence', self);
						})
					},
				});
			});
		},
	
	});

	return RecurrenceModel;

});