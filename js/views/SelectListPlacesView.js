/******************************************
* Requests List View
*/
openstm.Views.SelectItemPlaceView = Backbone.View.extend({
        
    tagName: "option",
    selected: false,

        
	/** View Initialization
	*/
	initialize: function(){
		_.bindAll(this, 'render');
	},


	/** Display the view
	*/
	render: function(){
		 	$(this.el).attr('value', this.model.get('id')).html(this.model.get('name'));
		if (this.selected)
			$(this.el).attr('selected', 'true');      	
		
		return this;
	},
    

	/** Selected the site
	*/
    setSelected: function() {
    	this.render(true);
    }
        
});



/******************************************
* Requests List View
*/
openstm.Views.SelectListPlacesView = Backbone.View.extend({
	
	locationsViewLst: new Array(),
	selectedId: 0,
			
	
	/** View Initialization
	*/
	initialize: function(){
	    _.bindAll(this, 'addOne', 'addAll');
	    this.collection.bind('reset', this.addAll);
	},


	addOne: function(place){        	
		locationView = new openstm.Views.SelectItemPlaceView({ model: place });
		this.locationsViewLst[place.get("id")] = locationView;
		$(this.el).append(locationView.render(false).el); 
	},


	addAll: function(){
	    this.collection.each(this.addOne);
	    console.log($(this.el));
	},  


	setSelectedPlace: function(id) {
		//this.selectedId = id; 
		this.locationsViewLst[id].setSelected();
	}
});