import {parse} from 'node-html-parser';
import {downloadMP3, fetchPageContent, getImageAsBase64} from '../base/common.ts';
import fs from 'fs';
import {make_ai_response} from '../base/ai_reusables.ts';
import {OpenAIService} from '../base/openAiServices.ts';
import {answerQuestion, findOutImagesAndRecordings} from './prompts.ts';
import type OpenAI from 'openai';
import type {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
import {get_img_text} from '../S02E04/prompts.ts';
import {post_response} from '../base/dev_ai.common.ts';

interface PageContent {
  headerText: string;
  content: string;
  mp3: string[];
  images: string[];
  mp3Transcribed: string[];
}

const openaiService = new OpenAIService();
const parsedHtmlPath = `${process.cwd()}/S02E05/html-parsed.json`;
const parsedHtmlPathWithImages = `${process.cwd()}/S02E05/html-parsed-with-images.json`;
const parsedHtmlWithMp3 = `${process.cwd()}/S02E05/html-parsed-with-mp3.json`;
const questionAnswered = `${process.cwd()}/S02E05/questionAnswered.json`;

async function parseHtml() {


  if (fs.existsSync(parsedHtmlPath)) {
    return JSON.parse(fs.readFileSync(
      parsedHtmlPath,
      'utf-8'
    )) as PageContent[];
  }

  let pageContent = await fetchPageContent(
    'https://centrala.ag3nts.org/dane/arxiv-draft.html',
    'text'
  );


  const root = parse(pageContent);

  const nodes = root.querySelectorAll('h2');


  let content: PageContent[] = [];

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    let part = {
      headerText: node.text,
      content: '',
      mp3: [],
      images: [],
      mp3Transcribed: [],
    } satisfies PageContent;

    let indexStart = pageContent.indexOf(node.text) + node.outerHTML.length;

    if (i + 1 < nodes.length) {
      let nextNode = nodes[i + 1];
      let indexEnd = pageContent.indexOf(nextNode.text);

      part.content = pageContent.slice(
        indexStart,
        indexEnd
      );
    } else {
      part.content = pageContent.slice(
        indexStart,
        pageContent.length - 1
      );
    }

    content.push(part);
  }


  fs.writeFileSync(
    parsedHtmlPath,
    JSON.stringify(content)
  );

  return content;

}


async function extractLinks() {

  if (fs.existsSync(parsedHtmlPathWithImages)) {
    return JSON.parse(fs.readFileSync(
      parsedHtmlPathWithImages,
      'utf-8'
    )) as PageContent[];
  }

  let content = await parseHtml();

  for (const pageContent of content) {
    let parsed = await make_ai_response(
      openaiService,
      pageContent.content,
      findOutImagesAndRecordings,
      1,
      true
    );

    let parsedObj = JSON.parse(parsed) as { context: string, mp3: string[], img: string[] };

    pageContent.mp3 = parsedObj.mp3;
    pageContent.images = parsedObj.img;

    console.log(parsed);
  }

  fs.writeFileSync(
    parsedHtmlPathWithImages,
    JSON.stringify(content)
  );

  return content;
}

async function transcribeMp3s() {
  if (fs.existsSync(parsedHtmlWithMp3)) {
    return JSON.parse(fs.readFileSync(
      parsedHtmlWithMp3,
      'utf-8'
    )) as PageContent[];
  }


  let pageContent = await extractLinks();

  for (const pageContent1 of pageContent) {
    if (pageContent1.mp3 && pageContent1.mp3.length > 0) {

      for (const mp3 of pageContent1.mp3) {
        let downloadUrl = `https://centrala.ag3nts.org/dane/${mp3}`
        let buffer = await downloadMP3(downloadUrl);
        if (buffer) {
          const transcription = await openaiService.transcribeAudio(buffer);

          if (!pageContent1.mp3Transcribed) {
            pageContent1.mp3Transcribed = [];
          }
          pageContent1.mp3Transcribed.push(transcription);
        }
      }
    }
  }

  fs.writeFileSync(
    parsedHtmlWithMp3,
    JSON.stringify(pageContent)
  );


  return pageContent;
}

async function tryAnswerFromImage(
  imageBase64: string | OpenAI.Chat.Completions.ChatCompletionContentPartText[]): Promise<string> {

  const userPrompt: ChatCompletionMessageParam = {
    role: "user",
    content: [
      {
        "type": "image_url",
        "image_url": {
          "url": `data:image/jpeg;base64,${imageBase64}`,
          "detail": "high"
        }
      }
    ]
  };

  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: get_img_text
  };

  const allMessages: ChatCompletionMessageParam[] = [
    systemPrompt,
    userPrompt
  ];
  const answer = (
    await openaiService.completion(
      allMessages,
      "gpt-4o",
      false,
      false
    )
  ) as OpenAI.Chat.Completions.ChatCompletion;

  // console.log(answer)

  if (answer.choices[0] && answer.choices[0].message.content) {
    // answer.choices[0].message

    let content = answer.choices[0].message.content;
    return content;
  }

  throw new Error('Failed to get answer from AI');
}

async function answerQuestions() {

  let pageContents = await transcribeMp3s();

  let questions = await extractQuestions();

  let answers: { [key: string]: string } = {}
  if (fs.existsSync(parsedHtmlWithMp3)) {
    let content = fs.readFileSync(
      questionAnswered,
      'utf-8'
    );

    answers = JSON.parse(content) as { [key: string]: string };
  }

  console.log(
    'Questions',
    questions
  )

  for (const question of questions) {

    if(!question || question.trim().length == 0){
      continue;
    }
    if (answers[question]) {
      continue;
    }
    answers[question] = '';

    console.log(
      'pageContents',
      pageContents.length
    );
    let counter = 0;
    for (const parsedElement of pageContents) {

      console.log('question check', counter);
      counter++;

      // if(parsedElement.content.includes('Owoc przed transportem w czasie'))
      // {
      //   console.log('should find it here')
      // }

      let query = `
      ${answerQuestion}
      ${parsedElement.headerText}
      ${parsedElement.content}
      Recording content:
      ${parsedElement.mp3Transcribed && parsedElement.mp3Transcribed.length > 0 ? parsedElement.mp3Transcribed.join('\n') : 'None'}
      `

      let base64: Promise<string>[] = [];
      if (parsedElement.images && parsedElement.images.length > 0) {
        base64 = parsedElement.images.map(img => getImgBase64(img));
      }

      let parsed = await getTextOnImage(
        query,
        question,
        await Promise.all(base64)
      );


      if (parsed.toLowerCase()
        .includes(`nie wiem`)) {
        console.log(
          question,
          parsed
        )
        continue;
      }

      console.log(
        question,
        parsed
      )
      answers[question] = parsed;
      break;
    }


    fs.writeFileSync(
      questionAnswered,
      JSON.stringify(answers)
    );

    console.table(answers);
  }
}



async function answer(){

  await answerQuestions();

  let answers: { [key: string]: string } = {}
  if (fs.existsSync(parsedHtmlWithMp3)) {
    answers = JSON.parse(fs.readFileSync(
      questionAnswered,
      'utf-8'
    )) as { [key: string]: string };
  }

  let pageContent = await fetchPageContent(
    'https://centrala.ag3nts.org/data/ebb8d796-e6a2-44bc-8109-e71eddbdf06c/arxiv.txt',
    'text'
  );

  let withoutAnswer = 0;
  let answersWithCorrectID:{ [key:string] :string} = {};
  for (const questionLine of pageContent.split('\n')) {
    let strings = questionLine.split('=');
    let key = strings[0];
    let questions = strings[1];

    if(key.trim().length == 0){
      continue;
    }

    if(!(questions in answers)){
      console.warn('Not in ansswer:', questions)
      withoutAnswer++;
      continue;
    }
    answersWithCorrectID[key] = answers[questions];
  }

  if(withoutAnswer > 0){
    throw new Error('Run answerQuestions again')
  }

  console.table(answersWithCorrectID)

  await post_response('arxiv', answersWithCorrectID)
}

async function getTextOnImage(
  systemPromptContent: string,
  question: string,
  imageBase64: string[] = []): Promise<string> {

  const userPrompt: ChatCompletionMessageParam = {
    role: "user",
    content: [
      {
        type: 'text',
        text: question
      },
      ...imageBase64.map(img => {
          return {
            "type": "image_url",
            "image_url": {
              "url": `data:image/jpeg;base64,${img}`,
              "detail": "high"
            }
          }
        }
      ) as any
    ]
  };

  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: systemPromptContent
  };

  const allMessages: ChatCompletionMessageParam[] = [
    systemPrompt,
    userPrompt
  ];
  const answer = (
    await openaiService.completion(
      allMessages,
      "gpt-4o",
      false,
      false
    )
  ) as OpenAI.Chat.Completions.ChatCompletion;

  // console.log(answer)

  if (answer.choices[0] && answer.choices[0].message.content) {
    // answer.choices[0].message

    let content = answer.choices[0].message.content;
    return content;
  }

  throw new Error('Failed to get answer from AI');
}


function getImgBase64(urlPartial: string): Promise<string> {
  let downloadUrl = `https://centrala.ag3nts.org/dane/${urlPartial}`
  return getImageAsBase64(downloadUrl);

}

async function extractQuestions() {

  let pageContent = await fetchPageContent(
    'https://centrala.ag3nts.org/data/ebb8d796-e6a2-44bc-8109-e71eddbdf06c/arxiv.txt',
    'text'
  );

  let questions = pageContent.split('\n')
    .map(line => {
      return line.split('=')[1];
    })

  return questions;

}

answer();
