import 'jest';
import {SQSEvent, SNSMessage } from "aws-lambda"
var AWS = require('aws-sdk');
var SNS = new AWS.SNS({apiVersion: '2010-03-31'})

import * as lambdafunctions from "../index"
import {eventQueueMock} from '../testHelpers'


describe('Unit tests for the Lambda function', () => {
    let event: SQSEvent;
    const SNSSpy = jest.spyOn(SNS, "publish")
  
    const handlerSpy = jest.spyOn(lambdafunctions, 'handler');
    const sendMessageSpy = jest.spyOn(lambdafunctions, 'sendMessage');

    it('When the Queue object is empty', () => {
        handlerSpy.mockImplementationOnce(() => "Queue is empty");
        lambdafunctions.handler(event);
        expect(lambdafunctions.handler).toReturnWith("Queue is empty")
    });

    it('sendMessage should be called with params', () => {
        let mockResponse = JSON.stringify({ 
            MessageID: "7ca9322e-71b7-59f7-b6b5-6e70d51fdc00", 
            Message: "Hello There", 
            PhoneNumber: "+447XX40XX5XX" 
        })
        sendMessageSpy.mockImplementationOnce(() => mockResponse);
        lambdafunctions.handler(eventQueueMock);

        expect(lambdafunctions.sendMessage).toBeCalled()
        expect(lambdafunctions.sendMessage).toReturnWith(mockResponse)
    });

    it('check for the SNS function call', () => {
        let mockResponse = JSON.stringify({ 
            MessageID: "7ca9322e-71b7-59f7-b6b5-6e70d51fdc00", 
            Message: "Hello There", 
            PhoneNumber: "+447XX40XX5XX" 
        })
      
        sendMessageSpy.mockImplementationOnce(() => { 
            SNS.publish({
                Message: "Hello There", 
                PhoneNumber: "+447XX40XX5XX" 
            })
            return new Promise(() => mockResponse);
        });
        lambdafunctions.handler(eventQueueMock);
        expect(SNSSpy).toHaveBeenCalledWith({
            Message: "Hello There", 
            PhoneNumber: "+447XX40XX5XX" 
        })
    });
})
    
