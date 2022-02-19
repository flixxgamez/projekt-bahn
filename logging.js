const logStation = (stationData) => {
    console.log(`Projekt-Bahn 〣 Abfrage für den Bahnhof ${stationData.name} (${stationData.eva}) ➔  ${stationData.region} gestartet!`)
}

const logStop = (discordJS, discordClient, stop, stationData, discordID) => {
    
    if(stop.cancelled != true) {

        const depatureTime = (stop) => {
            const depatureDate = new Date(stop.when);
            const depatureTime = depatureDate.toLocaleTimeString('de-DE');
    
            if(stop.delay > 0) {
                const plannedDate = new Date(stop.plannedWhen);
                const plannedTime = plannedDate.toLocaleTimeString('de-DE');
    
                return `~~${plannedTime}~~ ➔ ${depatureTime} (${stop.delay / 60} Minuten Verspätung)`;
            }  else return depatureTime;    
        };
    
        const depaturePlatform = (stop) => {
            const platform = stop.platform;
            const plannedPlatform = stop.plannedPlatform;
    
            if(platform != plannedPlatform) {
                return `~~${plannedPlatform}~~ ➔ ${platform}`;
            } else return(platform);
        }

        const getColor = (stop) => {
            if(stop.delay === 0) {
                return '#63a615';
            } else if (stop.delay > 300) {
                return '#f39200';
            } else {
                return '#fff000';
            }
        }

    
        const depatureEmbed = new discordJS.MessageEmbed()
            .setAuthor('Projekt Bahn - Download', 'https://yannickbomhoff.de/media/bahn/icon.jpg')
            .setTitle(`Information zu ${stop.line.name} 〣 ${stationData.name} ➔ ${stop.direction} \n \u200B`)
            .setColor(getColor(stop))
            .setTimestamp()
            .setFooter('Projekt-Leitung » flixx#9891')
            .addFields([
                {name: 'Zuglauf', value: `${stop.line.productName} ${stop.line.fahrtNr}       [betrieben durch ${stop.line.operator.name}]`, inline: false},
                {name: 'Abfahrtszeit', value: `${depatureTime(stop)}`, inline: false},
                {name: 'Gleis', value: `${depaturePlatform(stop)}`, inline: false}
            ])
    
        const logChannel = discordClient.channels.cache.get(discordID);
        logChannel.send(depatureEmbed);

    } else {
        const cancelEmbed = new discordJS.MessageEmbed()
        .setAuthor('Projekt Bahn - Download', 'https://yannickbomhoff.de/media/bahn/icon.jpg')
        .setTitle(`Information zu ${stop.line.name} 〣 ${stationData.name} ➔ ${stop.direction} 〣 Fällt heute aus \n \u200B`)
        .setColor('#c50014')
        .setTimestamp()
        .setFooter('Projekt-Leitung » flixx#9891')
        .addFields([
            {name: 'Zuglauf', value: `${stop.line.productName} ${stop.line.fahrtNr}       [betrieben durch ${stop.line.operator.name}]`, inline: false},
            {name: 'Abfahrtszeit', value: `~~${new Date(stop.plannedWhen).toLocaleTimeString('de-DE')}~~`, inline: false},
            {name: 'Gleis', value: `~~${stop.plannedPlatform}~~`, inline: false}
        ])

    const logChannel = discordClient.channels.cache.get(discordID);
    logChannel.send(cancelEmbed);
    }

}

const saveData = (response, path, stationData) => {

    const fs = require('fs');
    const data = JSON.stringify(response, null, 2);
    const regionName = stationData.region.toLowerCase().replaceAll(' ', '_');
    const stationName = stationData.name.toLowerCase().replaceAll(' ', '_');
    const fileName = new Date().toISOString().replace(':', '_').slice(2, -8) + '.json';

    fs.writeFile(`${path}/${regionName}/${stationName}/${fileName}`, data, (err) => {
        if(err){
            console.error(err); 
        }
    })

}

exports.logStation = logStation;
exports.logStop = logStop;
exports.saveData = saveData;