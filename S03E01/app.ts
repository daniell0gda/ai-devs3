import fs from 'fs';
import {make_ai_response} from '../base/ai_reusables.ts';
import {OpenAIService} from '../base/openAiServices.ts';
import {makeTagsSystemPrompt} from './prompts.ts';
import {post_response} from '../base/dev_ai.common.ts';

interface File {
  text?: string;
  fName: string;
  wasMp3?: boolean;
  wasPng?: boolean;
}

const openaiService = new OpenAIService();


async function read_facts(): Promise<File[]> {
  const directoryPath = `${process.cwd()}/S03E01/pliki_z_fabryki/facts`;

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
      fName: file
    });
  }

  return allTODO;
}

async function read_files(): Promise<File[]> {
  const directoryPath = `${process.cwd()}/S03E01/pliki_z_fabryki`;

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
      wasMp3: file.includes('mp3'),
      wasPng: file.includes('png')
    });
  }

  return allTODO;
}

async function main() {

  let files = await read_files();
  let contextOtherFiles = files.filter(file => file.wasMp3 || file.wasPng);
  let sectorFiles = files.filter(file => !file.wasMp3 && !file.wasPng);
  let facts = await read_facts()


  let result: { [key: string]: string } = {};
  for (const sectorFile of sectorFiles) {

    if(!sectorFile.fName.includes('2024-11-12_report-01-sektor_A1.txt'))
    {
      continue;
    }

    let factsText = facts.filter(text=> !text.text?.includes('entry deleted')).map((file, index) => {
      return ` 
        <fact-${index+1}>
        ${file.text}
        </fact-${index+1}>
        `
    }).join('\n');

    let system = `
    ${makeTagsSystemPrompt}
     <fact-0> 
    Sektor: ${sectorFile.fName}
    </fact-0>
    ${factsText}
    `
    console.log(system);

    if (!sectorFile.text) {
      throw new Error(`File ${sectorFile.fName} is without a text`);
    }

    let tags = await make_ai_response(
      openaiService,
      sectorFile.text,
      system
    );

    result[sectorFile.fName] = tags;
  }

  console.table(result);

  await post_response('dokumenty', result)
}


main();
