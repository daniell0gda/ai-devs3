import {VectorService} from './VectorService.ts';
import {OpenAIService} from '../base/openAiServices.ts';
import fs from 'fs';
import {make_ai_response} from '../base/ai_reusables.ts';
import {makeTagsSystemPrompt, translateToEn} from './prompts.ts';
import { v4 as uuidv4 } from 'uuid';
import {post_response} from '../base/dev_ai.common.ts';

const openaiService = new OpenAIService();
const vectorService = new VectorService(openaiService);
const COLLECTION_NAME = 'S03E02';

interface File {
  text?: string;
  fName: string;
  tags:string[]
}

/*

 ## qdrant docker
 # w C:\docker
 # docker run -p 6333:6333 -v %cd%/qdrant_storage:/qdrant/storage qdrant/qdrant

 */


async function main(){

  let hasCollection = await vectorService.hasCollection(COLLECTION_NAME);
  if(!hasCollection){
    await update_vector_db();
  }


  let question = `W raporcie, z którego dnia znajduje się wzmianka o kradzieży prototypu broni?`;

  let english = await make_ai_response(
    openaiService,
    question,
    translateToEn
  );
  //
  // let questionTags = await getTagsForText(english);

  const similarMessages = await vectorService.performSearch(COLLECTION_NAME, english, 2, ['weapon', 'theft']);


  console.table(similarMessages.map(({score, payload}) => ({score, fName: payload?.fName})));

  let fName = similarMessages[0]?.payload?.fName as string;

  await post_response('wektory', formatDateString(fName));
}

function formatDateString(fileName:string) {
  // Extract the date part from the filename
  const datePart = fileName.split('.')[0]; // Removes the file extension
  return datePart.split('_').join('-'); // Returns the date in YYYY_MM_DD format
}

async function getTagsForText(english: string): Promise<string[]> {
  let tags = await make_ai_response(
    openaiService,
    english,
    makeTagsSystemPrompt
  );
  return tags.split(',').map(t=> t.trim().toLowerCase());
}

async function update_vector_db(){
  await vectorService.ensureCollection(COLLECTION_NAME);

  let files = await read_files();

  for (const file of files) {

    if(!file.fName){
      throw new Error('File doesnt have a name');
    }
    let english = await make_ai_response(
      openaiService,
      file.text!,
      translateToEn
    );
    let tags = await getTagsForText(english);

    let point = {
      id: uuidv4(),
      text: english,
      tags: tags,
      fName: file.fName
    } satisfies { id: string, text: string, tags: string[], fName:string }

    console.log(JSON.stringify(point, null, 2));

    await vectorService.addPoints(COLLECTION_NAME, [point]);
  }
}


async function read_files(): Promise<File[]> {
  const directoryPath = `${process.cwd()}/S03E02/pliki_z_fabryki/weapons_tests/do-not-share`;

  // Convert fs.readdir to Promise-based operation
  const files = await new Promise<string[]>((resolve,
    reject) => {
    fs.readdir(
      directoryPath,
      (err,
        files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(files);
      }
    );
  });

  let allTODO: File[] = [];
  for (const file of files) {

    if (!file.endsWith('.txt')) {
      continue;
    }

    let fullPath = `${directoryPath}/${file}`;

    let text = fs.readFileSync(fullPath)
      .toString();
    allTODO.push({
      text: text,
      fName: file,
      tags: []
    });
  }

  return allTODO;
}

main();
