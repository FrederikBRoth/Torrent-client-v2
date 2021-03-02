let inquirer = require('inquirer');
const { resolve } = require('path');


function assembleMovieQuestion(movies) {
    let questions = []
    let movieStringArray = movies.map((element, index) => element.title)
    let question = {
        type: 'list',
        name: 'data',
        message: 'What movie will you download?',
        choices: movieStringArray
    }
    questions.push(question)
    return questions
}

function assembleQualityQuestion(movies) {
    let questions = []
    let qualityStringArray = movies.map((element, index) => element.quality + " " + element.type)
    let question = {
        type: 'list',
        name: 'data',
        message: 'What quality will you download the movie in?',
        choices: qualityStringArray
    }
    questions.push(question)
    return questions
}

function assembleConfirmQuestion(description) {
    let questions = []
    let question = {
        type: 'confirm',
        name: 'data',
        message: description,
    }
    questions.push(question)
    return questions
}

async function askQuestion(options, type) {
    let questions = []
    switch (type) {
        case 'movie':
            questions = assembleMovieQuestion(options)
            break
        case 'quality':
            questions = assembleQualityQuestion(options)
            break
        case 'confirm':
            questions = assembleConfirmQuestion(options)
            break
        default:
            console.log("No type was entered or the type entered isn't defined")
            return undefined
    }
    const questionPromise = new Promise((resolve, reject) => {
        inquirer
            .prompt(questions)
            .then(answers => {
                resolve(answers.data)
            })
            .catch(error => {
                if (error.isTtyError) {
                    console.log("tty fuck")
                } else {
                    console.log(error)
                }
            })
    })
    let answer = await questionPromise
    return answer

}

module.exports.askQuestion = askQuestion
