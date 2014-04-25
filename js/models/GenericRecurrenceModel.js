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


		recurFields     : ['id', 'recur_periodicity', 'recur_week_monday', 'recur_week_tuesday', 'recur_week_wednesday', 'recur_week_thursday', 'recur_week_friday', 'recur_week_saturday', 'recur_week_sunday', 'recur_month_type', 'recur_month_absolute', 'recur_month_relative_weight', 'recur_month_relative_day', 'recur_type', 'date_start','date_end'],
		
		//When inheriting, override these two values to customize the resource to be fetched for recurrence
		urlRecurrenceResource : '/api/openstc/task_recurrences',
		urlRecurrenceFetch    : '/recurrence_dates',
		
		searchable_fields: [
			{ key: '', type : '' }
		],

		

		initialize: function() {

		},
		
		addOccurrence: function(model){
			if(model.isNew()){
				var vals = this.getAttribute('occurrence_ids',[]);
				vals.push([0,0,model.getSaveVals()]);
				this.set({occurrence_ids:vals});
			}
		},
		
		removeOccurrence: function(model){
			if(!model.isNew()){
				var vals = this.getAttribute('occurrence_ids',[]);
				vals.push([2,model.getId()]);
				this.set({occurrence_ids:vals});
			}
		},
		
		removeAllOccurrences: function(){
			var vals = [];
			_.each(this.getAttribute('occurrence_ids',[]), function(occurrence_id){
				//check if occurrence_id is an ID or is already a deletion action (not a good way to do, refacto this soon)
				if(_.isNumber(occurrence_id)){
					vals.push([2,occurrence_id]);
				}
			});
			if(vals.length > 0){
				this.set({occurrence_ids:vals});
			}
		},
		
		fetchDates: function(){
			var self = this;
			var data = this.getSaveVals();
			data.id = null;
			var recurModel = new GenericModel(data);
			recurModel.urlRoot = this.urlRecurrenceResource;
			recurModel.fetchMetadata().then(function(){
				recurModel.save().done(function(data){
					recurModel.set({id:data});
					$.ajax({
						method	: 'GET',
						url		: self.urlRecurrenceResource + "/" + recurModel.getId()  + self.urlRecurrenceFetch,
						success : function(data){
								self.removeAllOccurrences();
								self.trigger('recurrence', data);
							}
					});
				});
			});
		}
	
	});

	return RecurrenceModel;

});