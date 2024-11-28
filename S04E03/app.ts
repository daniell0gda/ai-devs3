import TurndownService from "turndown";
import {fetchPageContent} from '../base/common.ts';
import path from "path";
import {parse} from 'node-html-parser';
import {make_ai_response} from '../base/ai_reusables.ts';
import {OpenAIService} from '../base/openAiServices.ts';
import {isAnswerInTheContentPrompt, tryAnswerPrompt} from './prompts.ts';
import fs from 'fs';
const cheerio = require('cheerio');
import urlJoin from 'url-join';
import {fifoQueue, Queue} from './fifoQueue.ts';
import {post_response} from '../base/dev_ai.common.ts';
import type {PageLink} from './model.ts';

interface Question {
  id: string;
  value: string;
}

interface PageContent {
  html: string;
  markdown: string;
  links: PageLink[]
}



const openaiService = new OpenAIService();
const turndownService = new TurndownService();

const siteMap: { [key: string]: string } = {}

/**
 * Converts HTML content to Markdown.
 * @param content - html page
 * @returns The Markdown content as a string.
 */
async function convertHTMLToMarkdown(content: string): Promise<string> {
  try {
    // const content = await fs.readFile(filePath, "utf-8");
    return turndownService.turndown(content);
  } catch (error: any) {
    console.error(`Failed to convert HTML to Markdown: ${error.message}`);
    throw error;
  }
}

function getFolderPath() {
  return path.join(
    process.cwd(),
    'S04E03',
    'page'
  );
}

async function parsePage(parentLink: PageLink, allowedHost:string[]): Promise<PageContent|null> {
  if(!parentLink.url){
    return null
  }
  const myURL = new URL(parentLink.url);


  let fileNameBase = myURL.pathname == '/' ? 'root' : myURL.pathname;

  let filePath = `${getFolderPath()}/${fileNameBase}.md`;

  // if (fs.existsSync(filePath)) {
  //   let fileContent =  fs.readFileSync(filePath)?.toString() || '';
  //   if(!fileContent){
  //     throw new Error(`File content not found ${filePath}`)
  //   }
  //
  //   return fileContent;
  // }

  let fetchPage = await fetchPageContent(
    parentLink.url,
    'text'
  );

  const root = parse(fetchPage);
  const mainElementInBody = root.querySelector('body');

  if (!mainElementInBody) {
    throw new Error(`Main Not found at ${parentLink}`)
  }

  let markdown = await convertHTMLToMarkdown(mainElementInBody?.innerHTML || '')

  // fs.writeFileSync(
  //   filePath,
  //   markdown
  // );


  let url = new URL(parentLink.url);

  let links = await getLinks( url.origin);
  return {
    markdown,
    html: fetchPage,
    links: links
  };

  async function getLinks(hostName:string): Promise<PageLink[]> {
    return (
      await listLinksInPage(fetchPage)
    ).filter(link =>
        link.startsWith('/') || allowedHost.some(host => link.startsWith(host))
      )
      .map(link => {

        if(allowedHost.some(host => link.startsWith(host))){
          return link
        }

        return urlJoin(
          hostName,
          link
        )


      }).map((link)=> {
        return {
          level: parentLink.level+1,
          url: link
        } satisfies PageLink
      });
  }
}


async function getQuestions(): Promise<Question[]> {
  let pageContent = await fetchPageContent<{ "01": string, "02": string, "03": string }>(
    "https://centrala.ag3nts.org/data/ebb8d796-e6a2-44bc-8109-e71eddbdf06c/softo.json",
    'json'
  );

  return [
    {
      id: '02',
      value: pageContent['02']
    },
    {
      id: '01',
      value: pageContent['01']
    },

    {
      id: '03',
      value: pageContent['03']
    }
  ]

}

async function listLinksInPage(htmlContent: string) {

  const urls: string[] = [];

  const root = parse(htmlContent);
  const $ = cheerio.load(htmlContent);

  $('a').each((index, element) => {
    urls.push($(element).attr('href'));
  });

  return urls;

}

async function aiGatherInfo(question: string, info:string): Promise<string> {

  let gatherInfoPrompt = `${isAnswerInTheContentPrompt}
  <text>
  ${info}
  </text>
  `;

  let gatherInfo = await make_ai_response(
    openaiService,
    question,
    gatherInfoPrompt
  )
  return gatherInfo;
}

async function tryGatherQuestionInformation(startPage: string, question: string, allowedHosts:string[], bannedUrls:string[]) {

  let answerPeaces: string[] = [];
  let urls = new Queue();
  urls.add({
    level: 0,
    url: startPage
  });

  let currentPage:PageLink|undefined = urls.dequeue()!;
  let finalAnswer = '';

  do
  {
    if(!currentPage){
      return '';
    }


    try{
      console.log('Parsing', currentPage.url, currentPage.level)
      let pageContent = await parsePage(currentPage, allowedHosts);

      if(pageContent == null)
      {
        continue;
      }

      for (const link of pageContent.links) {

        if(bannedUrls.some(url=> link.url?.includes(url) ) ){
          continue;
        }

        if(link.level > 2){
          continue;
        }
        urls.add(link);
      }

      // console.log(JSON.stringify(pageContent.links))

      let gatherInfo = await aiGatherInfo(
        question,
        pageContent.markdown
      );

      console.log('gatherInfo', gatherInfo)
      answerPeaces.push(gatherInfo);

      let tryAnswer = `${tryAnswerPrompt}
    <text>
    ${answerPeaces.join('\n')}
    </text>
    `;

      let answerQuestion = await make_ai_response(
        openaiService,
        question,
        tryAnswer
      )

      if(answerQuestion.includes(`I don't know`)){

        currentPage = urls.dequeue();

        console.log('I should continue', currentPage)
      }
      else{
        finalAnswer = answerQuestion;

        console.log(finalAnswer);
      }

      if(!currentPage){
        throw new Error('Out of pages, not answer found');
      }
    }
    catch(e){
      console.error(e);
      currentPage = urls.dequeue();
    }
  }
  while(!finalAnswer)

  return finalAnswer;
}

async function main() {

  let starUrl = 'https://softo.ag3nts.org/';

  let questions = await getQuestions();

  let answers:{[key:string]:string} = {}
  for (const question of questions) {
    let answer = await tryGatherQuestionInformation(starUrl, question.value, [starUrl], ['czescizamienne', 'loop']);
    if(!answer){
      throw new Error(`No answer found for ${question}`)
    }
    answers[question.id] = answer;
  }

  console.log(answers);

  await post_response('softo', answers);


}

main();
