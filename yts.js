const fetch = require('node-fetch');
const apiAdress = "https://yts.mx/api/v2"
const trackers = require("./Support Files/trackers.json")


async function getMovies(searchStr) {
    let response = await fetch(apiAdress + "/list_movies.json?query_term=" + searchStr)
    let data = await response.json()
    let movies = []
    
    for (const movie of data.data.movies) {
        let movieObject = {title: movie.title, id: movie.id}
        movies.push(movieObject)
    }
    return movies
}

async function getMovieDetails(movieID) {
    let response = await fetch(apiAdress + "/movie_details.json?movie_id=" + movieID)
    let data = await response.json()
    return data.data.movie.torrents
}

function assembleMagnetURI(hash, url) {
    let trackerString = ""
    for (const tracker of trackers.trackers){
        trackerString += "&tr=" + tracker
    }
    let magnetLink = "magnet:?xt=urn:btih:" + hash + "&dn=" + url + trackerString
    return magnetLink
}


module.exports.getMovieDetails = getMovieDetails
module.exports.assembleMagnetURI = assembleMagnetURI
module.exports.getMovies = getMovies
