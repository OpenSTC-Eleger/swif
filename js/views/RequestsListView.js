/******************************************
* Requests List View
*/
app.Views.RequestsListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'requestsList',

	numberListByPage: 25,
	
	selectedRequest : 0,


    // The DOM events //
    events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',
			
    	'click .buttonValidRequest'		: 'setInfoModal',
    	'click .buttonRefuseRequest'	: 'setInfoModal',
    	'click .buttonConfirmDST'		: 'setInfoModal',

    	'submit #formValidRequest' 		: 'validRequest',
    	'submit #formRefuseRequest' 	: 'refuseRequest',
    	'submit #formConfirmDSTRequest' : 'confirmDSTRequest'
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

		

        // Retrieve the number Interventions due to the Group user //
        if(app.models.user.isDST()){
        	var interventionsFilter = _.filter(requests, function(item){ return item.attributes.state == app.Models.Request.state[2].value; });
        	var nbInterventionsInBadge = _.size(interventionsFilter);	
        }
        else if(app.models.user.isManager()){
        	var interventionsFilter = _.filter(requests, function(item){ return item.attributes.state == app.Models.Request.state[1].value; });
        	var nbInterventionsInBadge = _.size(interventionsFilter);
        }
        else {
			var nbInterventionsInBadge = _.size(app.collections.requests);
        }

        


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
	  
			var template = _.template(templateData, {
				lang: app.lang,
				nbInterventionsInBadge: nbInterventionsInBadge,
				requests: app.collections.requests.toJSON(),
				requestsState: app.Models.Request.state,
				startPos: startPos, endPos: endPos,
				page: self.options.page, 
				pageCount: pageCount,

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



	/** Display request information in the Modal view
	*/
	setInfoModal: function(e){
		
		var btn = $(e.target);

		// Retrieve the ID of the request //
		this.selectedRequest = app.collections.requests.models[btn.parents('tr').attr('id')].toJSON();

		if(btn.hasClass("buttonValidRequest")){
			$('#requestName').val(this.selectedRequest.name);
			$('#infoModalValidRequest').children('small').html(this.selectedRequest.description);
		}
		else if(btn.hasClass("buttonRefuseRequest")){
			$('#infoModalRefuseRequest').children('p').html(this.selectedRequest.name);
			$('#infoModalRefuseRequest').children('small').html(this.selectedRequest.description);
		}
		else if(btn.hasClass("buttonConfirmDST")){
			$('#infoModalConfirmDST').children('p').html(this.selectedRequest.name);
			$('#infoModalConfirmDST').children('small').html(this.selectedRequest.description);
		}
		
	},



	/** Change the request state to ConfirmDST
	*/
	validRequest: function(e){
		e.preventDefault();

		alert('TODO');
	},



	/** Change the request state to ConfirmDST
	*/
	refuseRequest: function(e){
		e.preventDefault();

		alert('TODO');
	},



	/** Change the request state to ConfirmDST
	*/
	confirmDSTRequest: function(e){
		e.preventDefault();

		alert('TODO');
	},



	/** Prevent the default action
	*/
	preventDefault: function(event){
    	event.preventDefault();
    }




});