//Hafas-Abfrage
const createHafas = require('db-hafas');
const hafas_client = createHafas('flixx');

//Lädt Stationsdaten
const { stations } = require('./assets/stations');

//Setzt Parameter für das Intervall für Abfragen
const difference = 3;
const check_interval = 60000 * difference;
let i = 0;

//Lädt den Discord-Client für den externen Log
const DiscordJS = require('discord.js');
const discord_client = new DiscordJS.Client();
discord_client.login('OTMyMjk2NzU5NjUxMjA5MjE2.YeQ7BA.8aKrhUZ-wX1WyNPmDCxipwY57i0');

let logChannel;
discord_client.on('ready', () => {
    console.log('Discord » Der Bot wurde gestartet')
    logChannel = discord_client.channels.cache.get('932655971489161236')
});

//Lädt das File-System für die Speicherung der Rohdaten
const fs = require('fs');

//Setzt das Intervall für die Abfragen
setInterval(() => {
    if(i != stations.length -1){

        //Setzt Parameter für die abgefragte Station 
        const station = {
            name: stations[i].name,
            eva: stations[i].eva,
            region: stations[i].region,
        }
        console.log(`\n \nInfo » Der Bahnhof ${station.name} hat die EVA-Nummer ${station.eva}`);


        //Stellt Anfrage an das HAFAS-System
        hafas_client.departures(station.eva, {duration: difference, remarks: true, products: {tram: false, bus: false, ferry: false, subway: false, suburban: false}})
            .then(dep_obj => {

                const fileData = JSON.stringify(dep_obj);
                const stationName = station.name.toLowerCase().replaceAll(' ', '_');
                const fileName = new Date().toISOString().replace(':', '_').slice(2, -8) + '.json';

                fs.writeFile(`./daten/${stationName}/${fileName}`, fileData, () => {
                    
                })

                //Überprüft, ob im gegebenen Zeitraum Züge fahren
                if(dep_obj.length != 0) {
                    console.log(`Abfahrten » Am Bahnhof ${station.name} fahren in den nächsten ${check_interval / 1000 / 60} Minuten folgende Züge: \n`);
                } else {
                    console.log(`Abfahrten » Am Bahnhof ${station.name} fahren in den nächsten ${check_interval / 1000 / 60} Minuten keine Züge \n`);
                }

                dep_obj.map(stop => {

                    if(stop.line.productName != 'Bus') {

                        if(stop.platform != null) {
                            
                            console.log(`Abfahrt » ${stop.line.name} (${stop.line.operator.name}) nach ${stop.direction} auf Gleis ${stop.platform} mit einer Verspätung von ${stop.delay / 60} Minute*n.`);
                            const discord_Embed = new DiscordJS.MessageEmbed()
                                .setAuthor('Projekt Bahn - Download', 'https://yannickbomhoff.de/media/bahn/icon.jpg')
                                .setColor('#309fd1')
                                .setTitle(`Information zu ${stop.line.name} » ${station.name} » ${stop.direction}`)
                                .setTimestamp()
                                .setFooter('Projekt-Leitung » flixx#9891')
                                .addFields(
                                    {name: 'Alias »', value: `${stop.line.productName} ${stop.line.fahrtNr}`},
                                    {name: 'Echtzeitinformation »', value: `Heute auf Gleis ${stop.platform} mit einer Verspätung von ${stop.delay / 60} Minuten`},
                                )
                            logChannel.send(discord_Embed);
                            
                        } else {
                            console.log(`Ausfall » ${stop.line.name} (${stop.line.operator.name}) nach ${stop.direction} fällt aus`);
                            const discord_Embed = new DiscordJS.MessageEmbed()
                                .setAuthor('Projekt Bahn - Download', 'https://yannickbomhoff.de/media/bahn/icon.jpg')
                                .setColor('#EC0016')
                                .setTitle(`Information zu ${stop.line.name} » ${station.name} » ${stop.direction}`)
                                .setTimestamp()
                                .setFooter('Projekt-Leitung » flixx#9891')
                                .addFields(
                                    {name: 'Alias »', value: `${stop.line.productName} ${stop.line.fahrtNr}`},
                                    {name: 'Echtzeitinformation »', value: `Fällt heute aus`},
                                )
                            logChannel.send(discord_Embed);
                        }
                
                    }
                
                })
            })
        i++;

    } else {
        i = 0;
    }
}, check_interval / stations.length);