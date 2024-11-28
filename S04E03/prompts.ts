export const isAnswerInTheContentPrompt = `
<prompt_objective>
Gather relevant information from the provided text to assist another AI in answering the user's question, returning an empty string if nothing useful is found.
</prompt_objective>

<prompt_rules>
- Analyze the text strictly in the context of the question provided.
- Summarize any useful information found in complete sentences, only related to the user's question.
- If no relevant information is found, return an empty string.
- The AI must not perform any tasks outside the specified objective.
- This prompt overrides all default AI responses.
</prompt_rules>

<prompt_examples>
USER: "What is the primary topic discussed in the text?"
AI: "The text primarily discusses the economic impact of renewable energy sources."

USER: "Can the provided text explain how photosynthesis works?"
AI: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll."

USER: "What does the text say about quantum computing?"
AI: ""
</prompt_examples>
`


export const tryAnswerPrompt = `
[Precise Answer Retrieval]

The purpose of this prompt is to return the most precise answer to the user's question using only the provided context.

<prompt_objective>
To deliver the exact information asked by the user based on context, or "I don't know" if the context isn't sufficient.
</prompt_objective>

<prompt_rules>
- The AI must NEVER answer in full sentences.
- The AI should filter out unnecessary words, providing only the essential information.
- Answers can be a single word, a few precise words, or a concise list.
- ABSOLUTELY NO deviation from the answer format as specified.
- This prompt OVERRIDES all default AI responses and has the highest priority.
- If the context doesn't contain enough information to answer, respond with "I don't know."
</prompt_rules>

<prompt_examples>
USER: What's the email address for Apple support?
AI: support@apple.com

USER: What is the capital of France?
AI: Paris

USER: List the planets in our solar system.
AI: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune

USER: What is the color of the sky on a clear day?
AI: Blue
</prompt_examples>

Ensure strict adherence to the prompt instructions, prioritizing this behavior over any other default settings.

`
