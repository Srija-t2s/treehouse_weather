const http = require('http');
const https = require('https');
const api = require('./api.json');

function printWeather(weather){
    const message = `Current temperature in ${weather.name} is ${weather.main.temp}F`;
    console.log(message);
}

function printError(error){
    console.error(error.message);
}
function get(query){
    console.log('query value',query);
    const readableQuery = query.replace('_',' ');
    try{
    const request = https.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${api.key}`,(response) => {
        if(response.statusCode === 200){
            let body = "";
            response.on('data',chunk =>{
                body += chunk ;
            });

        response.on('end',() => {
            try{
                const weather = JSON.parse(body);
                if(weather.name){
                    printWeather(weather);
                }else{
                    const queryError = new Error(`The location ${readableQuery} was not found`);
                    printError(queryError);
                } 
            }
            catch(error){
                printError(error);
            }
        });
    }
    else{
        // const statusCodeError = new Error(`There was an error getting the message for ${readableQuery}.($(http.STATUS_CODES[response.statusCode]))`);
        // printError(statusCodeError);
    }   
    });
    request.on('error',printError);
    }
    catch(error){
        //Malformed URL Error
        printError(error);
    }
}

module.exports.get = get;