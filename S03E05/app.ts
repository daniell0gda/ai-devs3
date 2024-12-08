import {OpenAIService} from '../base/openAiServices.ts';
import {post_response} from '../base/dev_ai.common.ts';
import type {PathSegment} from 'neo4j-driver';

const axios = require('axios');
var host = 'localhost';
var port = 7687;
var httpUrlForTransaction = 'http://' + host + ':' + port

const openaiService = new OpenAIService();
const neo4j = require('neo4j-driver');

// Create a driver instance
const driver = neo4j.driver(
  'neo4j://localhost:7687',
  neo4j.auth.basic(
    'neo4j',
    '4vQz#KKx13cvo6$'
  )
);
const session = driver.session();

interface User {
  id: string,
  username: string,
  access_level: string,
  is_active: string,
  lastlog: string,
}

interface Connection {
  user1_id: string;
  user2_id: string;
}

async function createUsersAndConnections(): Promise<void> {
  let users = await centrala_api<User[]>(`select * from users`);

  for (const user of users) {
    await createNeo4AddUser(user);
  }

  let connections = await centrala_api<Connection[]>(`select * from connections`);
  for (const user of connections) {
    await createKnowsRelationship(
      user.user1_id,
      user.user2_id
    );
  }
}

async function main() {

  let users = await buildRelationshipPath(
    'Rafał',
    'Barbara'
  );

  if (!users) {
    console.warn('returned nothing');
    return;
  }

  console.log(users)

  await session.close();
  await driver.close();


  await post_response(
    'connections',
    users.join(', ')
  );
}

async function buildRelationshipPath(forUser: string,
  toUser: string) {
  try {
    const result = await session.run(
      ` 
      MATCH p = shortestPath((d:User {username: '${forUser}'})-[:KNOWS*]-(a:User {username: '${toUser}'}))
      RETURN p
      `
    );

    console.log(result.records[0].get('p').segments[0].start.properties)

    let path = result.records[0].get('p')
      .segments
      .map((segment: PathSegment) => segment.start.properties.username) as string[];

    return [...path, 'Barbara'];
  } catch (error) {
    console.error(
      'Error creating node:',
      error
    );
  } finally {

  }
}


/*

 MATCH (u:User)-[:KNOWS]->(c:User)
 WHERE c.Name IN ['France', 'Spain']
 WITH u, COUNT(DISTINCT c) AS countryCount
 WHERE countryCount = 2
 RETURN u

 */

async function createKnowsRelationship(u1: string,
  u2: string) {

  try {
    const result = await session.run(
      `MATCH (a:User {id: "${u1}"}), (b:User {id: "${u2}"}) CREATE (a)-[:KNOWS]->(b);`
    );
    console.log(result.records[0]);
  } catch (error) {
    console.error(
      'Error creating node:',
      error
    );
  } finally {

  }
}

async function createNeo4AddUser(user: User) {

  try {
    const result = await session.run(
      `CREATE (uu:User {id: "${user.id}", username: "${user.username}", access_level: "${user.username}", is_active: "${user.is_active}", lastlog: "${user.lastlog}"}) RETURN uu;`
    );
    console.log(result.records[0].get('uu'));
  } catch (error) {
    console.error(
      'Error creating node:',
      error
    );
  } finally {

  }
}

export async function centrala_api<T>(query: unknown) {
  try {

    const response = await fetch(
      "https://centrala.ag3nts.org/apidb",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "task": 'database',
          "apikey": "ebb8d796-e6a2-44bc-8109-e71eddbdf06c",
          "query": query
        })
      }
    );

    console.log(
      'Response success ',
      response.status == 200
    );

    let responseData = (
      await response.json()
    ).reply as T;

    console.log(
      "response text:",
      responseData
    );

    return responseData;
  } catch (error) {
    console.error(
      "Error:",
      error
    );
    throw error;
  }
}


main();
