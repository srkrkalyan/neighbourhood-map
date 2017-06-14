
      		var map;
      		var markers = [];
      		var info_windows = [];
      		var my_neighbourhood = {lat: 39.5364820,lng: -104.8970680};
      		
        // These are the initial options

	      	function initMap()
	      	{
	      		var style_blue_essence = 
				[{"featureType":"landscape.natural",
				"elementType":"geometry.fill","stylers":[{"visibility":"on"},
				{"color":"#e0efef"}]},{"featureType":"poi",
				"elementType":"geometry.fill","stylers":[{"visibility":"on"},
				{"hue":"#1900ff"},{"color":"#c0e8e8"}]},
				{"featureType":"road","elementType":"geometry",
				"stylers":[{"lightness":100},{"visibility":"simplified"}]},
				{"featureType":"road","elementType":"labels",
				"stylers":[{"visibility":"off"}]},
				{"featureType":"transit.line","elementType":"geometry",
				"stylers":[{"visibility":"on"},{"lightness":700}]},
				{"featureType":"water","elementType":"all",
				"stylers":[{"color":"#7dcdcd"}]}];

				//creating a map instance centered at my_neighbourhood coordinates
		        map = new google.maps.Map(document.getElementById('map'), {
		          center: my_neighbourhood,
		          zoom: 15,
		          styles: style_blue_essence
		        });

		        ko.applyBindings(new myViewModel());

		        function myViewModel(){
		        	
		        	this.availablePlaces = ko.observableArray(['bakery', 'cafe', 'restaurant', 'store']); 
					this.selectedOptionValue = ko.observable('store');
					
					this.request = {
						location: my_neighbourhood,
						radius: '500',
						query: this.selectedOptionValue()
					};

					allItems = ko.observableArray();

					service = new google.maps.places.PlacesService(map);
					service.textSearch(this.request,callback);

					function callback(results,status)
					{
						for(i=0;i<results.length;i++)
						{
							allItems.push(results[i].name);
						}
					}
					}
				}


