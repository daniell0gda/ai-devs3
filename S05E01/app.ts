import {fetchPageContent} from '../base/common.ts';
import type {PhoneCall, PhoneJson, PhoneJsonSorted} from './model.ts';
import {make_ai_response} from '../base/ai_reusables.ts';
import {simpleAnswerPrompt} from '../S04E05/prompts.ts';
import {OpenAIService} from '../base/openAiServices.ts';
import {checkTheQuestions, listFactsPrompt, pickNextLinePrompt} from './prompts.ts';
const openaiService = new OpenAIService();
import fs from 'fs';
import path from 'path';


async function sortConversation(){
  let url = 'https://centrala.ag3nts.org/data/ebb8d796-e6a2-44bc-8109-e71eddbdf06c/phone.json';
  let pageContent = (await fetchPageContent(url, 'json')) as any as  PhoneJson

  
  let availableOptions:string[] = [...pageContent.reszta];
  
  
  let todo:PhoneCall[] = [pageContent.rozmowa1, pageContent.rozmowa2, pageContent.rozmowa3, pageContent.rozmowa4];

  do
  {
    for (const phoneCall of todo) {

      if(availableOptions.length == 0){
        break;
      }

      console.log(phoneCall.start)

      let content = phoneCall.start.split('-').filter(txt=> !!txt.trim());

      let userMsg = `
      <conversation>${content.map(cnt=> `- ${cnt}`).join('\n')}</conversation>
      <assumed_conversation_length>${phoneCall.length}</assumed_conversation_length>
      
     <text_options>
        ${availableOptions.map(cnt=> `- ${cnt}`).join('\n')}
      </text_options>
      `

      if(content.length == phoneCall.length){
        console.log('userMsg.exchange.content.length == phoneCall.length');
        continue;
      }

      let systemPrompt = `
       ${pickNextLinePrompt}
      `

      let simpleAnswer = await make_ai_response(
        openaiService,
        JSON.stringify(userMsg),
        systemPrompt,
        1,
        true,
        // 'gpt-4o'
      );

      let simpleAnswerObj = JSON.parse(simpleAnswer) as { _thinking: string, line: string, confidence_level:'low'|'medium'|'high' };

      if(simpleAnswerObj.line.includes('NO MATCH FOUND') || simpleAnswerObj.confidence_level != 'high'){
        console.log('indeterministic result, continue');
        continue;
      }

      phoneCall.start  += ` ${simpleAnswerObj.line}`;

      let indexInOptipns = availableOptions.indexOf(simpleAnswerObj.line);
      if(indexInOptipns >= 0){
        availableOptions.splice(indexInOptipns, 1);
      }

      phoneCall._content = phoneCall.start.split('-').filter(txt=> !!txt.trim());

      break;
    }
    break;
    console.log('availableOptions.length', availableOptions.length)

    const dataFilePath = path.join(
      __dirname,
      'sorted.json'
    );


    fs.writeFileSync(dataFilePath, JSON.stringify(todo));
  }
  while(availableOptions.length != 0)

  console.log('done sorting');
}
function convertObjectToArray(obj: { [key: string]: string }): { id: string, value: string }[] {
  return Object.keys(obj)
    .map(key => (
      {
        id: key,
        value: obj[key]
      }
    ));
}

function readPhoneFile(){
  const dataFilePath = path.join(
    __dirname,
    'phone_sorted2.json'
  );
  let file =  fs.readFileSync(dataFilePath).toString();

  return JSON.parse(file) as PhoneJsonSorted;
}

async function main(){
  let pageContent = await fetchPageContent(
    'https://centrala.ag3nts.org/data/ebb8d796-e6a2-44bc-8109-e71eddbdf06c/phone_questions.json',
    'json'
  );

  let questions =  convertObjectToArray(pageContent);

  let result: { [key: string]: string } = {};
  for (const question of questions) {
    console.log(question);
  }

  let names:string[] = [];

  let phoneFile = readPhoneFile();
  let phoneCalls:string[][] = [phoneFile.rozmowa1, phoneFile.rozmowa2, phoneFile.rozmowa3, phoneFile.rozmowa4];
  for (const phoneCall of phoneCalls) {

    // let simpleAnswer = await make_ai_response(
    //   openaiService,
    //   JSON.stringify(phoneCall),
    //   checkTheQuestions,
    //   1,
    //   false,
    //   // 'gpt-4o'
    // );
    //
    // names.push(simpleAnswer);


    let listFactsString = await make_ai_response(
      openaiService,
      JSON.stringify(phoneCall),
      listFactsPrompt,
      1,
      true,
      // 'gpt-4o'
    );
    let facts = JSON.parse(listFactsString) as {fact:string, url:string}[]

  }

  console.log(names);



}



main();
