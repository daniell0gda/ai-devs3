import { file } from "bun";
import { make_ai_response } from "../base/ai_reusables";
import { post_response } from "../base/dev_ai.common";
import { OpenAIService } from "../base/openAiServices";
import { systemPrompt, systemPromptClarify } from "./prompt";
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');


const openaiService = new OpenAIService();

async function read_files():Promise<string[]> {
    const directoryPath = `${process.cwd()}/S02E01/przesluchania`;
    
    // Convert fs.readdir to Promise-based operation
    const files = await new Promise<string[]>((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(files);
        });
    });

    // Process files
    let allTODO = [];
    for (const file of files) {

        if(!file.endsWith('.m4a')){
            continue;
        }

        let filePath = `${directoryPath}/${file}`;
        let outputPath = `${directoryPath}/${file}.mp3`;
        
        await convertAudioToSupportedFormat(filePath, outputPath);

        let transcribed = transcribeAudio(outputPath);
        allTODO.push(transcribed);
    }

    return Promise.all(allTODO);
}

async function transcribeAudio(path: string) {
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

async function main() {
    
    let filesContentArray = await read_files();
    let userPrompt = '';
    for (const item of filesContentArray) {
        console.log(item);

        userPrompt+= `
        <Person1>
        ${item}
        </Person>
        `;
    }
    console.log('===================================');
    let responseWithReasoning = await make_ai_response(openaiService, userPrompt, systemPrompt);
    console.log('===================================');

    let response = await make_ai_response(openaiService, responseWithReasoning, systemPromptClarify);

    console.log(response);

    let finalResult = post_response('mp3', response)
}

async function convertAudioToSupportedFormat(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('mp3')
        .on('error', (err) => reject(err))
        .on('end', () => resolve(outputPath))
        .save(outputPath);
    });
  }


main();