/******************************************
* Requests List View
*/
openstm.Views.RequestsListView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'requestsList',

	numberListByPage: 25,


    // The DOM events //
    events: {
		'click li.active'		: 'preventDefault',
		'click li.disabled'		: 'preventDefault',
		'click a' 				: 'removeTooltip'
    },

	

	/** View Initialization
	*/
    initialize: function () {
		this.render();
    },



	/** Display the view
	*/
    render: function () {
		var self = this;

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
				pageCount: pageCount
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

    //PYF 30/10/12 :Remove popover on href click
    removeTooltip: function(event){    	
    	if(event.which == 1)
	    {       		
	        $(event.target).popover('hide');
	    }
    }


});