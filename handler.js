const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.create = async (event) => {
  const data = JSON.parse(event.body)
  const params = {
    TableName: 'Todos',
    Item: {
      id: data.id,
      text: data.text,
      checked: false,
    }
  }

  try {
    await dynamoDb.put(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldnt create the todo item.',
    }
  }
}

module.exports.list = async () => {
  const params = {
    TableName: 'Todos',
  }

  console.log("hogehoge")

  try {
    const data = await dynamoDb.scan(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch the todos.',
    }
  }
}

module.exports.update = async (event) => {
  const id = event.pathParameters.id
  const data = JSON.parse(event.body)

  const params = {
    TableName: 'Todos',
    Key: {
      id: id
    },
    UpdateExpression: 'SET text = :text, checked = :checked',
    ExpressionAttributeValues: {
      ':text': data.text,
      ':checked': data.checked,
    },
    ReturnValues: 'ALL_NEW',
  }

  try {
    const result = await dynamoDb.update(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the todo item.',
    }
  }
}

module.exports.delete = async (event) => {
  const id = event.pathParameters.id

  const params = {
    TableName: 'Todos',
    Key: {
      id: id,
    }
  }

  try {
    await dynamoDb.delete(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t delete the todo item.',
    }
  }
}
