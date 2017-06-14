
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


		        
		   		getHotels();



			//a function to search nearby places and create markers array
				function getHotels(){

				var request_bakery = {
					location: my_neighbourhood,
					radius: '500',
					query: 'bakery'
				};

				var request_cafe = {
					location: my_neighbourhood,
					radius: '500',
					query: 'cafe'
				};

				var request_restaurant = {
					location: my_neighbourhood,
					radius: '500',
					query: 'restaurant'
				};

				var request_store = {
					location: my_neighbourhood,
					radius: '500',
					query: 'store'
				};

				var request = {
					location: my_neighbourhood,
					radius: '500',
					query: 'bakery+cafe+restaurant+store'
				};

				//console.log(document.getElementById("places").value);

				service = new google.maps.places.PlacesService(map);
				service.textSearch(request,callback);

				function callback(results,status){
					var markers_array = [];
					geocoder = new google.maps.Geocoder();
					console.log(results);
					//Pass the retrieved results to ViewModel
					ko.applyBindings(new placesViewModel(results));

					//Getting geocodes for all the place ids returned by google places api
					//inorder to create markers at these positions

					for(i=0;i<results.length;i++){
						geocoder.geocode({'placeId': results[i].place_id}, function(geo_results, status){
							if (status == 'OK' && results[i] != undefined){
								var marker = new google.maps.Marker({
									position: geo_results[0].geometry.location,
								});
							var marker_entry = {name: results[i].types[0], marker: marker};
							console.log(marker_entry['name']);
							markers_array.push(marker_entry);
								
							}
							
						});
						}	
						//console.log(markers_array[2]);	 
					}


					}

			var placesViewModel = function(results){

						
						var bakery_places = [];
						var cafe_places = [];
						var store_places = [];
						var restaurant_places = [];


						if (results)
						{
							for(i=0;i<results.length;i++)
							{	
								//places.push(results[i].name);
								if(results[i].types.find(function(){return 'bakery'})){
									bakery_places.push(results[i].name);
									
								}
								

								if(results[i].types.find(function(){return 'cafe'})){
									cafe_places.push(results[i].name);
									
								}
								

								if(results[i].types.find(function(){return 'store'})){
									store_places.push(results[i].name);
									
								}
								

								if(results[i].types.find(function() {return 'restaurant'})){
									restaurant_places.push(results[i].name);
									
								}
								
							}
						}

						this.availablePlaces = ko.observableArray(['bakery', 'cafe', 'restaurant', 'store']); 
						this.selectedOptionValue = ko.observable('store');
						this.places = {
							'bakery': bakery_places,
							'cafe': cafe_places,
							'restaurant': restaurant_places,
							'store': store_places
						};
						console.log(store_places);
						console.log(bakery_places);

						//console.log(this.places[this.selectedOptionValue]);

						/*this.selectedPlaces = ko.pureComputed(function(){
							return this.places[this.selectedOptionValue];
						}, this);*/

						this.allItems = ko.observableArray(this.places[this.selectedOptionValue()]);
					
				}
			}


      