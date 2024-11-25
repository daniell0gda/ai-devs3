import OpenAI,{ toFile } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import dotenv from 'dotenv'
import type {CreateEmbeddingResponse} from 'openai/resources';
import {get_img_text} from '../S02E04/prompts.ts';

export class OpenAIService {
  private openai: OpenAI;

  constructor(useDotnetEnv = true, apiKey?:string) {

    if(useDotnetEnv)
    {
      dotenv.config();
    }

    this.openai = new OpenAI({
      apiKey: apiKey ?? process.env.OPENAI_API_KEY
    });
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      console.log('Transcribing audio, buffer length:', audioBuffer.length);
      console.log('Buffer type:', typeof audioBuffer);
      
      console.log('Is Buffer?', Buffer.isBuffer(audioBuffer));
      const file = await toFile(audioBuffer, 'audio.webm', { type: 'audio/webm' });
      console.log('File created:', file.name, file.type, file.size);
      console.log('Is File?', file instanceof File);
      const response = await this.openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
      });
      console.log('Transcription response:', response);
      return response.text;
    } catch (error) {
      console.error('Error in transcribeAudio:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }

  async askAboutImage(system:string,imageBase64:string, userText:string) : Promise<string>{

    let imgPart = {
      "type": "image_url",
      "image_url": {
        "url": `data:image/jpeg;base64,${imageBase64}`,
        "detail": "high"
      }
    };
    const userPrompt: ChatCompletionMessageParam = {
      role: "user",
      content: userText ? [imgPart,
        {
          type: 'text',
          text: 'userText'
        }
      ] : [imgPart] as any[]
    };

    const systemPrompt: ChatCompletionMessageParam = {
      role: "system",
      content: system
    };

    const allMessages: ChatCompletionMessageParam[] = [
      systemPrompt,
      userPrompt
    ];
    const answer = (await this.completion(allMessages, "gpt-4o", false, false)) as OpenAI.Chat.Completions.ChatCompletion;

    // console.log(answer)

    if (answer.choices[0] && answer.choices[0].message.content) {
      // answer.choices[0].message

      let content = answer.choices[0].message.content;
      console.log(content);
      return content;
    }

    throw new Error('Failed to get answer from AI');
  }

  async completion(
    messages: ChatCompletionMessageParam[],
    model: string = "gpt-4",
    stream: boolean = false,
    jsonMode: boolean = false,
    temp?: number
  ): Promise<OpenAI.Chat.Completions.ChatCompletion | AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages,
        model,
        stream,
        temperature: temp,
        top_p:1,
        response_format: jsonMode ? { type: "json_object" } : { type: "text" }
      });

      if (stream) {
        return chatCompletion as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
      } else {
        return chatCompletion as OpenAI.Chat.Completions.ChatCompletion;
      }
    } catch (error) {
      console.error("Error in OpenAI completion:", error);
      throw error;
    }
  }

  async generateImg(prompt:string){
    let response = await this.openai.images.generate(
      {
        prompt: prompt,
        model: 'dall-e-3',
        size: '1024x1024',
        quality: 'standard',
        n:1
      }
  )
  
    let image_url = response.data;
    console.log('Generated image', image_url);

    return image_url[0].url;
  }

  async createEmbedding(text: string): Promise<number[]> {
    try {
      const response: CreateEmbeddingResponse = await this.openai.embeddings.create({
        model: "text-embedding-3-large",
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error creating embedding:", error);
      throw error;
    }
  }
}
