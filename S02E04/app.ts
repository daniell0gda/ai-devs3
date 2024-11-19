import fs from 'fs';
import {make_ai_response, transcribeAudio} from '../base/ai_reusables.ts';
import {OpenAIService} from '../base/openAiServices.ts';
import {
  get_img_text,
  check_if_text_contains_fact_prompt,
  check_if_text_contains_fact_prompt_debug
} from './prompts.ts';
import type OpenAI from 'openai';
import type {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
import {post_response} from '../base/dev_ai.common.ts';

interface File{
  text?:string;
  imgBase64?:string;
  fName:string;
}

const openaiService = new OpenAIService();

async function read_files():Promise<File[]> {
  const directoryPath = `${process.cwd()}/S02E04/pliki_z_fabryki`;

  // Convert fs.readdir to Promise-based operation
  const files = await new Promise<string[]>((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });

  // Process files
  let allTODO:File[] = [];
  for (const file of files) {
    let fullPath = `${directoryPath}/${file}`;

    if(file.endsWith('.txt') && !file.includes('mp3') && !file.includes('png')){
      let text = fs.readFileSync(fullPath).toString();
      allTODO.push({
        text: text,
        fName: file
      });

      console.log(file,text);
      continue;
    }


    if(file.endsWith('.png')){
      const txtPath = fullPath+'.txt';

      // Check if transcription file already exists
      if (fs.existsSync(txtPath)) {
        let text = fs.readFileSync(fullPath).toString();
        allTODO.push({
          text: text,
          fName: file
        });

        continue;
      }

      const base64Image = fs.readFileSync(fullPath, 'base64');

      let imgText = await getTextOnImage(base64Image);
      allTODO.push({
        text: imgText,
        fName: file
      });

      fs.writeFileSync(txtPath, imgText);
    }

    if(file.endsWith('mp3')){
      let transcribedAudio = await transcribeAudio(openaiService, fullPath);
      console.log(transcribedAudio);

      allTODO.push({
        text: transcribedAudio,
        fName: file.replace('.txt', '')
      })
    }

  }

  return allTODO;
}

async function getTextOnImage(
  imageBase64:string | OpenAI.Chat.Completions.ChatCompletionContentPartText[]) : Promise<string>{

  const userPrompt: ChatCompletionMessageParam = {
    role: "user",
    content: [{
      "type": "image_url",
      "image_url": {
        "url": `data:image/jpeg;base64,${imageBase64}`,
        "detail": "high"
      }
    }]
  };

  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: get_img_text
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
    return content;
  }

  throw new Error('Failed to get answer from AI');
}


async function process_files(){


  let files =  await read_files();

  let usefulPeople:string[] = []
  let usefulHardware:string[] = []
  for (const file of files) {
    if(file.text){
      console.log(file.text);
      let res = await make_ai_response(openaiService, file.text, check_if_text_contains_fact_prompt, 1);
      if(res.includes('people')){
        usefulPeople.push(file.fName)
      }
      if(res.includes('hardware')){
        usefulHardware.push(file.fName)
      }
    }

  }

  return {
    "people": usefulPeople,
    "hardware": usefulHardware,
  }

}


async function main(){
  // await make_ai_response(openaiService, 'Godzina 22:50. Sektor północno-zachodni spokojny, stan obszaru stabilny. Skanery temperatury i ruchu wskazują brak wykrycia. Jednostka w pełni operacyjna, powracam do dalszego patrolu.',check_if_text_contains_fact_prompt, 1);

  let result = await process_files();
  console.log(result);
  await post_response('kategorie', result)
}

main();
