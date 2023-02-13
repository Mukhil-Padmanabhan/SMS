import {SQSEvent, SNSMessage, SQSRecord } from "aws-lambda"
import {SNSParams, MessageParams} from "./interfaces"
import { isMessageBodyValid, isPhoneNumberValid } from "./commons"
import {MSG_ATTRIBUTES} from "./constants"
var AWS = require('aws-sdk');
var SNS = new AWS.SNS({apiVersion: '2010-03-31'})

/**
 * This function is the entry point for the AWS lambda function as defined in its configuration.
 * @param event : SQSEvent :: Event recieved from the SQS Queue  
 */
export const handler = (event: SQSEvent) => {
    if(event?.Records.length) {
        try {
            event.Records
            .forEach((data: SQSRecord) => {
                // Putting essential values into an object for easier resusability
                let recordParams: MessageParams = {
                    phoneNumber: data?.messageAttributes?.Number?.stringValue || '',
                    message: data.body
                }
                if(
                    isMessageBodyValid(recordParams.message) && 
                    isPhoneNumberValid(recordParams.phoneNumber)
                ) {
                    return sendMessage(recordParams.message, recordParams.phoneNumber);
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
 * This function performs the action to send the message to the given number received from the SQS queue
 * @param message 
 * @param number 
 */
export const sendMessage = (message: string, number: string) => {

    // SNS params; Message is required along with either PhoneNumber / TopicArn
    let params : SNSParams = {
            Message: message,
            PhoneNumber: number,
            MessageAttributes: MSG_ATTRIBUTES,
        };
    
    // Core logic for sending message
    let publishTextPromise: Promise<any> = SNS.publish(params).promise();

    return publishTextPromise
        .then((data: SNSMessage) => {
            console.log('__Success_Response__',JSON.stringify({
                 MessageID: data.MessageId, 
                 Message: params.Message, 
                 PhoneNumber: params.PhoneNumber 
            })); // Logging to see it in cloudwatch
            return { 
                MessageID: data.MessageId, 
                Message: params.Message, 
                PhoneNumber: params.PhoneNumber 
            };
        }).catch((err: any) => {    
            console.log('__Error_Response__',JSON.stringify({ 
                Error: err 
            })); // Logging to see it in cloudwatch
            return new Error('Publish failed');
        });
}

