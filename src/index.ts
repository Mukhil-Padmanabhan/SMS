import {SQSEvent, SNSMessage } from "aws-lambda"
import {SNSParams, MessageParams} from "./interfaces"
import { isMessageBodyValid, isPhoneNumberValid } from "./commons"
import {MSG_ATTRIBUTES, SEND_MSG_ARN} from "./constants"
var AWS = require('aws-sdk');
var SNS = new AWS.SNS({apiVersion: '2010-03-31', region: 'us-west-1'})
let currentSubscription: any = {}
/**
 * This function is the entry point for the AWS lambda function as defined in its configuration.
 * @param event : SQSEvent :: Event recieved from the SQS Queue  
 */
export const handler = (event: SQSEvent) => {
    if(event?.Records.length) {

        try {
            event.Records
            .forEach(async (data: any) => {
                let queueData = JSON.parse(data.body);
                // Putting essential values into an object for easier resusability
                let recordParams: MessageParams = {
                    phoneNumber: queueData?.MessageAttributes?.Number?.Value || '',
                    message: queueData.Message,
                    TopicArn: queueData.TopicArn
                }
                const resp = await checkIfAlreadySubscribed(recordParams)
                if (!resp) {
                    await subscribeSNS(recordParams)
                }
                if(
                    isMessageBodyValid(recordParams.message) && 
                    isPhoneNumberValid(recordParams.phoneNumber) 
                ) {
                    return sendMessage(recordParams.message);
                }
                throw {message: "Validation failed"};
          });
        } catch(e) {
            return e
        }
      
    }
    return "Queue is empty";
};

/**
 * This function gets the list of already subscribed services.  
 * @param data 
 */
export const getSubscribersList = async (data: any) => {
    const params = {
        TopicArn: data.TopicArn
      };
    try {
        const data = await SNS.listSubscriptionsByTopic(params).promise();
        return data;
    } catch(e) {
        console.log('___ERROR__SUBSCRIBING___', e)
        throw e
    }
}

/**
 * This function checks if the number has already been subscribed. This can be used to 
 * @param data 
 * @param msgParams 
 */
export const checkIfAlreadySubscribed = async (msgparams: MessageParams) => {
    const params = {
        TopicArn: SEND_MSG_ARN
      };
    let doesNumberExist = false;

    try {
        const subscriptions = await getSubscribersList(params)
        console.log('____Subscriptions_____', subscriptions)
        currentSubscription = subscriptions?.Subscriptions.filter((data: any) => data.Protocol === 'sms' && data.Endpoint === msgparams.phoneNumber)
        console.log('___currentSubscription', currentSubscription)
        doesNumberExist =  Boolean(currentSubscription.length)
      } catch (err) {
        console.log('_____Error listing subscriptions for SNS topic______', err);
      }
      return doesNumberExist;
}

/**
 * This function checks if the number has already been subscribed. This can be used to 
 * @param message 
 * @param number 
 */
export const subscribeSNS = async (msgparams: MessageParams) => {
    const subparams = {
        Protocol: 'sms',
        TopicArn: SEND_MSG_ARN,
        Endpoint: msgparams.phoneNumber
      };
      console.log('___SUBPARAM', subparams);
      try {
        await SNS.subscribe(subparams).promise();
        console.log('_____Successfully subscribed to SNS topic____');
      } catch (err) {
        console.error('____Error subscribing to SNS topic____', err);
        throw({message: 'Error subscribing to SNS topic'})
      }
       
}

/**
 * This function performs the action to send the message to the given number received from the SQS queue
 * @param message 
 */
export const sendMessage = (message: string) => {

    // SNS params; Message is required along with either PhoneNumber / TopicArn
    let params : SNSParams = {
            Message: message,
            MessageAttributes: MSG_ATTRIBUTES,
            TopicArn: SEND_MSG_ARN,
        };
    
    // Core logic for sending message
    let publishTextPromise: Promise<any> = SNS.publish(params).promise();

    return publishTextPromise
        .then((data: SNSMessage) => {
            console.log('__Success_Response__',JSON.stringify({
                 MessageID: data.MessageId, 
                 Message: params.Message, 
            })); // Logging to see it in cloudwatch
            return { 
                MessageID: data.MessageId, 
                Message: params.Message, 
            };
        }).catch((err: any) => {    
            console.log('__Error_Response__',JSON.stringify({ 
                Error: err 
            })); // Logging to see it in cloudwatch
            return new Error('Publish failed');
        });
}

