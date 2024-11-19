import type OpenAI from 'openai';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";


import { OpenAIService } from "../base/openAiServices";
import { systemPrompt } from './prompt';

const http = require('http');
const fs = require('fs');

const hostname = '192.168.5.16'; // Listen on all interfaces

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('S02E02/index.html').pipe(res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT,hostname, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});


const openaiService = new OpenAIService();



async function make_ai_response(
    imageBase64:string | OpenAI.Chat.Completions.ChatCompletionContentPartText[], 
    system:string | OpenAI.Chat.Completions.ChatCompletionContentPartText[]) : Promise<string>{
  
    const userPrompt: ChatCompletionMessageParam = {
        role: "user",
        content: `data:image/jpeg;base64,${imageBase64}`
      };
    
    const systemPrompt: ChatCompletionMessageParam = {
        role: "system",
        content: system
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
        
        console.log('AI Response:', content);
        return content;
    } 
  
    throw new Error('Failed to get answer from AI');
  }


  export async function askForImage(image:string):Promise<string>{
    return make_ai_response(image, systemPrompt)
  }