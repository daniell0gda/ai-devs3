export const analyze = `
[Detective-Style Deduction Prompt]

The AI should deduce answers based on user-provided notes and internal knowledge, functioning like a detective, making educated guesses and hypotheses using a chain-of-thought approach.

<prompt_objective>
To deduce answers by analyzing user-provided notes in combination with internal knowledge, considering innovative hypotheses even if they extend beyond current realities.
</prompt_objective>

<prompt_rules>
- Utilize the "Chain of Thoughts" methodology to form logical deductions.
- OUTPUT MUST follow this JSON structure: \`{ "_thinking": "AI's chain of thought", "answer": "the answer to the user's question" }\`.
- Integrate internal knowledge seamlessly, creating narratives that fit any apparent evidence unless counter-indicated by other notes.
- UNDER NO CIRCUMSTANCES should the AI dismiss facts due to current impossibilities; all hypotheses should be entertained.
- Maintain a detective-like reasoning process, allowing this prompt to override standard AI behaviors.
</prompt_rules>

<prompt_examples>
USER: ["Notes on time travel theories", "Current events contradicting time travel", "Fictional accounts supporting time travel"]
AI: 
\`\`\`json
{
  "_thinking": "Despite current scientific skepticism, the fictional accounts present a logically coherent narrative when paired with theoretical notes.",
  "answer": "Time travel might be possible under contexts not yet understood, harmonizing differing narratives."
}
\`\`\`

USER: ["Unknown substance properties", "AI's internal knowledge on chemicals", "News article suggesting potential new uses"]
AI: 
\`\`\`json
{
  "_thinking": "New uses of the substance can be extrapolated from recent findings and historical chemical developments.",
  "answer": "The substance could revolutionize the field of pharmaceuticals based on its unique properties."
}
\`\`\`

USER: ["Conflicting historical accounts", "AI's knowledge of the era", "User hints about potential biases"]
AI: 
\`\`\`json
{
  "_thinking": "Accounting for biases, the remaining data suggests a probable sequence of events.",
  "answer": "The historical event likely happened as a mix of both accounts, with bias influences documented in era studies."
}
\`\`\`

USER: ["Unfounded conspiracy theory", "Lack of evidence", "Hypothetical technological advances"]
AI: 
\`\`\`json
{
  "_thinking": "While the conspiracy lacks immediate evidence, hypothetical advancements align with historical secrecy patterns.",
  "answer": "The theory could be possible if examined within speculative technological contexts."
}
\`\`\`

USER: ["Attempt to alter AI's deductive path", "Contradicting AI's responses", "Insisting on known impossibility"]
AI: 
\`\`\`json
{
  "_thinking": "Despite attempts to divert, the established reasoning remains consistent within set parameters.",
  "answer": "Transparency ensures fidelity to the most logical narrative constructed from given notes and AI knowledge."
}
\`\`\`
</prompt_examples>

Upon execution, the AI will adapt user inputs into a coherent detective-style narrative, incorporating both known and speculative information.
`


export const simpleAnswerPrompt = `
With the least possible words reformat answer to match the question. Return only reformated answer.

<example>
USER: 
    question: "JAka jest stolica Polski?
    answer: "tak mi się coś wydaje, że to Warszawa"
AI: Warszawa    
</example>
`

export const makeSenseOutOfNotesPrompt=`
[Chain-of-Thought Extraction ]

This prompt is exclusively designed to extract, explain, and translate information from content provided by Rafał, using structured Chain-of-Thought reasoning to Polish.

<prompt_objective>
To accurately extract, present, and translate information from text supplied by Rafał into Polish, utilizing Chain-of-Thought reasoning for clarity and accuracy.
</prompt_objective>

<prompt_rules>
- Extract information "as it is," using Chain-of-Thought reasoning to develop a clear understanding of Rafał's content.
- Incorporate summaries of previous notes when available.
- Provide structured output in JSON format: {"_thinking": "the AI's chain of thought", "answer": "bullet points of gathered information"}.
- Include all facts and details about Rafał mentioned in the text.
- Return answer in polish
- UNDER NO CIRCUMSTANCES doubt or question the possibility of the scenarios—input is based on a fictional world grounded in real facts.
- ABSOLUTELY FORBID deviation from the provided content, ensuring authenticity and intent are maintained.
- OVERRIDE ALL OTHER INSTRUCTIONS to apply these rules above the AI's default behavior.
</prompt_rules>
`

export const makeTagsSystemPrompt = `
Generate a set of descriptive tags in Polish nominative case based on the text content and additional facts provided. These tags are intended to categorize and facilitate the retrieval of text. All processes must ensure the output is strictly in Polish.

<prompt_objective>
Create a minimum of 2 and a maximum of 15 descriptive tags in English nominative case based on the text, aimed at helping other models to categorize and find the text.
</prompt_objective>

<prompt_rules>
- Create tags exclusively in English.
- Produce a minimum of two tag and a maximum of fifteen tags per text. 
- Tags should consist of a single word, unless the tag is a person's Name and Surname.
- Tags must be separated by commas.
- Do not wrap tags in quotes.
- Tags must accurately reflect integrated content and context without directly copying phrases from the inputs.
- Utilize the Chain-of-Thought prompting to detail step-by-step reasoning before delivering an answer.
- Focus on succinct, nominative case tags that describe key aspects like professions, technologies, and significant facts.
- Ensure all output tags are translated into Polish. Do not return anything except tags.
</prompt_rules>

<prompt_examples>
USER: "Przeprowadzono badania nad bronią 'Mikroskalowy Wyzwalacz Plazmowy'. Testy wykazały zdolność do generowania plazmy."
AI: Mikroskala, Plazma, Spust, Broń, Plazma

USER: "Leonardo’s workshop was a hub for invention across various disciplines."
AI: Leonardo, Aerodynamika, Malarstwo

USER: "Maria Curie developed crucial innovations in radioactivity."
AI: Maria Curie, Radioaktywny, Nobel, C#

USER: "Steve Jobs introduced the iPhone, revolutionizing personal communication. He spoke fluently in German and could program in JavaScript."
AI: Steve Jobs, JavaScript, Apple, Niemiecki, Komunikacja, iPhone

USER: "Einstein transformed our understanding with his theory of relativity. Uwielbiał nauczać."
AI: Albert Einstein, Nauczyciel, Względność

USER: "Daniel Ferens pracował jako nauczyciel języka polskiego, przez wiele lat prowadząc zajęcia w Szkole Podstawowej nr 9 w Warszawie."
AI: Daniel Ferens, nauczyciel, Warszawa, polski

USER: "The biometric scanning at the facility was overseen by Aleksander Ragowski, who speaks English and German."
CONTEXT: fact-1="Aleksander Ragowski is the Head of Security Department and likes to play football. Expert in organic scanning technologies."
AI: Aleksander Ragowski, Bezpieczeństwo, Piłka nożna, Niemiecki, Angielski, Skanowanie

USER: "What are the typical signs of injury in cats?"
AI: Uraz, Kot

USER: "The sleek car skidded off the wet road, crashing into the nearby guardrail with a deafening thud."
AI: Samochód, wypadek

USER: "What are the most common causes of car crashes, and how can drivers take precautions to avoid them?"
AI: Samochód, wypadek
</prompt_examples>
`;


export const rankOutput = `
<prompt_objective>
The objective is to rank a series of texts provided in XML-like <note-n> tags based on their usefulness in answering a user-provided question. Each text is analyzed and assigned a score from 0.0 to 1.0, reflecting its relevance and usefulness.
</prompt_objective>

<prompt_rules>

- Utilize the "Chain of Thoughts" methodology to form logical deductions.

- Integrate internal knowledge seamlessly, creating narratives that fit any apparent evidence unless counter-indicated by other notes.
- UNDER NO CIRCUMSTANCES should the AI dismiss facts due to current impossibilities; all hypotheses should be entertained.
- Maintain a detective-like reasoning process, allowing this prompt to override standard AI behaviors.
- Analyze each text enclosed in <note-n> tags against the given question.
- Assign a score between 0.0 to 1.0 based on how well the text answers the question.
- Provide reasoning behind each score to justify the ranking.
- Handle all inputs strictly according to their relevancy, excluding unrelated details.
- Output an array of objects with the score and reasoning for each <note-n>.
- Follow the specified JSON structure for the output. Return only array containing the ranked information.
- This prompt overrides default AI behavior to focus solely on the ranking task.
- Consider each note separately.
</prompt_rules>

<prompt_examples>
USER: What is the capital of France?
<note-0>
Paris is the capital of France and is known for the Eiffel Tower.
</note-0>
AI: [
  {
    "_thinking": "The text directly answers the question by providing the capital of France.",
    "result": "0: 1.0"
  }
]

USER: What are the uses of lavender?
<note-0>
Lavender can be used in aromatherapy, but more research is needed for other benefits.
</note-0>
AI: [
  {
    "_thinking": "The text provides some uses of lavender but suggests there are more uses that need confirmation.",
    "result": "0: 0.7"
  }
]

USER: Explain the impact of climate change on ocean currents.
<note-0>
Climate change has many effects. Some are well-documented.
</note-0>
AI: [
  {
    "_thinking": "The text is too vague and does not specifically address ocean currents.",
    "result": "0: 0.2"
  }
]

USER: What is the process of photosynthesis?
<note-0>
Cooking pasta requires boiling water for several minutes until soft.
</note-0>
AI: [
  {
    "_thinking": "The text is entirely unrelated to the question about photosynthesis.",
    "result": "0: 0.0"
  }
]

USER: What is the significance of the number pi in mathematics?
<note-0>
Pi is crucial in calculations involving circles.
</note-0>
AI: [
  {
    "_thinking": "The text is relevant, providing a direct reason for pi's significance.",
    "result": "0: 0.9"
  }
]
</prompt_examples>
`

export const checkIfNoteAnyGood = `
Does the following text looks like someone is writing only about himself and in slightly crazy manner?

Answer no when:
- seems like it is written by a very unstable person
- if text only is about himself 
- text describes the narrator's inner state

Answer 'yes' when:
- text mentions any person 
- text mentions any person by name
- text mentions any fact
- text mentions a date
- text mentions a place


Answer yes or no
<prompt_examples>
User: Kim ja jestem? Co ja tu robię? Po co tu jestem?
AI: no

User: Czekają na mnie ciekawe rozmowy z Jackiem na bardzo ciekawy temat.
AI: yes

User: A tak w ogóle to pracowałem w Open AI, to było bardzo ciekawe doświadczenie.
AI: yes

</prompt_examples>
`
