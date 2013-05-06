/******************************************
* Teams List View
*/
app.Views.TeamsListView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'teams',

	numberListByPage: 25,

	selectedTeam : '',

	sstorageTeamSelected: 'selectedTeam',


	// The DOM events //
	events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',
		'click ul.sortable li'			: 'preventDefault',

		'click a.modalDeleteTeam'  		: 'modalDeleteTeam',
		'click a.modalSaveTeam'  		: 'modalSaveTeam',

		'submit #formSaveTeam' 			: 'saveTeam',
		'click button.btnDeleteTeam'	: 'deleteTeam',

		'click a.teamName' 				: 'displayTeamInfos'
	},



	/** View Initialization
	*/
	initialize: function () {

	},


	selectTeam: function(){
		alert('ok');

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

		var teams = app.collections.teams.models;
		var nbTeams = _.size(teams);

		console.debug(app.collections.officers);

//		var officersWithoutTeam = _.filter(app.collections.officers.models, function(item){
//			//PYF : TO REMOVE temporaire pour TEST many2many
//			return true;//item.attributes.belongsToTeam == null; 
//		});


		var len = teams.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);


		console.log(app.collections.teams.toJSON());

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				teams: app.collections.teams.toJSON(),
				nbTeams: nbTeams,
				lang: app.lang,
				startPos: startPos, endPos: endPos,
				page: self.options.page,
				pageCount: pageCount
			});

			$(self.el).html(template);


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


			// Fill select Foreman  //
			app.views.selectListOfficersView = new app.Views.DropdownSelectListView({el: $("#teamForeman"), collection: app.collections.officers})
			app.views.selectListOfficersView.clearAll();
			app.views.selectListOfficersView.addEmptyFirst();
			app.views.selectListOfficersView.addAll();


			// Check the Session storage to know If a Team was previously selected //
			if(sessionStorage.getItem(self.sstorageTeamSelected) != null){

				// Get the team id Value //
				var id = sessionStorage.getItem(self.sstorageTeamSelected);
				$('#team_'+id).children('td').children('a').click();
			}

		});

		$(this.el).hide().fadeIn('slow');

		return this;
	},



	getIdInDropDown: function(view) {
		if ( view && view.getSelected() )
			var item = view.getSelected().toJSON();
			if( item )
				return [ item.id, item.name ];
		else 
			return 0
    },



	setModel: function(e) {
		e.preventDefault();
		var link = $(e.target);
		
		var id =  _(link.parents('tr').attr('id')).strRightBack('_');
		this.selectedTeam = _.filter(app.collections.teams.models, function(item){ return item.attributes.id == id });
		
		if( this.selectedTeam.length > 0 ) {
		
			$('table.teamsTable tr.info').removeClass('info');
			link.parents('tr').addClass('info').children('i');

			$('#teamServicesMembers').removeClass('hide');

			this.model = this.selectedTeam[0];
			this.selectedTeamJson = this.model.toJSON();

        }
        else {
        	this.model = null;
			this.selectedTeamJson = null;
		}

		console.debug(this.model);
	},



    /** Modal create/update team
    */
    modalSaveTeam: function(e){
		this.setModel(e);

		$('#teamName').val('');
		app.views.selectListOfficersView.setSelectedItem(0);

		if( this.selectedTeamJson ) {
			$('#teamName').val(this.selectedTeamJson.name);
			app.views.selectListOfficersView.setSelectedItem( this.selectedTeamJson.manager_id[0] );
		}

	},



	/** Display information in the Modal view delete team
	*/
	modalDeleteTeam: function(e){

        // Retrieve the ID of the team //
		this.setModel(e);

		$('#infoModalDeleteTeam p').html(this.selectedTeamJson.name);
		$('#infoModalDeleteTeam small').html(_.capitalize(app.lang.foreman) +": "+ this.selectedTeamJson.manager_id[1]);
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
		app.collections.claimersServices.toJSON()

		
		// Display the remain members //
		_.filter(app.collections.officers.models, function (officer, i){

			// Remove The DST From the list //
			if(!officer.isDST()){

				officer = officer.toJSON();

				if(!_.contains(teamOfficers, officer.id)){
					//Manager must not present in list
					if( selectedTeamJson.manager_id[0]!=officer.id ) 				
						$('#officersList').append('<li id="officer_'+officer.id+'"><a href="#"><i class="icon-user"></i> '+ officer.firstname +' '+ officer.name +'</a></li>');

				}
			}
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



    /** Display the view
    */
	preventDefault: function(event){
		event.preventDefault();
	},

});