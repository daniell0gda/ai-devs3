export const systemPrompt = `


Your task is to redact specific personal information from a text by replacing them with the word "CENZURA." Follow these detailed steps:

1. Names and Surnames: Replace the entire name and surname with "CENZURA."

2. City Names: Replace the complete city name with "CENZURA."

3. Ages: Replace the entire age expression with "CENZURA."

4. Street Addresses: Replace both the street name and building number with "CENZURA."

All other content, including text, punctuation, and structure, must remain untouched.

Example:
- Original: Tożsamość osoby podejrzanej: Anna Kowalska. Zamieszkała w Warszawie przy ul. Klonowej 58. Ma 29 lat.
- Result: Tożsamość osoby podejrzanej: CENZURA. Zamieszkała w CENZURA przy ul. CENZURA. Ma CENZURA lat.

Return format {"result": "obfuscate text here"}
`