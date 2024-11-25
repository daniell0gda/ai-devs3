export const figureOutCityPrompt = `

Your task will be to analize JSON data and figure out in what city name is BARBARA. 
This is logical task and you need to relive only on provided data. 

This clue starts with following data:
{
 "Name": KRAKOW",
 "People": [
    {
      "Name": "Rafał",
      "Cities": []
    },
    {
      "Name": "Barbara",
      "Cities": [] 
    },
 ]
}
This means that In city Krakow we have information about Rafał and Barbara. Now asking about People will get's us connected to them cities.
Asking about Cities will get us people.

The goal is to find in what City is Barbara.

Think out loud when analizing structure you will get from the user.

Return your thoughts if you don't have an answer OR name of the city (one word) if you do.

<prompt_examples>
USER: {
 "Name": GDANSK",
 "People": [
    {
      "Name": "DANIEL",
      "Cities": [{
        "Name": "POZNAN",
        "People": [
        ]
      }]
    },
   {
      "Name": "ANIA",
      "Cities": [{
        "Name": "WARSZAWA",
        "People": [
           {
            "Name": "KUBA",
            "Cities": [{
              "Name": "WARSZAWA",
              "People": [
              ]
            }]
          }
        ]
      }]
    }
 ]
}
AI Reasoning: In Gdansk there is a mention about Daniel and Ania. Daniel is also connected to Poznan but trail is lost there. 
Ania is connect to Warsaw to which is also connected Kuba which is again conneted to Warsaw.
AI result: WARSZAWA 

</prompt_examples>
`
