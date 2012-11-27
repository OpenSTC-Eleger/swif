/******************************************
* Requests List View
*/
app.Views.RequestsListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'requestsList',

	numberListByPage: 25,
	
	btnOpenValidModalVisibility: "hidden",
	btnOpenModifyModalVisibility: "hidden",
	btnOpenCancelModalVisibility: "hidden",
	btnOpenToBeConfirmModalVisibility: "hidden",
	btnOpenConfirmModalVisibility: "hidden",


    // The DOM events //
    events: {
		'click li.active'		: 'preventDefault',
		'click li.disabled'		: 'preventDefault',
			
    	'click .btnOpenValidModal'		: 'openValidModal',
		'click #btnValidModal'			: 'validModal',
		
//		'click .btnOpenCancelModal'		: 'openCancelModal',
//		'click #btnCancelModal'			: 'cancelModal',
    },

	

	/** View Initialization
	*/
    initialize: function () {			
		this.render();
    },
    
    openValidModal: function() {
	
    	
    	$("#validModal #test").val( 'test' );
    	
    	//if( app.views.selectListServicesView  == null ) {
	    	app.views.selectListServicesView = new app.Views.DropdownSelectListView(
	    		{el: $("#requestService"), collection: app.collections.claimersServices})
	    	app.views.selectListServicesView.clearAll();
	    	app.views.selectListServicesView.addEmptyFirst();
	    	app.views.selectListServicesView.addAll(); 
	    //}
    	
	    //if( app.views.selectListAssignementView  == null ) {
	    	app.views.selectListAssignementView = new app.Views.DropdownSelectListView(
	    		{el: $("#requestAssignement"), collection: app.collections.assignements})
	    	app.views.selectListAssignementView.clearAll(); 
	    	app.views.selectListAssignementView.addEmptyFirst();
	    	app.views.selectListAssignementView.addAll(); 
	    //}
    	

    	$("#validModal").modal();
    	
    	//var model = new Backbone.Model({  title: 'Example Modal', body: 'Hello World' });    	
        //var view = new app.Views.ValidRequestModalView({ model: model });
        //view.show();
    },

    validModal: function() {
    	$("#validModal").modal('hide');
    	
    },



	/** Display the view
	*/
    render: function () {
		//app.Views.appView.prototype.render.call(this);
		var self = this;
		
		self.loadButtons();

		// Change the page title //
        app.router.setPageTitle(app.lang.viewsTitles.requestsList);

        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var requests = app.collections.requests.models;
		var len = requests.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		

        // Retrieve the number of waiting Interventions //
        var interventionsWaiting = _.filter(requests, function(item){ return item.attributes.state == app.Models.Request.state[1].value; });
        var nbInterventionsWaiting = _.size(interventionsWaiting);
        


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
	  
			var template = _.template(templateData, {
				lang: app.lang,
				nbInterventionsWaiting: nbInterventionsWaiting,
				requests: app.collections.requests.toJSON(),
				requestsState: app.Models.Request.state,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,
				
			
				btnOpenValidModalVisibility: self.btnOpenValidModalVisibility,				
				btnOpenModifyModalVisibility: self.btnOpenModifyModalVisibility,
				btnOpenCancelModalVisibility: self.btnOpenCancelModalVisibility,
				btnOpenToBeConfirmModalVisibility: self.btnOpenToBeConfirmModalVisibility,
				btnOpenConfirmModalVisibility: self.btnOpenConfirmModalVisibility,
			});

			console.debug(requests);
		
			$(self.el).html(template);

			// Display the Tooltip or Popover //
			$('*[rel="popover"]').popover({trigger: "hover"});
			$('*[rel="tooltip"]').tooltip({placement: "right"});
		});

	
		$(this.el).hide().fadeIn('slow');
        return this;
    },




    preventDefault: function(event){
    	event.preventDefault();
    },




});