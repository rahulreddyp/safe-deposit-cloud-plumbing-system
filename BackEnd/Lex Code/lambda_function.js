import json
import boto3
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # TODO implement
   
    if event['currentIntent']['name']=="getsafebox":
        lexresponse = {
        "sessionAttributes": event['sessionAttributes'],
        "dialogAction": {
        "type": "Close",
        "fulfillmentState": "",
        "message": {
        "contentType": "PlainText",
        "content": ""
        }
        }
        };
        table = dynamodb.Table('userdetails')
        response = table.scan()
        docs = response['Items']
        for fields in docs:
            users=fields['userId']
            print(users)
            if event['currentIntent']['slots']['userId'] in users:
                print('enter')
                lexresponse['dialogAction']['fulfillmentState']='Fulfilled'
                lexresponse['dialogAction']['message']['content']= f"Your Safety Deposit Box number is {fields['boxId']}"
        print(lexresponse)
        return lexresponse