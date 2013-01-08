/******************************************
* Officers List View
*/
app.Views.OfficersView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'officers',
	
	numberListByPage: 25,

	selectedOfficer : '',


    // The DOM events //
    events: {
		'click a.modalDeleteOfficer'  	: 'setInfoModal',

		'submit #formAddOfficer' 		: "addOfficer", 
		'click button.btnDeleteOfficer' : 'deleteOfficer'
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
        app.router.setPageTitle(app.lang.viewsTitles.officersList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var officers = app.collections.officers.models;
		var len = officers.length;

		console.debug(officers);

		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				officers: app.collections.officers.toJSON(),
				nbOfficers: len,
				lang: app.lang,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
			});

			$(self.el).html(template);

			// Tooltip //
			$('*[rel="tooltip"]').tooltip({placement: "right"});
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
        
        this.selectedOfficer = _.filter(app.collections.officers.models, function(item){ return item.attributes.id == id });
        this.selectedOfficer = this.selectedOfficer[0].toJSON();

        $('#infoModalDeleteOfficer p').html(this.selectedOfficer.name+" "+this.selectedOfficer.firstname);
        $('#infoModalDeleteOfficer small').html(this.selectedOfficer.user_email);
    },



    /** Add a new officer
    */
    addOfficer: function(e){
        e.preventDefault();

        alert('TODO: save the new officer');

    },



    /** Delete the selected officer
    */
    deleteOfficer: function(e){
  		alert('TODO: delete officer with id '+ this.selectedOfficer.id);
    },



    preventDefault: function(event){
    	event.preventDefault();
    },

});