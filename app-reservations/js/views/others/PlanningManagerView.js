define([
	'app',

	'sideBarPlanningSelectResourcesView',
	'calendarPlanningView'

], function(app, SideBarPlanningSelectResourcesView, CalendarPlanningView){

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

			this.options = params;

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
					lang             : app.lang,

				});

				$(self.el).html(template);


				app.views.SideBarPlanningSelectResourcesView = new SideBarPlanningSelectResourcesView({
					el : '#sideBarselectResource'
				});

				app.views.CalendarPlanningView = new CalendarPlanningView({
					el : '#calendarManager'
				});

			});

			$(this.el).hide().fadeIn();

			return this;
		}


	});

return PlanningManagerView;

});