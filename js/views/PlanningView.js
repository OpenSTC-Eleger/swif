/******************************************
* Planning View
*/
app.Views.PlanningView = Backbone.View.extend({


	el : '#rowContainer',

	templateHTML: 'planning',

	filters: 'interventionsListFilter',

	
	
	selectedInter : '',
	selectedTask : '',

	sstoragePlanningSelected: 'selectedPlanning',
	
	// The DOM events //
	events: {

		'click #listAgents li a, #listTeams li a' :          'selectPlanning',
	},


	/** View Initialization
	*/
	initialize : function() {		
		var self = this;
	    console.log("Planning Details view intialization")
	    this.initCollections().done(function(){
	    	app.router.render(self);
	    	//self.render();
	    })
	},


	/** Display the view
	*/
	render : function() {
		var self = this;
		

		// Retrieve the Login template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){


			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.planning);
			// Change the Grid Mode of the view //
			app.views.headerView.switchGridMode('fluid');
			
			// Set variables template //
			var template = _.template(templateData, {
				lang: app.lang,
				officers: app.models.user.getOfficers(),
				teams:  app.models.user.getTeams(),				
			});

			$(self.el).html(template);

			// Check if a Team was selected to select the Team Tab 
			if(!_.isUndefined(self.options.team))
				$('#allTabs a[data-target="#tab-teams"]').tab('show');
			
			$('#calendar').append( new app.Views.EventsListView(self.options).render().el );
			// Display filter on the table //
			if(sessionStorage.getItem(self.filters) != null){
				$('a.filter-button').removeClass('filter-disabled').addClass('filter-active');
				$('li.delete-filter').removeClass('disabled');
				if(sessionStorage.getItem(self.filters) != 'notFilter'){
					$('a.filter-button').addClass('text-'+app.Models.Intervention.status[sessionStorage.getItem(self.filters)].color);
				}
			}
			else{
				$('a.filter-button').removeClass('filter-active ^text').addClass('filter-disabled');
				$('li.delete-filter').addClass('disabled');
			}
			
			app.views.planningInterListView = new app.Views.PlanningInterListView(self.options)
			$('#planningInters').append( app.views.planningInterListView.render().el );
					
			
		});
		$(this.el).hide().fadeIn('slow');
		return this;
	},


	/** Partial Render of the view
		*/
	partialRender: function (interId) {	

	},
	
	
	initCollections: function(){			
	
		var self = this;		
		app.loader('display');
		return $.when(app.models.user.queryManagableOfficers())
		.done(function(){
			$.when(app.models.user.queryManagableTeams())
//				.done(function(){
//				})
				.fail(function(e){
					console.log(e);
				})
				
		})
		.fail(function(e){
			console.log(e);
		})
		

	}

});

