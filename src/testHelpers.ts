export const eventQueueMock = {
    Records: [
    {
    messageId: "cfc4ea44-0ca9-42c7-a7b1-6f81791ca841",
    receiptHandle: "AQEB3xSnDIK4Xwgo7Lp1PofcI+f3P//pCnLcwTGLuMs9m62kjsALNfO3cS1jlgLVI87+kUlrhcWT5oKPUSHHfafEbWwgsS7DDOLBMia9wUrcMtwrefIL7I10MlyEV1tNadwGh4HLQLRx460MZaHW404JBanY25molbMLBZrMRmXB+Pv07Ct/DNxclS3pHS+ecSfFUkbxlP3sv7MNgShQ9CWZxsOMkjpkRkHIuLARyeEuXpixCPM7wUmXWgmW+eERmzlCAHfY4KbGamikU7/3cSWaZaIVWztBG2R/gyrRXFJ45vUXXGP4DP2JXOGVSUS6MEawIb/x2Vg/9GCRB2N9yH0OD0UL4PftgGxps+mwDtsdao8KyYbIMmTZkaNM0gswkftU7zSA5bT4W0YJVXVRHirwsw==",
    body: "Hello",
    attributes: {
        ApproximateReceiveCount: '2',
        SentTimestamp: `${new Date()}`,
        SenderId: 'SNS',
        ApproximateFirstReceiveTimestamp: `${new Date()}`
    },
    messageAttributes: {
        'MessageID': {
            stringValue: "7ca9322e-71b7-59f7-b6b5-6e70d51fdc00",
            dataType: "String"
            },
        "Message": {
            stringValue: "Hello There",
            dataType: "String"
            },
        "Number": {
            stringValue: "+447XX40XX5XX",
            dataType: "String"
        }
    },
    md5OfBody: "8b1a9953c4611296a827abf8c47804d7",
    eventSource: "aws:sqs",
    eventSourceARN: "arn:aws:sqs:us-east-1:305304914309:MessageQueue",
    awsRegion: "us-east-1"
    }
]}