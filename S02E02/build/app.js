// prompt.ts
var systemPrompt = `
**Task Objective:**
"Determine the primary city represented by the majority of provided map snippets of Polish cities. One snippet is intentionally misleading and should be ignored."

**Detailed Instructions:**
1. **Examine Each Snippet:** For each provided map snippet, list all visible street names and significant landmarks that do not include shops.
2. **Spatial Analysis:** Compare the listed elements from each snippet against known city layouts in Poland. Focus on cities excluding Toru\u0144, Gda\u0144sk, Warszawa, Pozna\u0144, Krak\xF3w, and Bydgoszcz.
3. **Identify Possible Matching Cities:**
   - For each snippet, propose potential cities where the snippet's details most closely align with known geographic or urban characteristics of those cities.
   - Clearly state any snippets that do not closely match any city, suggesting them as potential misleading snippets.
4. **Rationale and Exclusion:**
   - For each determination, provide a reasoned explanation why specific cities were selected or excluded based on the comparison.
   - Continuously refine city choices by cross-referencing and eliminating inconsistencies.

**Guidelines for Analysis:**
- Clearly articulate your reasoning process while matching snippets to cities. Exclude cities that lack at least one matching element found in the snippet.
- Highlight any areas of uncertainty. Specify what additional information (e.g., more detailed maps, historical data) would help increase certainty in identifying the correct city.

**Note of Emphasis:**
Ensure all analysis excludes the cities of Toru\u0144, Gda\u0144sk, Warszawa, Pozna\u0144, Krak\xF3w, and Bydgoszcz. Provide a brief justification for each city eliminated from consideration based on mismatch or non-relevance.
`;

// app.ts
async function captureImage() {
  open_ai_question().then((res) => {
    ai_responseDiv.textContent = res;
  });
  try {
  } catch (error) {
    console.error("Failed to process image:", error);
  }
}
var imgToBase64 = function(img) {
  const myCanvas = canvas;
  const context = myCanvas.getContext("2d");
  if (!canvas || !context)
    return;
  myCanvas.width = img.width;
  myCanvas.height = img.height;
  context.drawImage(img, 0, 0);
  const dataURL = myCanvas.toDataURL("image/png");
  const base64String = dataURL.split(",")[1];
  return dataURL;
};
async function open_ai_question() {
  const userPrompt = {
    role: "user",
    content: [
      {
        type: "image_url",
        image_url: {
          url: `${imgToBase64(img1)}`,
          detail: "high"
        }
      },
      {
        type: "image_url",
        image_url: {
          url: `${imgToBase64(img2)}`,
          detail: "high"
        }
      },
      {
        type: "image_url",
        image_url: {
          url: `${imgToBase64(img3)}`,
          detail: "high"
        }
      },
      {
        type: "image_url",
        image_url: {
          url: `${imgToBase64(img4)}`,
          detail: "high"
        }
      }
    ]
  };
  const sysPropmpt = {
    role: "system",
    content: systemPrompt
  };
  const allMessages = [
    sysPropmpt,
    userPrompt
  ];
  let data = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer sk-`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: allMessages,
      temperature: 0.7
    })
  }).then((response) => response.json());
  console.log(data);
  return data.choices[0].message.content;
}
var video = document.getElementById("videoElement");
var canvas = document.getElementById("canvas");
var captureButton = document.getElementById("captureButton");
var capturedImage = document.getElementById("capturedImage");
var ai_responseDiv = document.getElementById("ai_response");
var img1 = document.getElementById("img1");
var img2 = document.getElementById("img2");
var img3 = document.getElementById("img3");
var img4 = document.getElementById("img4");
captureButton?.addEventListener("click", async () => {
  await captureImage();
});
