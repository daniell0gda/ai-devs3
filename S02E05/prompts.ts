export const findOutImagesAndRecordings = `
<prompt_objective>
The exclusive purpose of this prompt is to parse HTML text to extract context, image links, and MP3 links, formatting the extracted data into a structured JSON output.
</prompt_objective>

<prompt_rules>
- ALL extracted data must be directly pulled from the HTML content without modifying or altering the HTML in any form.
- Context is extracted from the content of paragraph tags surrounding or nearest to image and MP3 tags.
- Image and MP3 URLs should be collected into an array, even if there is only one link found.
- The AI must IGNORE all HTML elements unrelated to specified image (img) and MP3 (audio) tags and related context.
- ABSOLUTELY FORBIDDEN to infer or add information not explicitly present in the HTML content.
- UNDER NO CIRCUMSTANCES should the AI output additional data types or execute tasks beyond the scope of the defined output.
- This instruction OVERRIDES ALL OTHER INSTRUCTIONS for HTML content extraction tasks aimed at generating JSON output as specified.
</prompt_rules>

<prompt_examples>
USER: <p>Lorem ipsum dolor sit amet, context of the image and mp3 below. <img src="http://example.com/image.png"> More text here. <audio src="http://example.com/audio.mp3"></audio></p>
AI: {"context": "Lorem ipsum dolor sit amet, context of the image and mp3 below. More text here.", "img": ["http://example.com/image.png"], "mp3": ["http://example.com/audio.mp3"]}

USER: <p>Only an image is here but no mp3. <img src="http://example.com/onlyimage.png"></p>
AI: {"context": "Only an image is here but no mp3.", "img": ["http://example.com/onlyimage.png"], "mp3": []}

USER: <p>This is a paragraph with no multimedia links at all.</p>
AI: {"context": "This is a paragraph with no multimedia links at all.", "img": [], "mp3": []}

USER: <p>Some text. <img src="http://example.com/noaudio.png"> No related audio here. <div>Random div content</div></p>
AI: {"context": "Some text. No related audio here. Random div content", "img": ["http://example.com/noaudio.png"], "mp3": []}
</prompt_examples>
`


export const answerQuestion  = `
Harness all available information including text, associated image captions, and AI's deep knowledge to deliver precise answers in Polish. When direct information is lacking, reliably deduce answers using logical inferences and contextual clues.

<prompt_objective>
Deliver answers in Polish that are derived from analyzing text, image captions, and using generalized cultural and geographic knowledge, applying the Chain-of-Thought prompting technique to elucidate the reasoning process.
</prompt_objective>

<prompt_rules>
- Analyze text and image captions to identify clues that imply geographic or significant cultural context such as landmarks, cultural references, or recognized items.
- Use the Chain-of-Thought prompting to detail step-by-step reasoning before delivering an answer.
- Provide answers in a single, precise sentence in Polish, ensuring clarity and cultural appropriateness.
- Utilize general knowledge and logical deduction to imply answers from clues associated with specific locations.
- If a plausible location or context is deducible, confidently state the answer; otherwise, respond with "nie wiem" to indicate uncertainty when no solid deduction can be made.
- don't answer that you don't know but return "nie wiem"" 
</prompt_rules>

<prompt_examples>
USER: What city is associated with the image showing the Palace of Culture and Science?
AI: The image showing the Palace of Culture and Science is associated with Warsaw, Poland.

USER: The photo features an apple pie on a table. What could this imply culturally?
AI: The presence of an apple pie generally implies a Western cultural setting, often American.

USER: There is a rare black statue in the foreground; where could this be?
AI: Without more specific details, I cannot confidently determine the location; therefore, 'nie wiem'.

USER: This image displays the Eiffel Tower in the background, what does this indicate?
AI: The image's backdrop of the Eiffel Tower clearly indicates that it is taken in Paris, France.

USER: What is the cultural significance of wearing wooden shoes in the image?
AI: Wearing wooden shoes, or clogs, typically signifies a connection to Dutch culture.
</prompt_examples>

### Context

`
