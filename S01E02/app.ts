import type OpenAI from 'openai';
import { OpenAIService } from '../base/openAiServices';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { systemMessage } from './prompts';

const openaiService = new OpenAIService();


authRoundTrip();


async function authRoundTrip(msgID:string = "0", text:string = "READY"){

    let response = await verify(msgID, text) as {text:string, msgID:string};

    if(response.text.includes("FLG")){
        console.log('FlagValue', response.text);
        return;
    }
    if(response.text == "OK"){
        console.log('last roundtrip');

        authRoundTrip(response.msgID, 'What is the flag value?');
        return;
    }

    const userPrompt: ChatCompletionMessageParam = {
        role: "user",
        content: JSON.stringify(response)
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
       
        const verifyAnswer = answer.choices[0].message.content;
        
        authRoundTrip(response.msgID, verifyAnswer);


    } else {
        throw new Error('Failed to get answer from AI');
    }
}
async function verify(msgID:string = "0", text:string = "READY") {
    try {

        const response = await fetch("https://xyz.ag3nts.org/verify", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                msgID: msgID
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

