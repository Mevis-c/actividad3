const apiKey = 'c6f6c03abc7f86764137e9917d2c3c46'; 
let map; 


function loadMap(latitude, longitude, municipio) {
   
    if (map) {
        map.remove();
    }
    map = L.map("map").setView([latitude, longitude], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup(`<b>${municipio}</b><br><a href="https://weather.com/es-DO/tiempo/mapas/interactive/l/${municipio.replace(/\s/g, '+')}+C%C3%B3rdoba+Colombia?canonicalCityId=66a72344b4df28355a7d1b618fedba3d2e1f0bfd0ce48fff848c1016f271668c" target="_blank">Ver clima en Weather.com</a>`).openPopup();
}


function getWeatherInfo(municipio) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${municipio},co&appid=${apiKey}&lang=es&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la información del clima');
            }
            return response.json();
        })
        .then(data => {
            const climaTableBody = document.getElementById('climaTableBody');
            climaTableBody.innerHTML = `
                <tr>
                    <th scope="row">Temperatura actual</th>
                    <td>${data.main.temp}°C</td>
                </tr>
                <tr>
                    <th scope="row">Sensación térmica</th>
                    <td>${data.main.feels_like}°C</td>
                </tr>
                <tr>
                    <th scope="row">Temperatura mínima</th>
                    <td>${data.main.temp_min}°C</td>
                </tr>
                <tr>
                    <th scope="row">Temperatura máxima</th>
                    <td>${data.main.temp_max}°C</td>
                </tr>
                <tr>
                    <th scope="row">Presión atmosférica</th>
                    <td>${data.main.pressure} hPa</td>
                </tr>
                <tr>
                    <th scope="row">Humedad</th>
                    <td>${data.main.humidity}%</td>
                </tr>
                <tr>
                    <th scope="row">Velocidad del viento</th>
                    <td>${data.wind.speed} m/s</td>
                </tr>
                <tr>
                    <th scope="row">Dirección del viento</th>
                    <td>${data.wind.deg}°</td>
                </tr>
                <tr>
                    <th scope="row">Nubosidad</th>
                    <td>${data.clouds.all}%</td>
                </tr>
                <tr>
                    <th scope="row">Precipitación</th>
                    <td>${data.weather[0].description}</td>
                </tr>
                <tr>
                    <th scope="row">Hora de salida del sol</th>
                    <td>${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</td>
                </tr>
                <tr>
                    <th scope="row">Hora de puesta del sol</th>
                    <td>${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</td>
                </tr>
            `;
            loadMap(data.coord.lat, data.coord.lon, municipio); 
        })
        .catch(error => console.error('Error al obtener la información del clima:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    const municipioSelect = document.getElementById('municipioSelect');
    municipioSelect.addEventListener('change', function() {
        const municipio = municipioSelect.value;
        if (municipio) {
            getWeatherInfo(municipio);
        }
    });
});


document.getElementById('buscarBtn').addEventListener('click', function() {
    const municipioSelect = document.getElementById('municipioSelect');
    const municipio = municipioSelect.value;
    if (municipio) {
        getWeatherInfo(municipio);
    } else {
        alert('Seleccione un municipio antes de buscar.');
    }
});
