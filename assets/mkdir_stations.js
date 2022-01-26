//Hier eigene Stationsdaten und Pfad zum Speicherort einfügen
const stationData = './stations/stations_berlin';
const path = './'

const fs = require('fs');
const { stations } = require(stationData);

stations.map(station => {
    const stationName = station.name.toLowerCase().replaceAll(' ', '_');
    
    fs.mkdir(`${path}${stationName}`, () => {
        console.log(`Info » Der Ordner ${stationName} wurde erstellt`);
    })
})