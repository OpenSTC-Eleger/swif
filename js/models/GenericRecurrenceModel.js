/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'genericModel'

], function(app, AppHelpers, GenericModel){

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
		
		
		defaults: function(){
			var ret = {
				recur_type: 'weekly',
				recur_month_type: 'monthday',
				recur_periodicity: 1
			};
			var relativeParser = {
				0: 'first',
				1: 'second',
				2: 'third',
				3: 'fourth',
				4: 'last'
			};
			var dateStart = this.getAttribute('date_start',false);
			if(dateStart){
				var momentDateStart = AppHelpers.convertDateToTz(dateStart);
				var momentStartMonth = momentDateStart.clone().startOf('month');
				console.log(momentStartMonth);
				console.log(momentDateStart);
				
				if(momentDateStart.isValid()){
					//to retrieve weekday in english
					momentDateStart.lang('en');
					var weekdayName = momentDateStart.format('dddd').toLowerCase();
					ret['recur_week_' + weekdayName] = true;
					ret.recur_month_relative_day = weekdayName;
					ret.recur_month_absolute = momentDateStart.date();
					//get the position of momentDateStart's weekday on the first week of the month
					var firstCurrentWeekdayOfMonth = ((momentDateStart.isoWeekday() + 7 - momentStartMonth.isoWeekday()) % 7) + 1;
					var weekdayNbOfMonth = (momentDateStart.date() - firstCurrentWeekdayOfMonth) / 7;
					ret.recur_month_relative_weight = relativeParser[weekdayNbOfMonth];
					
				}
			}
			return ret;
		},

		initialize: function() {
			this.listenTo(this, 'change:date_start', this.updateDefaults);
		},
		
		/**
		 * update default values of recurrence setting according to date_start value
		 * If some fields are not yet set, set them the default values returned by defaults() method
		 */
		updateDefaults: function(model, value){
			if(value){
				var attrs = _.pick(model.toJSON(),model.recurFields);
				attrs = _.defaults(attrs, model.defaults());
				model.set(attrs);
			}
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
			delete data.occurrence_ids;
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