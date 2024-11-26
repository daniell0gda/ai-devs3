import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type OpenAI from 'openai';
import type { OpenAIService } from "./openAiServices";
import { extractFlagValueSystemMessage } from "./general_prompts";
import fs from 'fs';

export async function extractFlagValue(openaiService:OpenAIService, html:string) {
    const userPrompt: ChatCompletionMessageParam = {
        role: "user",
        content: html
      };
    
    const systemPrompt: ChatCompletionMessageParam = {
        role: "system",
        content: extractFlagValueSystemMessage
      };

    const allMessages: ChatCompletionMessageParam[] = [
        systemPrompt,
        userPrompt
      ];
    const answer = (await openaiService.completion(allMessages, "gpt-4o", false)) as OpenAI.Chat.Completions.ChatCompletion;

    if (answer.choices[0] && answer.choices[0].message.content) {
       
       return answer.choices[0].message.content
    } 
    
    throw new Error('Failed to get answer from AI');
}

export async function make_ai_response(
  openaiService:OpenAIService, 
  user:string | OpenAI.Chat.Completions.ChatCompletionContentPartText[], 
  system:string | OpenAI.Chat.Completions.ChatCompletionContentPartText[],
  temp?: number,
  jsonMode?:boolean,
  model= "gpt-4o-mini"
  ) : Promise<string>{

  const userPrompt: ChatCompletionMessageParam = {
      role: "user",
      content: user
    };
  
  const systemPrompt: ChatCompletionMessageParam = {
      role: "system",
      content: system
    };

  const allMessages: ChatCompletionMessageParam[] = [
      systemPrompt,
      userPrompt
    ];
  const answer = (await openaiService.completion(
    allMessages,
    model,
    false,
    jsonMode,
    temp
  )) as OpenAI.Chat.Completions.ChatCompletion;
  
  // console.log(answer)

  if (answer.choices[0] && answer.choices[0].message.content) {       
      // answer.choices[0].message

      let content = answer.choices[0].message.content;
      
      console.log('AI Response:', content);
      return content;
  } 

  throw new Error('Failed to get answer from AI');
}

export async function transcribeAudio(openaiService:OpenAIService, path: string) {
  // Create a txt file path by replacing the extension
  const txtPath = path+'.txt';

  // Check if transcription file already exists
  if (fs.existsSync(txtPath)) {
    console.log('Using cached transcription:', txtPath);
    return fs.readFileSync(txtPath, 'utf-8');
  }

  // If no cache exists, transcribe the audio
  const buffer = fs.readFileSync(path);
  const transcription = await openaiService.transcribeAudio(buffer);

  // Save the transcription to a file
  fs.writeFileSync(txtPath, transcription);
  console.log('Saved transcription to:', txtPath);

  return transcription;
}
