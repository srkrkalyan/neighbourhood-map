
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
		          zoom: 10,
		          styles: style_blue_essence
		        });

		        
		   		getHotels();


			//a function to search nearby hotels using Places API
				function getHotels(){

				request = {
					location: my_neighbourhood,
					radius: '5000',
					types: ['hotel']
				};

				service = new google.maps.places.PlacesService(map);
				service.nearbySearch(request,callback);
				function callback(results,status){
					geocoder = new google.maps.Geocoder();
					//Pass the retrieved results to ViewModel
					placesViewModel(results);
					for(i=0;i<10;i++){
						geocoder.geocode({'placeId': results[i].place_id}, function(geo_results, status){
							if (status == 'OK'){
								var marker = new google.maps.Marker({
									position: geo_results[0].geometry.location,
									map: map
								});
								
							}
							
						});
						}		 
					}
					}

			var placesViewModel = function(results){
						this.mapResults = new Array();
						this.places = new Array();
						mapResults = results;
						if (mapResults){
							for(i=0;i<mapResults.length;i++)
							{	
								this.places.push(mapResults[i].name);
							}

							}
						this.availablePlaces = ko.observableArray(['Bakery', 'Cafe', 'Park', 'Store']); //this is working fine
						this.allItems = ko.observableArray(this.places); //this is not working
				}

			ko.applyBindings(new placesViewModel());

}
      