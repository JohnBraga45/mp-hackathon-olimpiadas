document.getElementById('year').addEventListener('change', displayMedalChart);
document.getElementById('country').addEventListener('change', displayMedalChart);
document.getElementById('sport').addEventListener('change', displayMedalChart);
document.getElementById('medal').addEventListener('change', displayMedalChart);

loadFilters();
displayMedalChart();  
initMap();
