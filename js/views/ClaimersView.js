/******************************************
* Claimers List View
*/
app.Views.ClaimersView = Backbone.View.extend({

	el : '#rowContainer',

	templateHTML: 'claimers',

	numberListByPage: 25,

	selectedClaimer : '',


    // The DOM events //
    events: {
    	'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',

		'click a.modalDeleteClaimer'  		: 'setInfoModal',

		'submit #formAddClaimer' 			: "addClaimer", 
		'click button.btnDeleteClaimer'		: 'deleteClaimer'
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
        app.router.setPageTitle(app.lang.viewsTitles.claimersList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var claimers = app.collections.claimers.models;
		var nbClaimers = _.size(claimers);

		console.debug(claimers);


		var len = claimers.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				claimers: app.collections.claimers.toJSON(),
				lang: app.lang,
				nbClaimers: nbClaimers,
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

        this.selectedClaimer = _.filter(app.collections.claimers.models, function(item){ return item.attributes.id == id });
        var selectedClaimerJson = this.selectedClaimer[0].toJSON();

        $('#infoModalDeleteClaimer p').html(selectedClaimerJson.name);
        $('#infoModalDeleteClaimer small').html(selectedClaimerJson.type_id[1]);
    },



    /** Add a new claimer
    */
    addClaimer: function(e){
		e.preventDefault();
		alert('TODO: save the new claimer');
	},



	/** Delete the selected claimer
	*/
	deleteClaimer: function(e){
		var self = this;
		this.selectedClaimer[0].delete({
			success: function(e){
				app.collections.claimers.remove(self.selectedClaimer[0]);
				$('#modalDeleteClaimer').modal('hide');
				app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.claimerDeleteOk);
				self.render();
			},
			error: function(e){
				alert("Impossible de supprimer le demandeur");
			}

		});
	},



    preventDefault: function(event){
    	event.preventDefault();
    },

});