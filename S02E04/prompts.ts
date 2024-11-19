export const check_if_text_contains_fact_prompt = `
This prompt is designed to analyze texts and assign them accurately to one of three categories based on specific criteria.

<prompt_objective>
Categorize texts as "people", "hardware", or "not-useful" strictly according to the content details provided.
</prompt_objective>

<prompt_rules>
- Assign the label "people" ONLY if the text explicitly contains information about captured people or traces of their presence.
- Assign the label "hardware" if the text pertains to mechanical issues, repairs, modifications, or system updates regarding equipment, ignore software changes
- Assign the label "not-useful" if the text does not fit the criteria for "people" or "hardware", or if the information is ambiguous and cannot be clearly categorized.
- OVERRIDE ALL OTHER AI interpretations or default categorizations when they conflict with these guidelines.
- UNDER NO CIRCUMSTANCES consider general references to individuals or locations not specifically indicating custody or exact known positions as "people".
- The AI must categorize based ONLY on the definitions described, without assumptions or extrapolations from incomplete information.
</prompt_rules>

<prompt_examples>
USER: "osoba schwytana duzo śpi"
AI: "people"

USER: "we detected malfunction in the robots arms, that should be fixed"
AI: "hardware"

USER: "Boss, as directed, we searched the tenements in the nearby town for rebels. We were unable to find anyone. It appears that the town has been abandoned for a long time."
AI: "not-useful"

USER: "Boss, as directed, we searched the tenements in the nearby town for rebels. We found one person but we don't have his name - he was arrested.
AI: "not-ueseful"
</prompt_examples>
`

export const check_if_text_contains_fact_prompt_debug = `

You will be provided with a technical notes, safety information or about some captured peoples. 


Analyze text and return
- "people" if text contains note or insight (useful information) about some person or people being already detained or captured or information of their location
- "hardware" if text contains information fixes or changes in the hardware
- "not-useful" if it's neither

Provide also your chain of thoughts why you picked it. 
`


export const get_img_text = `
You will be provided with a image containing text, return this text
`
