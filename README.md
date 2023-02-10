
# SMS
Sending SMS from API->SNS->SQS->Lambda

## Run the application

Step 1: Install the required packages by running the following command

    npm i

Step 2: Build the Typescript files to generate JS files

    npm run build

Step 3: The build JS file is now zipped 

    npm run zipfile:windows
    
NOTE: This zipping mechanism just works for the windows. In order to use the same in Linux / MacOS 

    zip -r <file_name> <location>

Step 4: Take the zipped file from the local and uploaded it to the lambda function in AWS.

Once uploaded, we can run the code inside the Lambda function which would generate the SMS via SNS.

**NOTE** :

 In order to remove the zip file the following command can be run

    npm run remove-zip


## Approach

1. The first step was to explore the working of AWS SNS and AWS SQS and analyze their use cases.
2. On having fair bit of an idea about them, I started with the creation of a SNS topic called Messages.
3. Once the SNS topic was created, I then created an API Gateway resource with a POST method in it. 
4. Set up the configuration of the API Gateway to point to the SNS service by linking the TopicArn.
![image](https://user-images.githubusercontent.com/23432686/218045133-50dcf1a1-6d0e-4913-9ae7-346cfe983b2d.png)
5. Once API Gateway and SNS were linked, a SQS queue was created.
6. This SQS queue was subscribed to the AWS SNS to poll for messages.
7. Published messages manually from SNS and received it in the SQS to check the connection between the both.
8. Once SQS was linked, A Lambda function was created that needed to be triggered when an item is available in the SQS queue.
9. This Lambda function listened to the SQS queue for the incoming Records.
10. The code is then zipped and exported from here and it is imported in the Lambda function. This code would facilitate in sending a SMS to the number mentioned in the request body if the API .
11. Once each component were individually tested, a full test was performed from API Gateway -> SNS -> SQS -> Lambda -> SMS.
12. On successful testing, the API was deployed to a dev env and the published API was tested in Postman for the same. The current deployed verison

    [https://48acjlxkmh.execute-api.us-east-1.amazonaws.com/Dev](https://48acjlxkmh.execute-api.us-east-1.amazonaws.com/Dev)

**NOTE** :
An IAM role was created to facilitate the Permissions for all the steps.  
Policies with access to SQS, SNS and lambda were attached to the role.

## Test Cases
Test Cases for SMS services  are the following:

[SMS_Test_Cases.xlsx](https://github.com/Mukhil-Padmanabhan/SMS/files/10701982/SMS_Test_Cases.xlsx)

NOTE : This includes potential features too and not just straight forward scenario.

Basic Unit tests were written and Code Coverage of above 75% was achieved.

Coverage can be checked by running:

    npm run coverage
