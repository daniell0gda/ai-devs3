import type OpenAI from 'openai';
import { OpenAIService } from '../base/openAiServices';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { post_response } from '../base/dev_ai.common';
import { isArray } from 'node:util';
import { systemPrompt } from './prompt';
import { error } from 'node:console';

const openaiService = new OpenAIService();


async function fetchPageContent(url:string):Promise<string> {
    try {
        console.log('Fetching page content', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const html = await response.text();
        console.log('Input:', html);
        return html; // Returns the HTML content as a string
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);

        return '';
    }
}

interface OllamaRequest {
    model: string;
    prompt: string;
    format: string;
    stream: boolean;
    system: string;
  }
  
  interface OllamaResponse {
    response: string;
  }
  
  async function generateOllamaResponse(prompt: string): Promise<string> {
    try {
      const requestBody: OllamaRequest = {
        model: "gemma2:2b",
        prompt: prompt,
        format: "json",
        stream: false,
        system: systemPrompt
      };
  
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data: OllamaResponse = await response.json();
      

      let result = JSON.parse(data.response).result;
      if(!result){
        throw new Error("Wrong response format");
      }

      console.log('RESULT:', result);
      return result;
      
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
  

async function main() {
    
    let pageContent = await fetchPageContent("https://centrala.ag3nts.org/data/ebb8d796-e6a2-44bc-8109-e71eddbdf06c/cenzura.txt");

    let result = await generateOllamaResponse(pageContent);

    let finalResult = post_response('CENZURA', result)

}
main();