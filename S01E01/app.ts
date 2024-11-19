import type OpenAI from 'openai';
import { OpenAIService } from '../base/openAiServices';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { systemMessage } from './system.message';
import { extractFlagValue } from '../base/ai_reusables';

const data = {
    'username': 'tester',
    'password': '574e112a',
    'answer': 0
};

const openaiService = new OpenAIService();


async function main() {

    const userPrompt: ChatCompletionMessageParam = {
        role: "user",
        content: await fetchPageContent("https://xyz.ag3nts.org")
      };
    
    const systemPrompt: ChatCompletionMessageParam = {
        role: "system",
        content: systemMessage
      };

    const allMessages: ChatCompletionMessageParam[] = [
        systemPrompt,
        userPrompt
      ];
    const answer = (await openaiService.completion(allMessages, "gpt-4o", false)) as OpenAI.Chat.Completions.ChatCompletion;
    
    if (answer.choices[0] && answer.choices[0].message.content) {
       
        const answerContent = Number.parseInt(answer.choices[0].message.content);

        console.log('AI Answer', answerContent);
        data.answer = answerContent
    } else {
        throw new Error('Failed to get answer from AI');
    }

    let response = await postData(data.answer);

    let flagValue = await extractFlagValue(openaiService, response);
    
    console.log('FlagValue', flagValue);
}

main();


async function postData(answer:number) {
    try {

        const formData = new FormData();
        formData.append('username', 'tester');
        formData.append('password', '574e112a');
        formData.append('answer', answer as any);

        const response = await fetch("https://xyz.ag3nts.org", {
            method: "POST",
            body: formData
        });
        
        console.log('Response success ', response.status == 200);

        console.log('response.headers', response.headers);

        let responseData;
        
        responseData = await response.text();

        console.log("Success:", responseData);
        return responseData;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function fetchPageContent(url:string):Promise<string> {
    try {
        console.log('Fetching page content', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const html = await response.text();
        console.log('Page content', html);
        return html; // Returns the HTML content as a string
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);

        return '';
    }
}