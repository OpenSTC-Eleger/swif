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
		'click a.modalDeleteTeam'  		: 'setInfoModal',

		'submit #formAddTeam' 			: "addTeam", 
		'click button.btnDeleteTeam'	: 'deleteTeam'
    },



	/** View Initialization
	*/
    initialize: function () {

    },


	/** Display the view
	*/
    render: function () {
		var self = this;

		// Change the page title //
        app.router.setPageTitle(app.lang.viewsTitles.placesList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var teams = app.collections.teams.models;
		var nbTeams = _.size(teams);

		console.debug(teams);


		var len = teams.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				teams: app.collections.teams.toJSON(),
				nbTeams: nbTeams,
				lang: app.lang,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});

			$(self.el).html(template);
		});

		$(this.el).hide().fadeIn('slow');

		return this;
    },



    /** Display information in the Modal view
    */
    setInfoModal: function(e){

        // Retrieve the ID of the intervention //
        var link = $(e.target);

        var id = _(link.parents('tr').attr('id')).strRightBack('_');

        this.selectedTeam = _.filter(app.collections.teams.models, function(item){ return item.attributes.id == id });
        var selectedTeamJson = this.selectedTeam[0].toJSON();

        $('#infoModalDeleteTeam p').html(selectedTeamJson.name);
        $('#infoModalDeleteTeam small').html(selectedTeamJson.service[1]);
    },



    /** Add a new place
    */
    addTeam: function(e){
		e.preventDefault();
		alert('TODO: save the new team');
	},



	/** Delete the selected team
	*/
	deleteTeam: function(e){
		var self = this;
		this.selectedPlace[0].delete({
			success: function(e){
				app.collections.teams.remove(self.selectedTeam[0]);
				$('#modalDeleteTeam').modal('hide');
				app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.placeDeleteOk);
				self.render();
			},
			error: function(e){
				alert("Impossible de supprimer l'équipe");
			}

		});
	}

});