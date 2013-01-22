/******************************************
* Teams List View
*/
app.Views.TeamsView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'teams',

	numberListByPage: 25,

	selectedTeam : '',


	// The DOM events //
	events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',
		'click ul.sortable li'			: 'preventDefault',

		'click a.modalDeleteTeam'  		: 'modalDeleteTeam',
		'click a.modalSaveTeam'  		: 'modalSaveTeam',

		'click #formAddTeam' 			: 'saveTeam',
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

		var officersWithoutTeam = _.filter(app.collections.officers.models, function(item){
			return item.attributes.belongsToTeam == null; 
		});

		console.debug(officersWithoutTeam);

		var len = teams.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				teams: app.collections.teams.toJSON(),
				nbTeams: nbTeams,
				officersWithoutTeam: officersWithoutTeam,
				services: app.collections.claimersServices.toJSON(),
				lang: app.lang,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
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
				stop: function(event, ui){
					self.saveTeamsServices();
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
				stop: function(event, ui){
					self.saveTeamsServices();
				}
			});


			// Fill select Foreman  //
			app.views.selectListOfficersView = new app.Views.DropdownSelectListView({el: $("#teamForeman"), collection: app.collections.officers})
			app.views.selectListOfficersView.clearAll();
			app.views.selectListOfficersView.addEmptyFirst();
			app.views.selectListOfficersView.addAll();

		});

		$(this.el).hide().fadeIn('slow');

		return this;
	},



	saveTeamsServices: function(){
		console.log($("#teamMembers").sortable('toArray'));
		console.log($("#teamServices").sortable('toArray'));
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

		$('table.teamsTable tr.info').removeClass('info');
		link.parents('tr').addClass('info').children('i');

		this.selected = _.filter(app.collections.teams.models, function(item){ return item.attributes.id == id });

        if( this.selected.length > 0 ) {
			this.model = this.selected[0];
			this.selectedJson = this.model.toJSON();
        }
        else {
			app.models.team.clear();
			this.model = app.models.team;
			this.selectedJson = null;
        }

		console.debug(this.model);
	},



    /** Modal create/update team
    */
    modalSaveTeam: function(e){
		this.setModel(e);

		$('#teamName').val('');
		app.views.selectListOfficersView.setSelectedItem(0);

		if( this.selectedJson ) {
			$('#teamName').val(this.selectedJson.name);
			app.views.selectListOfficersView.setSelectedItem( this.selectedJson.manager_id[0] );
		}

	},



	/** Display information in the Modal view delete team
	*/
	modalDeleteTeam: function(e){
        
        // Retrieve the ID of the team //
    	this.setModel(e);

        $('#infoModalDeleteTeam p').html(this.selectedJson.name);
        $('#infoModalDeleteTeam small').html(_.capitalize(app.lang.foreman) +": "+ this.selectedJson.service_ids[1]);
    },



	/** Save Claimer Type
	*/
	saveTeam: function(e) {		     
    	e.preventDefault();

		var self = this;

		var manager_id = this.getIdInDropDown(app.views.selectListOfficersView);
	     
		var params = {
			name: this.$('#teamName').val(),
		    manager_id: manager_id
		};
	     
	    this.model.update(params);
	    params.manager_id =  manager_id[0];

	    this.model.save(params,{
			success: function(data){
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					if( !self.model.id  && data.result && data.result.result>0 ) {
						self.model.id = data.result.result;
						self.model.attributes.id = data.result.result;					
					}

					app.collections.teams.add(self.model);
					console.debug("self.model");
					console.debug(self.model);

					$('#modalSaveTeam').modal('hide');
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

		// Clear the list of the user //
		$('#teamMembers li').remove();
		$('#teamServices li').remove();

		_.each(selectedTeamJson.user_ids, function (member, i){
			$('#teamMembers').append('<li><a href="#"><i class="icon-user"></i> '+ member.firstname +' '+ member.name +'</a></li>');
		});


		console.log('""""""""""""""""""""""""""""""""""""selectedTeamJson""""""""""""""""""""""""""""""""""""');
		console.log(selectedTeamJson);

		_.each(selectedTeamJson.service_ids, function (service, i){
			$('#teamServices').append('<li><a href="#"><i class="icon-sitemap"></i> '+ service.name +' </a></li>');
		});

		
	},


	preventDefault: function(event){
		event.preventDefault();
	},

});