export const displayMap = () => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoidmlsaWFtbm92aWNreSIsImEiOiJjbGVlazBvcWYwaHVjM3ZtajZveGoxM244In0.hnpQA34MhL9qxzfDOcUd2g';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/viliamnovicky/cliimy3w9004l01qv4eiee69a',
        center: [21.6529551, 49.09746],
        zoom: 11
    });

    const bounds = new mapboxgl.LngLatBounds(
        { lng: 21.6549551, lat: 49.099 },
        { lng: 21.6549551, lat: 49.09746 },
        { lng: 21.6539551, lat: 49.099 },
        { lng: 21.6539551, lat: 49.09746 },
    );
    const marker = document.createElement('div');
    marker.className = 'marker';

    new mapboxgl.Marker({
        element: marker,
        anchor: 'bottom',
    }).setLngLat({ lng: 21.6550259, lat: 49.0989784 }).addTo(map);

    map.fitBounds(bounds, {
      padding: {
        top: 440,
        bottom: 200,
        left: 150,
        right: 150,
      },
    });
};