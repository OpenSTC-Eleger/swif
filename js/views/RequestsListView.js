/******************************************
* Requests List View
*/
openstm.Views.RequestsListView = Backbone.View.extend({
	
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
    },

	

	/** View Initialization
	*/
    initialize: function () {			
		this.render();
    },
    
    openValidModal: function() {
	
    	
    	$("#validModal #test").val( 'test' );
    	
    	//openstm.views.selectListServicesView = new openstm.Views.DropdownSelectListView({el: $("#requestPlace"), collection: openstm.collections.places})
    	//openstm.views.selectListPlacesView.addAll();    	
    	

    	$("#validModal").modal();
    	
    	//var model = new Backbone.Model({  title: 'Example Modal', body: 'Hello World' });    	
        //var view = new openstm.Views.ValidRequestModalView({ model: model });
        //view.show();
    },

    validModal: function() {
    	$("#validModal").modal('hide');
    	
    },

    loadButtons : function() {
		var self = this;
			
		//userGroups = openstm.models.user.getGroups();    	
		//
		//$.each(userGroups, function(index, group) { 
		//  	if ( jQuery.inArray( group, [18,19,16] ) == 0) {
		//		self.btnOpenValidModalVisibility = 'visible';
		//		self.btnOpenModifyModalVisibility = 'visible';
		//		self.btnOpenCancelModalVisibility = 'visible';
		//		return true;
		//  	}
		//  	if ( jQuery.inArray( group, [18] ) == 0 ) {
		//		self.btnOpenConfirmModalVisibility = 'visible';						
		//		return true;
		//  	}
		//  	if ( jQuery.inArray( group, [19,16] ) == 0 ) {
		//		self.btnOpenToBeConfirmModalVisibility = 'visible';	
		//		return true;
		//  	}
		//  	
		//});
		self.btnOpenValidModalVisibility = 'visible';
//		self.btnOpenModifyModalVisibility = 'visible';
//		self.btnOpenCancelModalVisibility = 'visible';
//		self.btnOpenConfirmModalVisibility = 'visible';	
//		self.btnOpenToBeConfirmModalVisibility = 'visible';	
    },



	/** Display the view
	*/
    render: function () {
		//openstm.Views.OpenstmView.prototype.render.call(this);
		var self = this;
		
		self.loadButtons();

		// Change the page title //
        openstm.router.setPageTitle(openstm.lang.viewsTitles.requestsList);

        // Change the active menu item //
        openstm.views.headerView.selectMenuItem(openstm.router.mainMenus.manageInterventions);

        // Change the Grid Mode of the view //
        openstm.views.headerView.switchGridMode('fluid');


		var requests = openstm.collections.requests.models;
		var len = requests.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		

        // Retrieve the number of waiting Interventions //
        var interventionsWaiting = _.filter(requests, function(item){ return item.attributes.state == openstm.Models.Request.state[1].value; });
        var nbInterventionsWaiting = _.size(interventionsWaiting);
        


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
	  
			var template = _.template(templateData, {
				lang: openstm.lang,
				nbInterventionsWaiting: nbInterventionsWaiting,
				requests: openstm.collections.requests.toJSON(),
				requestsState: openstm.Models.Request.state,
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