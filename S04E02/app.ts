import fs from 'fs';
import {OpenAIService} from '../base/openAiServices.ts';
import {make_ai_response} from '../base/ai_reusables.ts';
import type {MyFile} from '../base/common.ts';
import {read_files} from '../base/common.ts';
import {post_response} from '../base/dev_ai.common.ts';



export interface JsonL {
  messages: [
    {
      role: "system",
      content: string
    },
    {
      role: "user",
      content: string
    },
    {
      role: "assistant",
      content: string
    }
  ]
}
const openaiService = new OpenAIService();

async function main(){

  let files = await read_files(`${process.cwd()}/S04E02/lab_data`);
  let testFile = files.find((f)=>f.name == 'verify.txt');
  if(!testFile){
    throw new Error('Verify not found');
  }

  let system = ``;
  let model = `ft:gpt-4o-mini-2024-07-18:personal::AXvsqsod`;
  let response:string[] = [];

  for (const verify of testFile.content.split('\n')) {
    let data = verify.split('=');

    let user = `
    Klasyfikuj dane liczbowe:
    ${data[1]}
    `

    let check = await make_ai_response(openaiService, user, system, 1, false, model);
    if(check == 'poprawne'){
      response.push(data[0]);
    }
  }

  console.log(response);
  //[ "01", "02", "03", '04', "10" ]
  await post_response('research', response);


}

async function train(){



  await openaiService.train('file-2RyGSZnLBUmDfb1FnBeWLD');

}


function createJsonL(file: MyFile, result:string): string {

  let jsonL: unknown[] = [];

  file.content.split('\n')
    .forEach(line => {
      jsonL.push(JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Klasyfikuj dane liczbowe. Czy są są wynikiem porawnych czy fałszywych obliczeń?'
          },
          {
            role: 'user',
            content: line
          },
          {
            role: 'assistant',
            content: result
          }
        ]
      } as JsonL));
    });

  return jsonL.join('\n');
}

export async function txt2Jsonl(){

  let files = await read_files(`${process.cwd()}/S04E02/lab_data`);

  let correct = '';
  let inCorrect=  '';

  for (const file of files) {
    if(file.name == 'correct.txt'){
      correct = createJsonL(
        file,
        'poprawne'
      );

    }
    else if(file.name == 'incorrect.txt'){
      inCorrect = createJsonL(
        file,
        'niepoprawne'
      );
    }
  }

  fs.writeFileSync(`${process.cwd()}/S04E02/devai_s04e02.jsonl`, correct + '\n' + inCorrect);
}

main();
