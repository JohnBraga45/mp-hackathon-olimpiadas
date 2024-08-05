let map;

async function fetchCoordinates(locationName) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`);
        const data = await response.json();
        if (data && data[0]) {
            return {
                lat: data[0].lat,
                lon: data[0].lon
            };
        }  
    } catch (error) {
        console.error('Erro ao obter coordenadas:', error);
        return null;
    }
}

async function initMap() {
    map = L.map('map').setView([48.8566, 2.3522], 12); // Centralizado em Paris por padrão

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const venuesUrl = 'https://apis.codante.io/olympic-games/venues';
    const venuesData = await fetchData(venuesUrl);

    if (venuesData && Array.isArray(venuesData.data)) {
        for (const venue of venuesData.data) {
            const coordinates = await fetchCoordinates(venue.name);
            if (coordinates) {
                L.marker([coordinates.lat, coordinates.lon])
                    .addTo(map)
                    .bindPopup(`<strong>${venue.name}</strong><br><a href="${venue.url}" target="_blank">Mais informações</a>`);
            }  
        }
    } else {
        console.error('Erro: Dados inválidos para os locais.', venuesData);
    }
}
