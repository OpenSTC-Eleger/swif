/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'moment',

	'sideBarPlanningSelectResourcesView',
	'calendarPlanningView'

], function(app, moment, SideBarPlanningSelectResourcesView, CalendarPlanningView){

	'use strict';


	/******************************************
	* Planning Manger View
	*/
	var PlanningManagerView = Backbone.View.extend({

		el           : '#rowContainer',

		templateHTML : '/templates/others/PlanningManager.html',



		// The DOM events //
		events: {
			'click #filterStateRequestList li a' 	: 'setFilterState',
		},



		/** View Initialization
		*/
		initialize: function (params) {
			var self = this;
			this.options ={};


			// Check the params //
			switch(params.calendarView){
				case 'month':
					this.options.calendarView = 'month';
				break;

				case 'week':
					this.options.calendarView = 'agendaWeek';
				break;

				case 'day':
					this.options.calendarView = 'agendaDay';
				break;

				default:
					this.options.calendarView = 'agendaWeek';
			}


			if(!_.isUndefined(params.day)){
				this.options.date = moment().date(params.day).month((params.month)-1).year(params.year);
			}
			else{
				this.options.date = moment();
			}


			app.router.render(self);
		},
		


		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.requestsList);


			// Retrieve the template //
			$.get(app.menus.openresa + this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang       : app.lang,
				});

				$(self.el).html(template);


				app.views.sideBarPlanningSelectResourcesView = new SideBarPlanningSelectResourcesView({
					el : '#sideBarselectResource'
				});

				app.views.calendarPlanningView = new CalendarPlanningView({
					el          : '#calendarManager',
					calendarView: self.options.calendarView,
					date        : self.options.date
				});

			});

			$(this.el).hide().fadeIn();

			return this;
		}


	});

return PlanningManagerView;

});