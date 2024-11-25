import {OpenAIService} from '../base/openAiServices.ts';
import {make_ai_response} from '../base/ai_reusables.ts';
import {figureOutCityPrompt} from '../S03E04/prompts.ts';
import {post_response} from '../base/dev_ai.common.ts';

interface City {
  Name: string;
  People: Person[]
}

interface Person {
  Name: string;
  Cities: City[]
}

interface Clues {

  Person: Person[]
  Cities: City[]
}

const openaiService = new OpenAIService();

const clues: Clues = {
  Cities: [],
  Person: []
};

const cities: {[name:string]: true} = {};
const names: {[name:string]: boolean} = {};

async function main() {



  let result = await getClues('KRAKOW')

  console.log(JSON.stringify(result));


  await post_response('loop', 'ELBLAG'.toUpperCase());

  //

}

async function cityGetPeopleClues(cityName: string) {
  let peopleString = await centrala_api(
    cityName,
    'places'
  );

  if(!peopleString){
    return [];
  }
  if(peopleString.indexOf('RESTRICTED') != -1){
    return [];
  }
  let peopleArr = peopleString.split(' ');

  let people:Person[] = [];

  for (const personName of peopleArr) {
    if(!personName){
      continue;
    }

    let person:Person =  {
      Name: personName,
      Cities: []
    };

    people.push(person);

    let citiesMentioned = await centrala_api(
      personName,
      'people'
    );

    if(!citiesMentioned){
      continue;
    }

    if(citiesMentioned.includes('RESTRICTED')){
      person.Cities = [];
      continue;
    }

    let cities:City[] = citiesMentioned.split(' ').map(city=>  {
      return {
        Name: city,
        People: []
      } satisfies City
    });

    person.Cities = cities;

    // let result = await make_ai_response(openaiService, JSON.stringify(person), figureOutCityPrompt);
    //
    // if(result && result.split(' ').length == 1){
    //   throw new Error('Got the result: ' + result);
    // }
  }

  return people;
}

async function getClues(cityName: string, deepthCounter = 0) {

  deepthCounter+=1;

  let people = await cityGetPeopleClues(cityName);

  for (let person of people) {

    for (const city of person.Cities) {

      console.log('Checking city', city)

      let people =  await getClues(city.Name, deepthCounter);
      city.People = people;
    }

  }



  return people;

}


export async function centrala_api(query: unknown, target: 'people' | 'places') {
  try {

    if(cities[query as string]){
      return '';
    }

    if(names[query as string]){
      return '';
    }

    const url = `https://centrala.ag3nts.org/${target}`

    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "apikey": "ebb8d796-e6a2-44bc-8109-e71eddbdf06c",
          "query": query
        })
      }
    );

    console.log(
      'Response success ',
      response.status == 200
    );

    let responseData = await response.json();

    console.log(
      `query: ${query}, target: ${target}`
    );
    console.log(
      responseData
    );

    if(response.status != 200){
      return '';
    }

    if(responseData.message.startsWith('http')){
      return '';
    }

    if(target == 'places'){
      cities[`${query}`] = true
    }
    else{
      names[`${query}`] = true
    }

    return responseData.message as string;
  } catch (error) {
    console.error(
      "Error:",
      error
    );
    throw error;
  }
}


main();
