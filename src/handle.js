const { buildSchema } = require('graphql')
const graphqlHttp = require('express-graphql')
const kgQuery = require('kg-query')
const request = require('request')

const schema = buildSchema(`
  type Query {
    allDatasets : [Dataset]
  }

  type Person {
    name: String
  }

  type Dataset {
    name: String
    description: String
    owner: [Person]
    uuid: String
  }

`)

const kgQueryUrl = kgQuery.url
const kgQueryMap = kgQuery.map
const URI = process.env.URI || 'https://kg-int.humanbrainproject.org/query'

const json = kgQueryUrl({
  root_schema: kgQueryMap.dataset.rootSchema,
  fields: kgQueryMap.dataset.getFields(1)
})

const root = {
  allDatasets: () => new Promise((resolve, reject) => {
    request(URI, {
      method: 'POST',
      json
    }, (err, resp, body) => {
      if(err) return reject(err)
      resolve(body.results)
    })
  })
}

exports.handler =  graphqlHttp({
  schema,
  rootValue: root,
  graphiql: true
})