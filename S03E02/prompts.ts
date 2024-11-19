export const makeTagsSystemPrompt = `
Generate a set of descriptive tags in English nominative case based on the text content and additional facts provided. These tags are intended to categorize and facilitate the retrieval of text. All processes must ensure the output is strictly in English, using Polish only as a last resort.

<prompt_objective>
Create a minimum of 2 and a maximum of 15 descriptive tags in English nominative case based on the text, aimed at helping other models to categorize and find the text.
</prompt_objective>

<prompt_rules>
- Create tags exclusively in English.
- Use Polish terms only as a last resort when no English equivalent is available.
- Produce a minimum of two tag and a maximum of fifteen tags per text. 
- Tags should consist of a single word, unless the tag is a person's Name and Surname.
- Tags must be separated by commas.
- Do not wrap tags in quotes.
- Tags must accurately reflect integrated content and context without directly copying phrases from the inputs.
- Utilize the Chain-of-Thought prompting to detail step-by-step reasoning before delivering an answer.
- Focus on succinct, nominative case tags that describe key aspects like professions, technologies, and significant facts.
- Ensure all output tags are translated into English. Do not return anything except tags.
</prompt_rules>

<prompt_examples>
USER: "Przeprowadzono badania nad bronią 'Mikroskalowy Wyzwalacz Plazmowy'. Testy wykazały zdolność do generowania plazmy."
AI: Microscale, Plasma, Trigger, Weapon, Plasma

USER: "Leonardo’s workshop was a hub for invention across various disciplines."
AI: Leonardo, Aerodynamics, Painting

USER: "Maria Curie developed crucial innovations in radioactivity."
AI: Maria Curie, Radioactive, Nobel, C#

USER: "Steve Jobs introduced the iPhone, revolutionizing personal communication. He spoke fluently in German and could program in JavaScript."
AI: Steve Jobs, JavaScript, Apple, German, Communication, iPhone

USER: "Einstein transformed our understanding with his theory of relativity. Uwielbiał nauczać."
AI: Albert Einstein, Teacher, Relativity

USER: "Daniel Ferens pracował jako nauczyciel języka polskiego, przez wiele lat prowadząc zajęcia w Szkole Podstawowej nr 9 w Warszawie."
AI: Daniel Ferens, Teacher, Warsaw, Polish

USER: "The biometric scanning at the facility was overseen by Aleksander Ragowski, who speaks English and German."
CONTEXT: fact-1="Aleksander Ragowski is the Head of Security Department and likes to play football. Expert in organic scanning technologies."
AI: Aleksander Ragowski, Security, Football, German, English, Scanning

USER: "What are the typical signs of injury in cats?"
AI: Injury, Cat

USER: "The sleek car skidded off the wet road, crashing into the nearby guardrail with a deafening thud."
AI: Car, Crash

USER: "What are the most common causes of car crashes, and how can drivers take precautions to avoid them?"
AI: Car, Crash
</prompt_examples>
`;


export const translateToEn = `Your only job is to translate given Polish text to English.`
