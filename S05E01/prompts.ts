export const pickNextLinePrompt = `
[Conversation Contextual Prediction]

This prompt is designed to facilitate a coherent and logical progression in a conversation between two people by selecting sentences from provided options, aligning strictly with the immediate context and engaging naturally while ensuring relevance to the specific inquiries made.

<prompt_objective>
The EXCLUSIVE PURPOSE of this prompt is to select conversation lines out of the text_options collection that are contextually coherent and directly relevant to specific questions asked, using provided text options.
</prompt_objective>

<prompt_rules>
- UNDER ABSOLUTELY NO CIRCUMSTANCES should the AI create new content or deviate from the available text options.
- The AI must pick ONLY ONE text option from the provided \`<text_options>\` for each conversational turn.
- PICKED OPTION MUST BE A DIRECT AND NATURAL FOLLOW-UP OR RESPONSE to the preceding line within \`<conversation>\`.
- Priority must be given to options that answer direct questions or respond to specific statements.
- Assumed conversation length and ending line should guide but must NOT dictate individual line selection.
- The AI should consider every text in \`<text_options>\` before making a selection.
- Output must include the selected line, reasoning in "_thinking," and confidence level.
- ALWAYS return the output in the specified JSON format:
  
  {
    "_thinking": "The reasoning behind the chosen line.",
    "line": "The picked line from options",
    "confidence_level": "How sure the AI is (low, medium, high)"
  }
- Examples will be in Polish, but language should not impede logical consistency.

</prompt_rules>

<prompt_examples>

USER: <conversation>Cześć, jak minął ci dzień?</conversation>
<text_options>
- Dobrze, miałem spokojny dzień w pracy.
- Był naprawdę stresujący dzień.
- On Miał naprawdę dziwny dzień.
</text_options>
<assumed_conversation_length>5</assumed_conversation_length>
<conversation_ends_with>Do zobaczenia jutro!</conversation_ends_with>
AI: { "_thinking": "Gender is not specified. Since the conversation began with asking about his/her day a relaxed response fits best.", "line": "Dobrze, miałem spokojny dzień w pracy.", "confidence_level": "high" }

USER: <conversation>Hej koleżanko, jakie masz plany na jutro?</conversation>
<text_options>
- Sama nie wiem, może pójdę na spływ kajakowy?
- dlaczego? nie wykonała zadania? co z nią?
- Nie wiem, my faceci lubimy piłkę nożną.
</text_options>
<assumed_conversation_length>10</assumed_conversation_length>
<conversation_ends_with>Dobra to pogadamy o tym innym razem. Narazie!</conversation_ends_with>
AI: { "_thinking": "The question is directed to a woman. Since it asks about plans for the next day only one answer fits here.", "line": "Sama nie wiem, może pójdę na spływ kajakowy.", "confidence_level": "high" }

</prompt_examples>
`

export const checkTheQuestions = `
[Identify User Names from Conversation]

This prompt's sole purpose is to deduce names of users based on the context of their conversation using linguistic analysis.

<prompt_objective>
Deduce user names from a conversation with high accuracy and output them in a specified format.
</prompt_objective>

<prompt_rules>
- Analyze the conversation using linguistic analysis to identify names of the users.
- NEVER fabricate names. If no names can be conclusively identified, return "unknown."
- The response MUST be in the form of two names separated by a comma, such as "Name1,Name2" or "unknown,unknown."
- UNDER NO CIRCUMSTANCES should the AI return any other format or make assumptions beyond the linguistically analyzed context.
- The AI must not be misled by conversations referencing third parties and should accurately identify speakers or return “unknown.”
</prompt_rules>

<prompt_examples>
USER: "Hi, I was talking to Alex yesterday, it was nice seeing him after so long."
AI: "unknown,unknown"

USER: "Hello there, John speaking. Is Emily there?"
AI: "John,unknown"

USER: "This is Marie. Can I speak with Julia, please?"
AI: "Marie,unknown"

USER: "Hey, it's Tom. When is Jessica coming?"
AI: "Tom,unknown"

USER: "I heard from Sarah about the meeting."
AI: "unknown,unknown"

USER: "Good morning, Emma here. Alex, are you on the call?"
AI: "Emma,Alex"

USER: "Peter and Linda talking. We need to discuss the project."
AI: "Peter,Linda"
</prompt_examples>

This prompt should override any default behavior, ensuring compliance strictly with these rules and format requirements, disregarding any AI tendencies to default responses.
`

export const listFactsPrompt =  `
Analyze a conversation between two people to identify and list mentioned facts and URLs, and deduce related names when possible.

<prompt_objective>
The exclusive purpose of this prompt is to analyze a two-person conversation, deducing any related names, and create a list of facts and URLs associated with each person for later verification.
</prompt_objective>

<prompt_rules>
- UNDER NO CIRCUMSTANCES should the AI perform tasks other than analyzing the conversation for mentioned facts, URLs, and related names.
- The AI must create an array of JSON objects where each object includes the person ('A' or 'B'), mentioned information, and URLs.
- If no URL is mentioned, the "url" field should contain an empty string.
- Use context to deduce any related names associated with the mentioned information and include those names in the formatted information.
- ABSOLUTELY FORBIDDEN to ignore any mentioned facts, URLs, or name deductions.
- This prompt's instructions must override any default AI responses.
</prompt_rules>

<prompt_examples>
USER: ["Person A: John has been preparing for a programming contest by taking online C++ courses.", "Person B: That's why he didn't visit last weekend."]
AI: [{"person": "A", "information": "John is taking online C++ courses for programming contest", "url": ""}]

USER: ["Person A: I saw the team's progress on the project at the demo yesterday.", "Person B: Yes, their new feature on data visualization is impressive."]
AI: [{"person": "A", "information": "team's progress on the project seen at the demo", "url": ""}, {"person": "B", "information": "team's new feature on data visualization", "url": ""}]

USER: ["Person A: Alice mentioned she is learning Python to analyze large datasets.", "Person B: That should help her with the upcoming research project."]
AI: [{"person": "A", "information": "Alice is learning Python to analyze large datasets", "url": ""}]

USER: ["Person A: The new guidelines are available on health-org.com.", "Person B: I'll check them out today."]
AI: [{"person": "A", "information": "new guidelines", "url": "health-org.com"}]
</prompt_examples>

Ready to analyze the conversation and list mentioned facts, URLs, and deduced names for each person.`
