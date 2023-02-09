export const MSG_LIMIT =''
export const MSG_ATTRIBUTES = {
    'AWS.SNS.SMS.SenderID': {
        "DataType": 'String',
        "StringValue": 'Lambda-SNS' // This can be altered based on the Subject.
    },
    'AWS.SNS.SMS.SMSType' : {
        "DataType" : 'String',
        "StringValue": 'Transactional'
    },
};