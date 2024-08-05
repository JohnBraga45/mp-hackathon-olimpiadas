let medalChartInstance;

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
         return data;
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        return null;
    }
}

async function loadFilters() {
    const countriesUrl = 'https://apis.codante.io/olympic-games/countries';
    const sportsUrl = 'https://apis.codante.io/olympic-games/disciplines';

    const countriesData = await fetchData(countriesUrl);
    const sportsData = await fetchData(sportsUrl);

    const countrySelect = document.getElementById('country');
    if (countriesData && Array.isArray(countriesData.data)) {
        countrySelect.innerHTML = '';  
        countriesData.data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
    } else {
        console.error('Erro: Dados inválidos para os países.', countriesData);
    }

    const sportSelect = document.getElementById('sport');
    if (sportsData && Array.isArray(sportsData.data)) {
        sportSelect.innerHTML = '';  
        sportsData.data.forEach(sport => {
            const option = document.createElement('option');
            option.value = sport.name;
            option.textContent = sport.name;
            sportSelect.appendChild(option);
        });
    } else {
        console.error('Erro: Dados inválidos para os esportes.', sportsData);
    }
}

async function displayMedalChart() {
    const year = document.getElementById('year').value;
    const country = document.getElementById('country').value || '';
    const sport = document.getElementById('sport').value || '';
    const medal = document.getElementById('medal').value;

    let url = `https://apis.codante.io/olympic-games/countries?year=${year}&medal=${medal}`;
    if (country) {
        url += `&country=${country}`;
    }
    if (sport) {
        url += `&discipline=${sport}`;
    }

    const data = await fetchData(url);

    const noDataMessage = document.getElementById('noDataMessage');
    const ctx = document.getElementById('medalChart').getContext('2d');

    if (data && Array.isArray(data.data) && data.data.length > 0) {
        if (medalChartInstance) {
            medalChartInstance.destroy();
        }

        const selectedCountryIndex = data.data.findIndex(item => item.name === country);
        const highlightBackgroundColor = 'rgba(75, 192, 192, 0.2)';
        const highlightBorderColor = 'rgba(75, 192, 192, 1)';

        medalChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.data.map(item => item.name),
                datasets: [
                    {
                        label: 'Ouro',
                        data: data.data.map(item => item.gold_medals || 0),
                        backgroundColor: data.data.map((item, index) => index === selectedCountryIndex ? highlightBackgroundColor : 'rgba(255, 215, 0, 0.2)'),
                        borderColor: data.data.map((item, index) => index === selectedCountryIndex ? highlightBorderColor : 'rgba(255, 215, 0, 1)'),
                        borderWidth: 1
                    },
                    {
                        label: 'Prata',
                        data: data.data.map(item => item.silver_medals || 0),
                        backgroundColor: data.data.map((item, index) => index === selectedCountryIndex ? highlightBackgroundColor : 'rgba(192, 192, 192, 0.2)'),
                        borderColor: data.data.map((item, index) => index === selectedCountryIndex ? highlightBorderColor : 'rgba(192, 192, 192, 1)'),
                        borderWidth: 1

                    },
                    {
                        label: 'Bronze',
                        data: data.data.map(item => item.bronze_medals || 0),
                        backgroundColor: data.data.map((item, index) => index === selectedCountryIndex ? highlightBackgroundColor : 'rgba(205, 127, 50, 0.2)'),
                        borderColor: data.data.map((item, index) => index === selectedCountryIndex ? highlightBorderColor : 'rgba(205, 127, 50, 1)'),
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total de Medalhas'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'País'
                        }
                    }
                }
            }
        });

        noDataMessage.style.display = 'none';
    } else {
        if (medalChartInstance) {
            medalChartInstance.destroy();
        }

        noDataMessage.style.display = 'block';
    }
}
