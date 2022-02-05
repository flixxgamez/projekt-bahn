//Code von flixx - Open Source » https://github.com/flixxgamez/projekt-bahn
const createClient = require('db-hafas')
const hafasClient = createClient('https://github.com/flixxgamez/projekt-bahn');

//Für das Beispiel von Berlin (siehe unter station_data/stations_berlin). Kann durch Dateien mit gleichem Aufbau ausgetauscht werden.
const { stationData } = require('./station_data/stations_berlin');
console.log(`Projekt-Bahn 〣 Das Script wurde erfolgreich für die Stationsdaten "${stationData.regionName}" gestartet \n`);

//Importiert weitere Loggingtools
const DiscordJS = require('discord.js');
const discordClient = new DiscordJS.Client();

discordClient.login(''); //Hier eigenen Token für den Discord-Bot einfügen
const { logStop } = require('./logging');

//Loop die in einem Regelmäßigen Abstand Abfahrten abfragt, 'difference' gibt Abstand zwischen 2 Durchläufen in min an
const difference = 1.5;
const intervalDuration = difference * 60000 / stationData.stations.length;
let i = 0;

setInterval(() => {

    //Lädt die relevanten Stationsdaten
    const requestStation = {
        name: stationData.stations[i].name,
        eva: stationData.stations[i].eva,
        region: stationData.stations[i].region,
    }

    if(i === stationData.stations.length - 1) {i = 0} else i++


    //Fragt die nächste Abfahrten an einem Bahnhof ab (ersetze "depatures" durch "arrivals" für Ankünfte)
    //Art der Verkehrmittel, die angefragt werden sollen können individuel geändert werden
    //Für mehr Infos siehe https://github.com/public-transport/hafas-client/blob/master/docs/departures.md
    hafasClient.departures(requestStation.eva, {duration: difference, remarks: true, products: {tram: false, bus: false, ferry: false, subway: false, suburban: false}})
        .catch(err => console.log(err))
        .then(res => {

            if(res.length != 0) {
              
                res.map(stop => {

                    //"stop" stellt für den jeden Zug aus der Abfrage die Daten dar
                    if(stop.line.mode === 'train') {
                        logStop(DiscordJS, discordClient, stop, requestStation, stationData.discordID);
                    }
                                        
                });

            } 
            
        })

}, intervalDuration)