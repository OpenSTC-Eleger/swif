/******************************************
* Categories List View
*/
app.Views.CategoriesView = Backbone.View.extend({
	
	el : '#rowContainer',
	
	templateHTML: 'categories',
	
	numberListByPage: 25,

	selectedCat : '',


    // The DOM events //
    events: {
		'click li.active'				: 'preventDefault',
		'click li.disabled'				: 'preventDefault',

		'click a.modalDeleteCat'  		: 'setInfoModal',

		'submit #formAddCat' 			: "addCat", 
		'click button.btnDeleteCat' 	: 'deleteCat'
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
        app.router.setPageTitle(app.lang.viewsTitles.categoriesList);


        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.configuration);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


		var categories = app.collections.categories.models;
		console.debug(categories);

		var len = categories.length;
		var startPos = (this.options.page - 1) * this.numberListByPage;
		var endPos = Math.min(startPos + this.numberListByPage, len);
		var pageCount = Math.ceil(len / this.numberListByPage);

		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				cats: app.collections.categories.toJSON(),
				lang: app.lang,
				nbCats: len,
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
        
        // Retrieve the ID of the categorie //
        var link = $(e.target);

        var id = _(link.parents('tr').attr('id')).strRightBack('_');
        
        this.selectedCat = _.filter(app.collections.categories.models, function(item){ return item.attributes.id == id });
        this.selectedCat = this.selectedCat[0].toJSON();

        $('#infoModalDeleteCat p').html(this.selectedCat.name);
        $('#infoModalDeleteCat small').html(this.selectedCat.code);
    },



    /** Add a new categorie
    */
    addCat: function(e){
        e.preventDefault();

        alert('TODO: save the new cat');

    },



    /** Delete the selected categorie
    */
    deleteCat: function(e){
        
  		alert('TODO: delete categorie with id '+ this.selectedCat.id);

    },



    preventDefault: function(event){
    	event.preventDefault();
    },

});