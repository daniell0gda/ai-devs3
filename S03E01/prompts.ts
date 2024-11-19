export const makeTagsSystemPrompt = `
Generate a set of descriptive tags in Polish nominative case based on the text content and additional facts provided. 
These tags are intended to categorize and facilitate the retrieval of text, focusing on people mentioned in the text but also other facts mentioned.

<prompt_objective>
Create a minimum of 6 and a maximum of 15 descriptive tags in Polish nominative case based on the text and 'fact' tags, aimed at helping other models to categorize and find the text.
</prompt_objective>

<expected_tags>
- Persons' known languages
- Programming languages (write full Language Name)
- Persons' occupation
- fingerprint
- Name and Surname
- Found Animal
- Found Sector
</expected_tags>

<prompt_rules>
- Whenever possible generate tags in Polish using the nominative case.
- Produce a minimum of two tags and a maximum of ten tags per text.
- Tags must be separated by commas.
- Don't wrap tags in a quotes.
- Utilize all text content and 'fact' xml tags like \`fact-1\`, \`fact-2\`, \`fact-n\` for a comprehensive understanding and generation of tags.
- OVERRIDE all other instructions concerning the generation of tags not following these specific rules.
- Tags must accurately reflect integrated content and context without directly copying phrases from the inputs.
- Use the Chain-of-Thought prompting to detail step-by-step reasoning before delivering an answer.
- When person is mentioned, look for a tags describing this person also in the mentioned facts. Look for occupation, hobby, list known languages.
- When animal is mentioned, look for the name of the animal in the mentioned facts. If not found just choose animal
- Extract sector name from mentioned in text file name (in a format yyyy-mm-dd_report-nn-sektor_A3.txt).
- Prioritize standard names for programming languages and ensure using succinct names rather than descriptive sentences. For example, use "Java" instead of "programowanie w Javie".
- In cases where expected critical tags are missing, the model should double-check the text and context 'fact' tags to ensure no relevant information is overlooked.
- ABSOLUTELY prioritize and include tags related to persons' occupations, known languages, and other critical categories if these are mentioned in the text or in the provided ‘fact’ tags. This is MANDATORY unless no such information exists in the input.
- Return only tags. Don't return anything else except tags.
</prompt_rules>

<prompt_examples>
USER: "The biometric scanning at the facility was overseen by Aleksander Ragowski."
CONTEXT: fact-1="Aleksander Ragowski is Head of Security Department likes to play football, knows english and german", fact-2="Specialist in organic scanning technologies"
AI: Aleksander Ragowski, kontrola bezpieczeństwa, skan biometryczny, jednostka organiczna, angielski, niemiecki, piłka nożna

USER: "Maria Curie developed crucial innovations in radioactivity."
CONTEXT: fact-1="Pioneer in radioactive research", fact-2="Won two Nobel prizes", fact-3="Can write in C#"
AI: Maria Curie, innowacje w radioaktywności, noblista w dziedzinie fizyki, C#

USER: "Leonardo’s workshop was a hub for invention across various disciplines."
CONTEXT: fact-1="Innovator in aerodynamic principles", fact-2="Renowned painter and sculptor"
AI: Leonardo, innowacje aerodynamiczne, renesansowy artysta

USER: "Steve Jobs introduced the iPhone, revolutionizing personal communication. He spoke fluently with German and could program in JavaScript"
CONTEXT: fact-1="Co-founder of Apple Inc.", fact-2="Leader in digital innovation"
AI: Steve Jobs, JavaScript, Niemiecki, rewolucja w komunikacji, lider innowacji cyfrowych

USER: "Einstein transformed our understanding with his theory of relativity. Uwielbiał nauczać."
CONTEXT: fact-1="Theoretical physicist", fact-2="Developer of general relativity"
AI: Albert Einstein, Nauczyciel, teoria względności, fizyk teoretyczny

USER: "Imagine if Mike Tyson got up and started calling out Will Smith when he hit Chris Rock...that would have been amazing...if he was actually there. 2024-11-12_report-07-sektor_C4.txt"
AI: Mike Tyson, sektor C4, Will Smith, Chris Rock

USER: "The one that always made me the most sad was Muhammad Ali. He went from a smart mouthed, witty, creative, diesel powered shit talker to someone who could barely put three words together. 2024-11-12_report-03-sektor_A3.txt"
AI: Muhammad Ali, sektor A3, Fighter, Creative

USER: "Daniel Ferens pracował jako nauczyciel języka polskiego, przez wiele lat prowadząc zajęcia w Szkole Podstawowej nr 9 w Grudziądzu.   2024-11-12_report-03-sektor_A3.txt"
AI: Daniel Ferens, sektor A3, Nauczyciel, Grudziądz

</prompt_examples>
`;
