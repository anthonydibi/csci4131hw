let map;
const uofM = { lat: 44.9727, lng: -93.23540000000003 };

function initMap() {
    // The location of Uluru
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map2"), {
      zoom: 16,
      center: uofM,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: uofM,
      map: map,
    });
    var input = document.getElementById('location'); 
    var autocomplete = new google.maps.places.Autocomplete(input); 
    var service = new google.maps.places.PlacesService(map);
    map.addListener("click", function(event){
      console.log(event);
      var detailsRequest = {
        placeId: event.placeId,
        fields: ['formatted_address']
      };
      service.getDetails(detailsRequest, function(place, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){
          input.value = place.formatted_address
        }
      })
    });
}
