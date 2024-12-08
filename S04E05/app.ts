import {downloadFileGetBuffer, fetchPageContent, read_files} from '../base/common.ts';
import {OpenAIService} from '../base/openAiServices.ts';
import {VectorService} from '../S03E02/VectorService.ts';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';
import {make_ai_response} from '../base/ai_reusables.ts';
import {analyze, checkIfNoteAnyGood, rankOutput, simpleAnswerPrompt} from './prompts.ts';
import {post_response} from '../base/dev_ai.common.ts';
import {makeTagsSystemPrompt} from '../S03E02/prompts.ts';

const pdfParse = require('pdf-parse');

const path = require('path');
const {PDFDocument} = require('pdf-lib');

const openaiService = new OpenAIService();
const vectorService = new VectorService(openaiService);
const COLLECTION_NAME = 'S04E05';

async function main() {

  const dataFilePath = path.join(
    __dirname,
    'notatnik-rafala.pdf'
  );
  console.log(
    'Absolute path to data.txt:',
    dataFilePath
  );

  let hasCollection = await vectorService.hasCollection(COLLECTION_NAME);
  if (!hasCollection) {
    await pdf2Qdrant();
    await images2Text();

  }

  let questions = await extractQuestions();

  let result: { [key: string]: string } = {};
  for (const question of questions) {
    let documents = await vectorService.performSearch(
      COLLECTION_NAME,
      question.value,
      5
    );

    let texts = documents.map(r => r.payload?.text) as string[];

    console.log(texts)

    let notesText = texts.map((text,
      index) => {
      return `<note-${index}>${text}</note-${index}> \n`;
    });

    // let userRankPrompt = `
    // ${question.value}
    // ${notesText}
    // `
    //
    // let rankedString = await make_ai_response(
    //   openaiService,
    //   userRankPrompt,
    //   rankOutput,
    //   1,
    //   true
    // );
    //
    // let sortedResponse = JSON.parse(rankedString).result as { _thinking: string, result: string }[];
    //
    // // let sortedResponse = JSON.parse(rankedString) as {_thinking:string, result:string}[];
    // sortedResponse.sort((a,
    //   b) => {
    //   return a.result.split(":")[1] < b.result.split(":")[1]
    // })
    //
    // console.log("Sorted");
    // console.log(JSON.stringify(sortedResponse));
    //
    // let index = sortedResponse[0].result.split(':')[0];
    //
    // let importantNote = texts[Number.parseInt(index)];
    //
    //
    // break;

    let systemPrompt = `
    ${analyze}
    
    ${
      notesText
    }
    `

    let parsed = await make_ai_response(
      openaiService,
      question.value,
      systemPrompt,
      1,
      true,
      'gpt-4o'
    );

    let parsedObj = JSON.parse(parsed) as { _thinking: string, answer: string };

    let simpleAnswer = await make_ai_response(
      openaiService,
      `
      question: ${question.value}
      answer: ${parsedObj.answer}
      `,
      simpleAnswerPrompt,
      1,
      false
    );

    result[question.id] = simpleAnswer;

    break;
  }

  console.log(result);
  await post_response(
    'notes',
    result
  );
}

async function getTagsForText(english: string): Promise<string[]> {
  let tags = await make_ai_response(
    openaiService,
    english,
    makeTagsSystemPrompt
  );
  return tags.split(',')
    .map(t => t.trim()
      .toLowerCase());
}

async function images2Text() {
  const dataFilePath = path.join(
    __dirname,
    'output'
  );

  let images = await read_files(
    dataFilePath,
    '.png'
  );

  let texts: string[] = [];
  for (const {fullPath} of images) {

    let imgBase64 = fs.readFileSync(
      fullPath,
      'base64'
    );

    let userMsg = `What text can you see on the image?`
    let system = `
    Provided image contains 3 notes with hand written text in polish.
    What is on those notes?
    
    Important:
    Simply return just notes text seperated with new line "\n"
   
    `

    let img = await openaiService.askAboutImage(
      system,
      imgBase64,
      userMsg
    );

    let notesArray = img.split("\n");

    if (!Array.isArray(notesArray)) {
      throw new Error('Ai returned text with wrong format')
    }

    texts.push(...notesArray);
  }

  if (texts.length == 0) {
    return;
  }

  await addTextToVectrorDb(texts);


}

async function pdf2Qdrant() {
  const dataFilePath = path.join(
    __dirname,
    'notatnik-rafala.pdf'
  );


  let text: string | undefined = '';
  if (fs.existsSync(dataFilePath)) {
    console.log(
      'File exists at ',
      dataFilePath
    );

    text = await new Promise((resolve,
      reject) => {
      fs.readFile(
        dataFilePath,
        (err,
          data) => {
          if (err) {
            console.error(
              'Reject',
              err
            );
            reject(err);
            return;
          }

          pdfParse(Buffer.from(data))
            .then((pdtext) => {
              resolve(pdtext.text);
            })
        }
      );
    });
  } else {
    let buffer = await downloadFileGetBuffer('https://centrala.ag3nts.org/dane/notatnik-rafala.pdf');

    if (!buffer) {
      throw new Error('File not downloaded');
    }
    text = await pdfParse(buffer).text;
  }

  if (!text) {
    throw new Error(`${dataFilePath} failed to load`);
  }

  let pages = text.split('\n\n');

  await addTextToVectrorDb(pages);

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

async function extractQuestions() {

  let pageContent = await fetchPageContent(
    'https://centrala.ag3nts.org/data/ebb8d796-e6a2-44bc-8109-e71eddbdf06c/notes.json',
    'text'
  );


  return convertObjectToArray(JSON.parse(pageContent));

}

async function addTextToVectrorDb(text: string[]): Promise<void> {
  await vectorService.ensureCollection(COLLECTION_NAME)

  let points = [];
  for (const page of text) {

    // console.log(page);
    // let aiReasoning = await make_ai_response(
    //   openaiService,
    //   page,
    //   makeSenseOutOfNotesPrompt,
    //   1,
    //   true
    // );
    //
    // let aiReasoningObj = JSON.parse(aiReasoning) as {_thinking:string, answer:string};

    let anythingUsefull = await make_ai_response(
      openaiService,
      page,
      checkIfNoteAnyGood,
      1,
      false
    );

    if (anythingUsefull == 'no') {
      console.log(
        'no::::',
        page
      )
      continue;
    }

    let point = {
      id: uuidv4(),
      text: page,
      tags: [`page_${points.length + 1}`],
      fName: ''
    } satisfies { id: string, text: string, tags: string[], fName: string }

    points.push(point);
  }

  await vectorService.addPoints(
    COLLECTION_NAME,
    points
  );
}


main();
