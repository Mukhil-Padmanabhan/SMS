export interface SNSParams {
    Message: string;
    PhoneNumber?: string;
    TopicARN?: string;
    MessageAttributes?: any;
}

export interface MessageParams {
  phoneNumber: string;
  message: string;
}