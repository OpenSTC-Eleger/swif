/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'teamModel',
	'teamsCollection',

	'genericListView',
	'paginationView',
	'itemTeamView',
	'teamMembersAndServices',
	'modalTeamView',

], function(app, AppHelpers, TeamModel, TeamsCollection, GenericListView, PaginationView, ItemTeamView, TeamMembersAndServices, ModalTeamView){

	'use strict';


	/******************************************
	* Teams List View
	*/
	var TeamsListView = GenericListView.extend({

		model: TeamModel,

		templateHTML : 'templates/lists/teamsList.html',

		itemsPerPage : 10,


		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalCreateModel'  : 'modalCreateTeam',
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function() {

			// Check if the collections is instantiate //
			if (_.isUndefined(this.collection)) {
				this.collection = new TeamsCollection();
			}

			this.specialDomain = {field: 'deleted_at', operator: '=', value: 'False'};

			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** When the model created //
		*/
		add: function(model){

			var itemTeamView  = new ItemTeamView({ model: model });
			$('#rows-items').prepend(itemTeamView.render().el);
			AppHelpers.highlight($(itemTeamView.el)).done(function(){
				itemTeamView.setSelected();
			});

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.teamCreateOk);

			this.partialRender();

			// Display the team members and services View //
			this.displayTeamMembersAndServices(model);
			this.options.id = model.getId();
			app.router.navigate(app.views.teamsListView.urlBuilder(), {trigger: false, replace: false});
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.teamsList);


			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					nbTeams: self.collection.cpt,
					lang   : app.lang
				});

				$(self.el).html(template);


				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);


				// Create item team view //
				_.each(self.collection.models, function(team){
					var itemTeamView  = new ItemTeamView({model: team});
					$('#rows-items').append(itemTeamView.render().el);
				});


				// If an ID is selected display the "Team members, services view" //
				if(!_.isUndefined(self.options.id)){

					// Check if the model was load in the collection //
					if(!_.isUndefined(self.collection.get(self.options.id))){
						self.displayTeamMembersAndServices(self.collection.get(self.options.id));
					}
					else{
						self.displayTeamMembersAndServices(self.options.id);
					}
				}
				// If there is only One result on the collection display the "Team members, services view" //
				else if(_.size(self.collection) == 1){
					self.displayTeamMembersAndServices(_.first(self.collection.models));
				}


			});

			$(this.el).hide().fadeIn();

			return this;
		},




		/** Modal form to create a new Team
		*/
		modalCreateTeam: function(e){
			e.preventDefault();

			app.views.modalTeamView = new ModalTeamView({
				el  : '#modalSaveTeam'
			});
		},



		/** Display the form to add members and services to the team
		*/
		displayTeamMembersAndServices: function(model){
			$('#teamMembersAndServices').removeClass('hide');

			// Undelegate the events of the view //
			if(!_.isUndefined(app.views.teamMembersAndServices)){ app.views.teamMembersAndServices.undelegateEvents(); }
			app.views.teamMembersAndServices = new TeamMembersAndServices({
				el    : '#teamMembersAndServices',
				model : model
			});
		}

	});

	return TeamsListView;
});