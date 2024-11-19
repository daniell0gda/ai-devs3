import type OpenAI from 'openai';
import { OpenAIService } from '../base/openAiServices';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";


import jsonData from './input_data.json';
import { systemMessage } from './prompts';
import { post_response } from '../base/dev_ai.common';
import { isArray } from 'node:util';

const openaiService = new OpenAIService();



async function main(){

    jsonData.apikey = "ebb8d796-e6a2-44bc-8109-e71eddbdf06c";
    let testData = jsonData['test-data'];

    let forAi = [];
    for (const element of testData) {
        const answer = eval(element.question);
        if(answer != element.answer){
            element.answer = answer;
        }

        if(element.test){
            forAi.push(element);
            continue;
        }
    }

    console.log('for ai', forAi)

   let ai_response = (await make_ai_response(forAi)) as {
        "question": string,
        "answer": number,
        "test": {
            "q": string,
            "a": string
        }
    }[];

    if(!isArray(ai_response)){
        console.log(ai_response);
        throw new Error('Ai response is not an array')
    }

   for (const ai_el of ai_response) {
    let answered = testData.find(d=> d.question == ai_el.question);

    if(!answered?.test || !answered?.question || !answered?.answer){
        console.error(ai_el);
        throw new Error('Missing fields or wrong answer')
    }

    answered.test.a = ai_el.test.a;
   }

   post_response('JSON', jsonData)
}


async function make_ai_response(data:unknown[]) : Promise<unknown[]>{

    const userPrompt: ChatCompletionMessageParam = {
        role: "user",
        content: JSON.stringify(data)
      };
    
    const systemPrompt: ChatCompletionMessageParam = {
        role: "system",
        content: systemMessage
      };

    const allMessages: ChatCompletionMessageParam[] = [
        systemPrompt,
        userPrompt
      ];
    const answer = (await openaiService.completion(allMessages, "gpt-4o", false, false)) as OpenAI.Chat.Completions.ChatCompletion;
    
    // console.log(answer)

    if (answer.choices[0] && answer.choices[0].message.content) {       
        // answer.choices[0].message

        let content = answer.choices[0].message.content;
        if(typeof content == 'string'){
            console.log('this is string');
        }
        
        console.log('message content',JSON.parse(content))
        return JSON.parse(content) as any as unknown[];
    } 

    throw new Error('Failed to get answer from AI');
}


main();
