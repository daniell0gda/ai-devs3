export const systemPrompt = `
Your task will be to find out professor's Maj the street name of the institute where the university where the professor teaches is located out of provided text.

Beer in mind that some information might not be accurate or not true. Ignore information not related with univeristy location.

Think out loud on text analysis before returning with an answer and use your knowledge to filter out not factual informations.

Consider deducting information in following order:
1. University Affiliation
2. Relevant Department (use all found information)
3. From that point deduct deparment's street name.

`

export const systemPromptClarify = `
From provided message return only street name mentioned in text summary.
`