const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  apiVersion: '2012-08-10'
});

// Table name with environment prefix
const TABLE_NAME = `${process.env.ENVIRONMENT}-items`;

// Item schema
const ItemSchema = {
  TableName: TABLE_NAME,
  KeySchema: [
    { AttributeName: 'storeId', KeyType: 'HASH' },  // Partition key
    { AttributeName: 'itemId', KeyType: 'RANGE' }   // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'storeId', AttributeType: 'S' },
    { AttributeName: 'itemId', AttributeType: 'S' },
    { AttributeName: 'status', AttributeType: 'S' },
    { AttributeName: 'quadrant', AttributeType: 'S' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'StatusIndex',
      KeySchema: [
        { AttributeName: 'status', KeyType: 'HASH' },
        { AttributeName: 'storeId', KeyType: 'RANGE' }
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    },
    {
      IndexName: 'QuadrantIndex',
      KeySchema: [
        { AttributeName: 'quadrant', KeyType: 'HASH' },
        { AttributeName: 'storeId', KeyType: 'RANGE' }
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

// IAM Policy for store-specific access
const StoreAccessPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
        'dynamodb:Query'
      ],
      Resource: `arn:aws:dynamodb:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:table/${TABLE_NAME}`,
      Condition: {
        'ForAllValues:StringEquals': {
          'dynamodb:LeadingKeys': ['${aws:PrincipalTag/storeId}']
        }
      }
    }
  ]
};

// Helper functions for item operations
const itemOperations = {
  // Create a new item
  async createItem(storeId, itemData) {
    const itemId = uuidv4();
    const params = {
      TableName: TABLE_NAME,
      Item: {
        storeId,
        itemId,
        ...itemData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    try {
      await dynamoDB.put(params).promise();
      return { ...params.Item };
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  // Get items for a specific store
  async getStoreItems(storeId) {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'storeId = :storeId',
      ExpressionAttributeValues: {
        ':storeId': storeId
      }
    };

    try {
      const result = await dynamoDB.query(params).promise();
      return result.Items;
    } catch (error) {
      console.error('Error fetching store items:', error);
      throw error;
    }
  },

  // Update an item
  async updateItem(storeId, itemId, updates) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    Object.entries(updates).forEach(([key, value]) => {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params = {
      TableName: TABLE_NAME,
      Key: { storeId, itemId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    try {
      const result = await dynamoDB.update(params).promise();
      return result.Attributes;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Delete an item
  async deleteItem(storeId, itemId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { storeId, itemId }
    };

    try {
      await dynamoDB.delete(params).promise();
      return { success: true };
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
};

module.exports = {
  dynamoDB,
  TABLE_NAME,
  ItemSchema,
  StoreAccessPolicy,
  ...itemOperations
}; 