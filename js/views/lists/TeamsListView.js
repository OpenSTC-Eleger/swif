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

		templateHTML : 'lists/teamsList',

		itemsPerPage : 10,


		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalCreateTeam'  : 'modalCreateTeam',
			}, 
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function (params) {
			this.options = params;

			var self = this;

			this.initCollection().done(function(){

				// Unbind & bind the collection //
				self.collection.off();
				self.listenTo(self.collection, 'add', self.add);

				app.router.render(self);
			})
		},



		/** When the model ara created //
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
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
				var template = _.template(templateData, {
					nbTeams: self.collection.cpt,
					lang   : app.lang
				});

				$(self.el).html(template);


				// Call the render Generic View //
				GenericListView.prototype.render(self.options);


				// Create item team view //
				_.each(self.collection.models, function(team, i){
					var itemTeamView  = new ItemTeamView({model: team});
					$('#rows-items').append(itemTeamView.render().el);
				});


				// Pagination view //
				app.views.paginationView = new PaginationView({ 
					page         : self.options.page.page,
					collection   : self.collection,
					itemsPerPage : self.itemsPerPage
				})


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



		/** Partial Render of the view
		*/
		partialRender: function (type) {
			var self = this;

			this.collection.count(this.fetchParams).done(function(){
				$('#bagdeNbTeams').html(self.collection.cpt);
				app.views.paginationView.render();
			});
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
		},



		/** Collection Initialisation
		*/
		initCollection: function(){

			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new TeamsCollection(); }


			// Check the parameters //
			if(_.isUndefined(this.options.sort)){
				this.options.sort = this.collection.default_sort;
			}
			else{
				this.options.sort = AppHelpers.calculPageSort(this.options.sort);	
			}

			this.options.page = AppHelpers.calculPageOffset(this.options.page, this.itemsPerPage);



			// Create Fetch params //
			this.fetchParams = {
				silent : true,
				data   : {
					limit  : (!_.isUndefined(this.itemsPerPage) ? this.itemsPerPage : app.config.itemsPerPage),
					offset : this.options.page.offset,
					sort   : this.options.sort.by+' '+this.options.sort.order
				}
			};
			if(!_.isUndefined(this.options.search)){
				this.fetchParams.data.filters = AppHelpers.calculSearch({search: this.options.search }, TeamModel.prototype.searchable_fields, true);
			}
			//No displays teams deleted
			if(_.isUndefined(this.fetchParams.data.filters))
				this.fetchParams.data.filters = new Object();
			this.fetchParams.data.filters[_.size(this.fetchParams.data.filters)] = {field:'deleted_at',operator:'=',value:'False'}

			return $.when(this.collection.fetch(this.fetchParams))
				.fail(function(e){
					console.log(e);
				})
		}
	});

return TeamsListView;

});