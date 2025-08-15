document.addEventListener('DOMContentLoaded', () => {

    const chartContainer = document.getElementById('aqi-chart-container');
    const AQICN_API_KEY = '373e5a508f92508086306dcbe5da75cb7e878df7'; // Coloque sua chave aqui

    function getAqiIndicator(aqi) {
        if (aqi <= 50) return { text: 'BOM', className: 'good' };
        if (aqi <= 100) return { text: 'MODERADO', className: 'moderate' };
        if (aqi <= 150) return { text: 'RUIM (Grupos Sensíveis)', className: 'unhealthy-sensitive' };
        if (aqi <= 200) return { text: 'RUIM', className: 'unhealthy' };
        if (aqi <= 300) return { text: 'MUITO RUIM', className: 'very-unhealthy' };
        return { text: 'PÉSSIMO', className: 'hazardous' };
    }

    async function fetchAirQuality() {
        const cities = [
            'Sao Paulo', 'Mexico City', 'New York', 'Los Angeles', 'Bogota', 'Lima', 'Santiago', 'Buenos Aires', 'Ottawa',
            'London', 'Paris', 'Berlin', 'Moscow', 'Madrid', 'Rome', 'Kiev', 'Athens',
            'Beijing', 'New Delhi', 'Tokyo', 'Seoul', 'Jakarta', 'Bangkok', 'Hanoi', 'Manila', 'Singapore', 'Kuala Lumpur', 'Tehran',
            'Cairo', 'Riyadh', 'Johannesburg', 'Nairobi', 'Lagos', 'Kinshasa',
            'Sydney', 'Wellington'
        ];
        
        chartContainer.innerHTML = '<p class="loading-message">Buscando e renderizando dados globais...</p>';

        const cityDataPromises = cities.map(city =>
            fetch(`https://api.waqi.info/feed/${city}/?token=${AQICN_API_KEY}`)
                .then(response => response.json())
                // Anexamos o nome original da cidade a cada resultado
                .then(data => ({ cityName: city, data: data })) 
                .catch(error => {
                    console.error(`Erro ao buscar dados de ${city}:`, error);
                    return { cityName: city, data: null }; // Retorna um objeto de erro para não quebrar o Promise.all
                })
        );

        const results = await Promise.all(cityDataPromises);

        const validResults = results.filter(res => res.data && res.data.status === 'ok' && res.data.data.aqi !== '-');
        
        const processedData = validResults.map(res => ({
            name: res.cityName, 
            aqi: Number(res.data.data.aqi)
        }));

        processedData.sort((a, b) => b.aqi - a.aqi);

        console.log('Dados processados:', processedData);

        chartContainer.innerHTML = '';

        if (processedData.length === 0) {
            chartContainer.innerHTML = '<p class="loading-message">Não foi possível carregar os dados. Verifique sua chave de API.</p>';
            return;
        }

        const maxAqi = Math.max(...processedData.map(c => c.aqi), 200);

        processedData.forEach(city => {
            const barContainer = document.createElement('div');
            barContainer.className = 'chart-row';
            const indicator = getAqiIndicator(city.aqi);
            const barWidth = Math.min((city.aqi / maxAqi) * 100, 100);

            barContainer.innerHTML = `
                <div class="row-label">
                    <span class="city-name">${city.name}</span>
                    <span class="indicator-text">${indicator.text}</span>
                </div>
                <div class="row-bar">
                    <div class="bar-value ${indicator.className}" style="width: ${barWidth}%;">
                        <span>${city.aqi}</span>
                    </div>
                </div>
            `;
            
            chartContainer.appendChild(barContainer);
        });
    }

    fetchAirQuality();
});
