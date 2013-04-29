/******************************************
* Services List View
*/
app.Views.ServicesListView = Backbone.View.extend({
	
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
		'click button.btnDeleteService' : 'deleteService',
			
		'click a.accordion-object'    	: 'tableAccordion',
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


		var services = app.collections.claimersServices;
		var nbServices = _.size(services);

		var len = services.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				services: services.toJSON(),
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
    
    /** Fonction collapse table row
 	    */
	 tableAccordion: function(e){
	
	     e.preventDefault();
	     
	     // Retrieve the intervention ID //
	     var id = _($(e.target).attr('href')).strRightBack('_');
	
	
	     var isExpend = $('#collapse_'+id).hasClass('expend');
	
	     // Reset the default visibility //
	     $('tr.expend').css({ display: 'none' }).removeClass('expend');
	     $('tr.row-object').css({ opacity: '0.5'});
	     $('tr.row-object > td').css({ backgroundColor: '#FFF'});
	     
	     // If the table row isn't already expend //       
	     if(!isExpend){
	         // Set the new visibility to the selected intervention //
	         $('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
	         $(e.target).parents('tr.row-object').css({ opacity: '1'});
	         $(e.target).parents('tr.row-object').children('td').css({ backgroundColor: '#F5F5F5'});
	     }
	     else{
	         $('tr.row-object').css({ opacity: '1'});
	         $('tr.row-object > td').css({ backgroundColor: '#FFF'});
	         $('tr.row-object:nth-child(4n+1) > td').css({ backgroundColor: '#F9F9F9'});
	     }
	        
	 },



    /** Display information in the Modal view
    */
    setInfoModal: function(e){
        
        // Retrieve the ID of the service //
        var link = $(e.target);

        var id = _(link.parents('tr').attr('id')).strRightBack('_');
        
        this.selectedService = _.filter(app.collections.claimersServices.models, function(item){ return item.attributes.id == id });
        var selectedServiceJson = this.selectedService[0].toJSON();

        $('#infoModalDeleteService p').html(selectedServiceJson.name);
        $('#infoModalDeleteService small').html(selectedServiceJson.code);
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
		var self = this;
		this.selectedService[0].destroy({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.claimersServices.remove(self.selectedService[0]);
					$('#modalDeleteService').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.serviceDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer le service");
			}

		});
    },



    preventDefault: function(event){
    	event.preventDefault();
    },

});