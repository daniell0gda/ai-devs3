import {OpenAIService} from '../base/openAiServices.ts';
import {fetchPageContent} from '../base/common.ts';
import {post_response} from '../base/dev_ai.common.ts';
import {make_ai_response} from '../base/ai_reusables.ts';
import {translateToEn} from '../S03E02/prompts.ts';
import {generateSQLQuery} from './prompts.ts';

const openaiService = new OpenAIService();

async function main(){

  // centrala_api(`show create table datacenters`)
  // centrala_api(`show create table users`)
  // centrala_api(`select * from users limit 1`)

  let query = await make_ai_response(
    openaiService,
    "które aktywne datacenter (DC_ID) są zarządzane przez pracowników, którzy są na urlopie (is_active=0)",
    generateSQLQuery
  );

  let res = await centrala_api(query);

  let arr = res as {reply: {dc_id:string}[]};

  await post_response('database', arr.reply.map(entry=>entry.dc_id));
}


export async function centrala_api(query:unknown){
  try {

    const response = await fetch("https://centrala.ag3nts.org/apidb", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "task": 'database',
        "apikey": "ebb8d796-e6a2-44bc-8109-e71eddbdf06c",
        "query": query
      })
    });

    console.log('Response success ', response.status == 200);

    let responseData = await response.json();

    console.log("response text:", responseData);

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}


main();
