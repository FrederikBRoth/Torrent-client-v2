
const dotenv = require('dotenv').config()
const Table = require('cli-table');
const clui = require('clui');
const Progress = clui.Progress;
const prettyMilliseconds = require('pretty-ms');

var table = new Table({
    head: ['Movie Name', 'Torrent ID', 'Progress', 'Time Left']
});

const Transmission = require('transmission')
const transmission = new Transmission({
    host: '192.168.1.71',
    port: 9091,
    username: process.env.TRANSMISSION_USER,
    password: process.env.TRANSMISSION_PASS
})

function getTransmissionStats() {
    transmission.sessionStats(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
}

function addTorrent(url) {
    transmission.addUrl(url, function (err, result) {
        if (err) {
            return console.log(err);
        }
        var id = result.id;
        console.log('Just added a new torrent.');
        console.log('Torrent ID: ' + id);
    });
}

function getTorrentDetails(id) {
    transmission.get(id, function(err, result) {
        if (err) {
            throw err;
        }
        if(result.torrents.length > 0){
        	// console.log(result.torrents[0]);			// Gets all details
        	console.log("Name = "+ result.torrents[0].name);
        	console.log("Download Rate = "+ result.torrents[0].rateDownload/1000);
        	console.log("Upload Rate = "+ result.torrents[0].rateUpload/1000);
        	console.log("Completed = "+ result.torrents[0].percentDone*100);
        	console.log("ETA = "+ result.torrents[0].eta/3600);
        	console.log("Status = "+ getStatusType(result.torrents[0].status));
        }
    });
}

function getAllTorrents() {
    transmission.all(function(err, result){
        if (err){
            console.log(err);
        }
        else {
            console
            for (var i=0; i< result.torrents.length; i++){
                let thisProgressBar = new Progress(20)
                let humanReadableTime = result.torrents[i].eta > 0 ? prettyMilliseconds((result.torrents[i].eta * 1000), {compact: true}) : "Calculating/Not running"
                table.push(
                    [result.torrents[i].name, result.torrents[i].id, (thisProgressBar.update(result.torrents[i].percentDone)).toString(), humanReadableTime ]
                );
                console.log(result.torrents[i])
            }
            console.log(table.toString())
        }
        });
}

function stopTorrent(id){
    console.log(id)
    transmission.stop(id, function(err, result){
        console.log(err)
        console.log(result)
    });
}

function getTorrentDetails(id) {
    transmission.get(id, function(err, result) {
        if (err) {
            throw err;
        }
        if(result.torrents.length > 0){
        	// console.log(result.torrents[0]);			// Gets all details
        	console.log("Name = "+ result.torrents[0].name);
        	console.log("Download Rate = "+ result.torrents[0].rateDownload/1000);
        	console.log("Upload Rate = "+ result.torrents[0].rateUpload/1000);
        	console.log("Completed = "+ result.torrents[0].percentDone*100);
        	console.log("ETA = "+ result.torrents[0].eta/3600);
        	console.log("Status = "+ getStatusType(result.torrents[0].status));
        }
    });
}

function removeTorrent(id, del) {
    transmission.remove(id, del, (err, arg) => {
        console.log(arg)
    })
}

module.exports.getTransmissionStats = getTransmissionStats
module.exports.addTorrent = addTorrent
module.exports.getAllTorrents = getAllTorrents
module.exports.stopTorrent = stopTorrent
module.exports.getTorrentDetails = getTorrentDetails
module.exports.removeTorrent = removeTorrent