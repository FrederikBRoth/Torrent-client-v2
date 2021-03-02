#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const { getMovies, getMovieDetails, assembleMagnetURI } = require("./yts")
const { askQuestion, assembleQuestion } = require("./option-selector")
const { findQualityObject } = require("./Support Files/helpers")

const { getTransmissionStats, addTorrent, getAllTorrents, stopTorrent, getTorrentDetails, removeTorrent } = require("./transmission-handler")

clear()
console.log(
    chalk.yellow(
        figlet.textSync('Fatricos YTS Client', { horizontalLayout: 'full' })
    )
);
console.log("Welcome to Fatricos YTS Client!")

require('yargs')
    .scriptName('yts')
    .usage('$0 <cmd> [args]')
    .command('download [s]', 'Searching for [s]!', (yargs) => {
        yargs.positional('s', {
            type: 'string',
            describe: 'The search string to search for movies with'
        })
    }, async function (argv) {
        if (argv.s != undefined) {
            let data = await getMovies(argv.s)
            let answer = await askQuestion(data, 'movie')
            let movieObject = data.find(element => element.title == answer)
            let movieDetails = await getMovieDetails(movieObject.id)
            let qualityAnswer = await askQuestion(movieDetails, 'quality')
            let qualityObject = findQualityObject(movieDetails, qualityAnswer)
            let magnetURI = assembleMagnetURI(qualityObject.hash, qualityObject.url)
            addTorrent(magnetURI)

        }

    })
    .command('torrent', 'Gets the torrent information!', (yargs) => {
        yargs
            .command('list', 'List all torrents', (yargs) => {
            }, (argv) => {
                getAllTorrents()
            })
            .command('stop <id>', 'Stop specific torrent', (yargs) => {   
            }, (argv) => {
                console.log(argv.id)
                stopTorrent(argv.id)
            })
            .command('delete <id> [clean]', 'delete specific torrent', (yargs) => {
                yargs.positional('clean', {
                    type: 'boolean',
                    describe: 'The search string to search for movies with',
                    default: false
                })   
            }, async (argv) => {
                
                let response = await askQuestion("Are you sure you want to delete?", 'confirm')
                if(response) {
                    removeTorrent(argv.id, argv.clean)
                    console.log(argv.clean)
                } else {
                    console.log("Cancelled deletion")
                }
                
            })
    }, function (argv) {
        if (argv.i != undefined) {
            getAllTorrents()
        }
        if (argv.s != undefined) {
            console.log(argv.s)
            let id = Number(argv.s)
            stopTorrent(id)
        }

    })
    .help()
    .argv


// require('yargs')
//   .scriptName("pirate-parser")
//   .usage('$0 <cmd> [args]')
//   .command('hello [name]', 'welcome ter yargs!', (yargs) => {
//     yargs.positional('name', {
//       type: 'string',
//       describe: 'the name to say hello to'
//     })
//   }, function (argv) {
//     console.log('hello', argv.name, 'welcome to yargs!')
//   })
//   .help()
//   .argv