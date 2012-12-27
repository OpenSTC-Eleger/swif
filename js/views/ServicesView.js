/******************************************
* Services List View
*/
app.Views.ServicesView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'services',
	
	numberListByPage: 25,

	selectedService : '',


    // The DOM events //
    events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',

		'click a.modalDeleteService'  	: 'setInfoModal',

		'submit #formAddService' 		: "addService", 
		'click button.btnDeleteService' : 'deleteService'
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
        app.router.setPageTitle(app.lang.viewsTitles.servicesList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var services = app.collections.claimersServices.models;
		var nbServices = _.size(services);

		console.debug(services);


		var len = services.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				services: app.collections.claimersServices.toJSON(),
				lang: app.lang,
				nbServices: nbServices,
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
        
        this.selectedService = _.filter(app.collections.claimersServices.models, function(item){ return item.attributes.id == id });
        this.selectedService = this.selectedService[0].toJSON();

        $('#infoModalDeleteService p').html(this.selectedService.name);
        $('#infoModalDeleteService small').html(this.selectedService.code);
    },



    /** Add a new service
    */
    addService: function(e){
        e.preventDefault();

        alert('TODO: save the new service');

    },



    /** Delete the selected service
    */
    deleteService: function(e){
        
  		alert('TODO: delete service with id '+ this.selectedService.id);

    },



    preventDefault: function(event){
    	event.preventDefault();
    },

});