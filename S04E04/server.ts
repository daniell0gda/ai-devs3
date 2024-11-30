import {make_ai_response} from '../base/ai_reusables.ts';
import {returnCorrdinatePrompt} from './prompts.ts';
import {OpenAIService} from '../base/openAiServices.ts';

const express = require('express');
const server = express();
const PORT = 3000;

const openaiService = new OpenAIService();

// Middleware to parse JSON body
server.use(express.json());

server.get('/', (req, res) => {
  res.send(`Hello there`);
});

server.post('/', async (req, res) => {
  const instruction = req.body.instruction;
  if (instruction) {
    console.log(`Received instruction: ${instruction}`)

    let result = await getCoordinates(instruction);
    res.send({
      description: result
    });

  } else {
    res.status(400).send('Instruction field is required.');
  }
});



server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function getCoordinates(instructions:string){
  let result =  await make_ai_response(
    openaiService,
    instructions,
    returnCorrdinatePrompt,
    1,
    true
  )

  let resultJsonObject =  JSON.parse(result) as {result:string, _reasoning:string};
  return resultJsonObject.result;

}
