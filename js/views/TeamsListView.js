/******************************************
* Teams List View
*/
app.Views.TeamsListView = app.Views.GenericListView.extend({

	templateHTML : 'teamsList',

	itemsPerPage : 10,


	// The DOM events //
	events: function(){
		return _.defaults({
			'click a.modalCreateTeam'  : 'modalCreateTeam',
		}, 
			app.Views.GenericListView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize: function () {

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

		var itemTeamView  = new app.Views.ItemTeamView({ model: model });
		$('#rows-items').prepend(itemTeamView.render().el);
		itemTeamView.highlight();

		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.teamCreateOk);
		
		this.partialRender();
	},



	/** Display the view
	*/
	render: function () {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.teamsList);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');

	
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				nbTeams: self.collection.cpt,
				lang   : app.lang
			});

			$(self.el).html(template);


			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);


			// Create item place view //
			_.each(self.collection.models, function(team, i){
				var itemTeamView  = new app.Views.ItemTeamView({model: team});
				$('#rows-items').append(itemTeamView.render().el);
			});


			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page         : self.options.page.page,
				collection   : self.collection,
				itemsPerPage : self.itemsPerPage
			})
			app.views.paginationView.render();


			$('#teamMembers, #officersList').sortable({
				connectWith: 'ul.sortableOfficersList',
				dropOnEmpty: true,
				forcePlaceholderSize: false,
				forceHelperSize: true,
				placeholder: 'sortablePlaceHold',
				containment: '.officersDroppableArea',
				cursor: 'move',
				opacity: '.8',
				revert: 300,
				receive: function(event, ui){
					self.saveServicesOfficersTeam();
				}
			});


			$('#teamServices, #servicesList').sortable({
				connectWith: 'ul.sortableServicesList',
				dropOnEmpty: true,
				forcePlaceholderSize: true,
				forceHelperSize: true,
				placeholder: 'sortablePlaceHold',
				containment: '.servicesDroppableArea',
				cursor: 'move',
				opacity: '.8',
				revert: 300,
				receive: function(event, ui){
					self.saveServicesOfficersTeam();
				}
			});


		});

		$(this.el).hide().fadeIn();

		return this;
	},



	/** Partial Render of the view
	*/
	partialRender: function (type) {
		var self = this; 

		this.collection.count().done(function(){
			$('#bagdeNbTeams').html(self.collection.cpt);
			app.views.paginationView.render();
		});
	},



	/** Modal form to create a new Team
	*/
	modalCreateTeam: function(e){
		e.preventDefault();
		
		app.views.modalTeamView = new app.Views.ModalTeamView({
			el  : '#modalSaveTeam'
		});
	},



	/** Save Team
	*/
	saveTeam: function(e) {
    	e.preventDefault();

		var manager_id = this.getIdInDropDown(app.views.selectListOfficersView);
		
		this.modelId = this.selectedTeamJson==null?0: this.selectedTeamJson.id;
		var user_ids = null;
		if(  manager_id[0] ) {
			if( this.selectedTeamJson ) {
				//update agents belongs to team whith manager selected
				user_ids = []
				var self = this;				
				user_ids = _.map(this.selectedTeamJson.user_ids, function(user){ return user.id; });				
				user_ids = _.filter( user_ids, function(userId) {
					return self.selectedTeamJson.manager_id[0] != userId && userId!=manager_id[0]; 
				})
				
				//user_ids.push( manager_id[0] )				
				user_ids = [[6,0,user_ids]];	
			}
			else {
				//Create team. Agents belongs to team is only the manager
				//user_ids = [[6,0,[manager_id[0]]]];
			}
		}
	     
		this.params = {
			name: this.$('#teamName').val(),
			manager_id: manager_id[0],
			user_ids: user_ids,			                       
		};

		var self = this;

		app.Models.Team.prototype.save(
			this.params,
			this.modelId, {
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					$('#modalSaveTeam').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.teamSaveOk);
					route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);
				}				
			},
			error: function(e){
				alert('Impossible de créer ou mettre à jour l\'équipe');
			}
		});
	},



	/** Save Officer and Services Team
	*/
	saveServicesOfficersTeam: function() {

		this.services = _.map($("#teamServices").sortable('toArray'), function(service){ return _(_(service).strRightBack('_')).toNumber(); });
		this.members = _.map($("#teamMembers").sortable('toArray'), function(member){ return _(_(member).strRightBack('_')).toNumber(); });
		
		this.freeMembers = _.map($("#officersList").sortable('toArray'), function(member){ return _(_(member).strRightBack('_')).toNumber(); });
		
		


		this.params = {
			name: this.selectedTeamJson.name,
			manager_id: this.selectedTeamJson.manager_id[0],
			service_ids: [[6, 0, this.services]],
			user_ids: [[6, 0, this.members]]
		};

		this.modelId = this.selectedTeamJson==null?0: this.selectedTeamJson.id;

		var self = this;

		app.Models.Team.prototype.save(
			this.params,
			this.modelId, {
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					if( self.modelId==0 ){
						self.model = new app.Models.Team({id: data.result.result});
					}

					self.params.service_ids = self.services;
					self.params.user_ids = self.members;
					self.params.free_user_ids = self.freeMembers;
					self.params.manager_id = [self.selectedTeamJson.manager_id[0], self.selectedTeamJson.manager_id[1]];

					self.model.update(self.params);

					app.collections.teams.add(self.model);

					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.teamSaveOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de créer ou mettre à jour l'équipe");
			}
		});
	},



	/** Delete the selected team
	*/
	deleteTeam: function(e){
		e.preventDefault();
    	
		var self = this;
		this.model.delete({
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.teams.remove(self.model);

					$('#modalDeleteTeam').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.teamDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer l'équipe");
			}

		});
	},



	/** Display team members
	*/
	displayTeamInfos: function(e){
		e.preventDefault();

		this.setModel(e);

		// Retrieve the ID of the intervention //
		var link = $(e.target);
		var id = _(link.parents('tr').attr('id')).strRightBack('_');

		this.selectedTeam = _.filter(app.collections.teams.models, function(item){ return item.attributes.id == id });
		var selectedTeamJson = this.selectedTeam[0].toJSON();

		// Set the ID of the team in the session storage //
		sessionStorage.setItem(this.sstorageTeamSelected, id);


		// Clear the list of the user //
		$('#teamMembers li, #teamServices li, #servicesList li, #officersList li').remove();

		var teamOfficers = new Array();
		// Display the members of the team //
		_.each(selectedTeamJson.user_ids, function (officer, i){
			$('#teamMembers').append('<li id="officer_'+officer.id+'"><a href="#"><i class="icon-user"></i> '+ officer.firstname +' '+ officer.name +'</a></li>');
			teamOfficers[i] = officer.id;
		});


		var teamServices = new Array();
		// Display the services of the team //
		_.each(selectedTeamJson.service_ids, function (service, i){
			$('#teamServices').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
			teamServices[i] = service.id;
		});


		//search no technical services
		var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
			return service.attributes.technical != true 
		});

		//remove no technical services
		app.collections.claimersServices.remove(noTechnicalServices);
		app.collections.claimersServices.toJSON();

		
		
		_.each(selectedTeamJson.free_user_ids,function(officer){
			$('#officersList').append('<li id="officer_'+officer.id+'"><a href="#"><i class="icon-user"></i> '+ officer.firstname +' '+ officer.name +'</a></li>');
		});

		// Display the remain services //
		_.filter(app.collections.claimersServices.toJSON(), function (service, i){ 
			if(!_.contains(teamServices, service.id)){
				$('#servicesList').append('<li id="service_'+service.id+'"><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
			}
		});

		var nbRemainMembers = $('#officersList li').length;
		$('#badgeNbMembers').html(nbRemainMembers);

		var nbRemainServices = $('#servicesList li').length;
		$('#badgeNbServices').html(nbRemainServices);

		$('#teamTitle').html('<i class="icon-group"></i> '+selectedTeamJson.name);

	},



	initCollection: function(){
		var self = this;

		// Check if the collections is instantiate //
		if(_.isUndefined(this.collection)){ this.collection = new app.Collections.Teams(); }


		// Check the parameters //
		if(_.isUndefined(this.options.sort)){
			this.options.sort = this.collection.default_sort;
		}
		else{
			this.options.sort = app.calculPageSort(this.options.sort);	
		}
		this.options.page = app.calculPageOffset(this.options.page, this.itemsPerPage);


		// Create Fetch params //
		var fetchParams = {
			silent : true,
			data   : {
				limit  : (!_.isUndefined(this.itemsPerPage) ? this.itemsPerPage : app.config.itemsPerPage),
				offset : this.options.page.offset,
				sort   : this.options.sort.by+' '+this.options.sort.order
			}
		};
		if(!_.isUndefined(this.options.search)){
			fetchParams.data.filters = app.calculSearch({search: this.options.search }, app.Models.Place.prototype.searchable_fields);
		}


		app.loader('display');
		return $.when(self.collection.fetch(fetchParams))
			.fail(function(e){
				console.log(e);
			})
			.always(function(){
				app.loader('hide');
			});

	}
});