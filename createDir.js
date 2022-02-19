const createDir = (stationData, path) => {

    const fs = require('fs');
    const regionName = stationData.regionName.toLowerCase().replaceAll(' ', '_');

    fs.mkdir(`${path}/${regionName}`, (err) => {
        if(err){
            console.error(err);
        } else {
            console.log(`Projekt-Bahn 〣 Der Ordner mit dem Namen '${regionName}' wurde erstellt.`) 
        }
    });
    stationData.stations.map(station => {

        const stationName = station.name.toLowerCase().replaceAll(' ', '_');
        fs.mkdir(`${path}/${regionName}/${stationName}`, (err) => {
            if(err){
                console.error(err);
            } else {
                console.log(`Projekt-Bahn 〣 Der Ordner mit dem Namen '${stationName}' wurde erstellt.`) 
            }
        });
        
    })

}

exports.createDir = createDir;