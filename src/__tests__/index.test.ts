import { handler, sendMessage } from '../index';
import {SQSEvent } from "aws-lambda"
import * as AWS from 'aws-sdk';
import * as commons from "../commons"

jest.mock('aws-sdk', () => {
  return {
    SNS: jest.fn().mockImplementation(() => {
      return {
        publish: jest.fn().mockImplementation((params) => {
          if (params.Message === 'fail') {
            return {
              promise: jest.fn().mockRejectedValue(new Error('Publish failed'))
            };
          }
          return {
            promise: jest.fn().mockResolvedValue({ MessageId: '1234' })
          };
        })
      };
    })
  };
});

jest.spyOn(commons, 'isMessageBodyValid')
jest.spyOn(commons, 'isPhoneNumberValid')

describe('Handler', () => {
  it('returns "Queue is empty" when no records in event', async () => {
    const event = { Records: [] };
    const result = await handler(event);
    expect(result).toBe('Queue is empty');
  });

  it('returns "Validation failed" when validation fails', async () => {
    const event: SQSEvent = {
      Records: [
        {
          messageId: 'ed787f22-bb55-4e57-b1f1-85b5f2b2f7a8',
          receiptHandle: 'asdarfwefvgrew34534tgwr==',
          body: 'Hello from API',
          attributes: {
            ApproximateReceiveCount: '',
            SentTimestamp: '',
            SenderId: '',
            ApproximateFirstReceiveTimestamp: ''
          },
          messageAttributes: {
            'Phone': {
              stringValue: '443243234',
              dataType: 'string'
            }
          },
          md5OfBody: 'e89b3a1695699564a0eaa75e46c1a5af',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-1:305304914309:MessageQueue',
          awsRegion: 'us-east-1'
        }
      ]
    };
    const result = await handler(event);
    expect(commons.isMessageBodyValid).toBeCalled();
    expect(commons.isMessageBodyValid).toBeTruthy();
    expect(commons.isPhoneNumberValid).toBeCalled();
    expect(commons.isPhoneNumberValid).toBeTruthy();
    expect(result).toEqual({ message: 'Validation failed' });
  });
});

describe('sendMessage', () => {

  it('publishes the message and returns the message details', async () => {
    const message = 'Test message';
    const number = '1234567890';
    const result = await sendMessage(message, number);
    expect(result).toEqual({
      MessageID: '1234',
      Message: message,
      PhoneNumber: number
    });
  });

  it('returns an error if publishing the message fails', async () => {
    const message = 'fail';
    const number = '1234567890';
    const result = await sendMessage(message, number);
    expect(result).toEqual(Error('Publish failed'));
  });
});
