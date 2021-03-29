import { AttributeValue, DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { BILLBOARD_ID, BILLBOARD_TABLE_NAME, BILLBOARD_WIDTH } from "../components/consts";

export type DDBAttributeSource = string | number | null;

const ddbAttribute = (value: DDBAttributeSource): AttributeValue => {
  switch (typeof value) {
    case 'number':
        return {N: value.toString()};
    case 'string':
      return {S: value};
    case 'object':
      if (!value) {
        return {NULL: true};
      }
    default:
      throw new Error("unsupported type");
  }
};

export const queryAllItems = async () => {
  const command = new QueryCommand({
    TableName : BILLBOARD_TABLE_NAME,
    KeyConditionExpression: 'BilboardID = :bilboardID',
    ExpressionAttributeValues: {
      ':bilboardID': {S: BILLBOARD_ID},
    }
  });
  return runCommand(command) as unknown;
};

export const putItem = async (item: {[key: string]: DDBAttributeSource;}) => {
  const command = new PutItemCommand({
    TableName : BILLBOARD_TABLE_NAME,
    Item: Object.keys(item).reduce((ddbItem, attr) => ({
      ...ddbItem,
      [attr]: ddbAttribute(item[attr]),
    }), {}),
  });
  return runCommand(command);
};

const runCommand = async (command: any) => {
  
  const credentials = process.env.AWS_ACCESS_KEY_ID_TILOS && process.env.AWS_SECRET_ACCESS_KEY_TILOS && {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_TILOS,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TILOS,
  };
  
  console.log('Command', { 
    region: 'us-east-2',
    ...{...credentials},
  }, command)

  const dbclient = new DynamoDBClient({ 
    region: 'us-east-2',
    ...{...credentials},
  });

  try {
    const data = await dbclient.send(command);
    // console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};