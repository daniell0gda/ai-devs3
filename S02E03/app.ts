import type OpenAI from 'openai';
import { OpenAIService } from '../base/openAiServices';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";


import { post_response } from '../base/dev_ai.common';
import { fetchPageContent } from '../base/common';
import { make_ai_response } from '../base/ai_reusables';

const openaiService = new OpenAIService();



async function generate_image() {
    let url = 'https://centrala.ag3nts.org/data/ebb8d796-e6a2-44bc-8109-e71eddbdf06c/robotid.json';
    let pageContent = (await fetchPageContent(url, 'json')) as any as  {description:string}

     let systemPrompt =  `
     you will get persons description of a robot, convert it to image generator prompt description, 
     it should be easy for image generator to visualize robot with your description 
     `;

    let imgDesc = await make_ai_response( openaiService, systemPrompt, pageContent.description);

    let imgUrl = await openaiService.generateImg(imgDesc)

    post_response('robotid', imgUrl)

}



generate_image();
