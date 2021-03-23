const Alexa = require('ask-sdk-core');
const axios = require('axios');
const format = require('date-fns/format');
const parseISO = require('date-fns/parseISO');
const ptBR = require('date-fns/locale/pt-BR');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        return axios.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php?country=Brazil', {
            method: "GET",
            headers: {
                "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
                "x-rapidapi-key": "@react-app-rapid-api-key-production-mqdf",
            },
        })
            .then(sucess => {
                const data = response.data.latest_stat_by_country[0];

                const speakOutput = `O número de casos de Corona Vírus no Brasil Hoje é de ${data.total_cases} pessoas infectadas nas últimas 24 horas`;

                return handlerInput.responseBuilder
                        .speak(speakOutput)
                        .getResponse();
            })

            // .then(response => {
            //     const issues = response.data((issue, index) => {
            //         console.log()
            //     })

            //     const issuesQuantity = issues.length;
            //     const speakOutput = `${issuesQuantity} vagas foram encontradas... ` + issues.join('...');

            //     return handlerInput.responseBuilder
            //         .speak(speakOutput)
            //         .getResponse();
            // })
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Diga apenas: Alexa, monitor de covid ';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Até mais!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Ocorreu um erro ao requisitar o número de pessoas infectadas por Corona Vírus, Por Favor, tente novamente.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
