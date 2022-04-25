
function updateMap(){
fetch("/data.json")
.then(respone=>respone.json())
.then(resp=>{
    console.log(resp.data);
resp.data.forEach(element => {
    longitude=element.longitude;
    latitude=element.latitude;

    cases=element.infected;
    if(cases<500){
        color="green"
    }
    else if(cases>500 && cases<2000){
        color="Yellow"
    }
    else {
        color="red"
        maponLoad(element.name,element.longitude,element.latitude);
    }
    new mapboxgl.Marker({
        
        scale:0.5,
        color:color
        
    })
    .setLngLat([longitude,latitude])
    .addTo(map);
    
});
})
}
updateMap();
function maponLoad(name ,longitude , latitude){
    map.on('load', () => {
        map.addSource(`${name}`, {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {
                            'description':
                                `<strong>${name}</strong>`
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [longitude,latitude]
                        }
                    },

                ]
            }
        });
        // Add a layer showing the places.
        map.addLayer({
            'id': `${name}`,
            'type': 'circle',
            'source': `${name}`,
            'paint': {
                'circle-color': '#4264fb',
                'circle-radius': 3,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        });

        // Create a popup, but don't add it to the map yet.
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', `${name}`, (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });

        map.on('mouseleave', `${name}`, () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    }); 
}