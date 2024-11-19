
import { url } from 'inspector';
import * as prompts from './prompt'
 
const video = document.getElementById('videoElement');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const ai_responseDiv = document.getElementById('ai_response');
const img1 = document.getElementById('img1') as HTMLImageElement;
const img2 = document.getElementById('img2') as HTMLImageElement;
const img3 = document.getElementById('img3') as HTMLImageElement;
const img4 = document.getElementById('img4') as HTMLImageElement;

async function startCamera() {

    const constraints = {
        video: {
            facingMode: { exact: 'environment' }  // Request rear camera
        }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if(video){
        
            (video as HTMLVideoElement).srcObject = stream;   
        }
    } catch (error) {
        console.error("Error accessing the camera: ", error);
    }
}

async function captureImage() {
  
    
    // Display image and optionally store base64 string
    // (capturedImage as HTMLImageElement).src = dataURL;
    
    open_ai_question().then((res)=>{
        (ai_responseDiv as HTMLDivElement).textContent = res;
    });

     try {
       
    } catch (error) {
        console.error('Failed to process image:', error);
    }
}

function imgToBase64(img:HTMLImageElement) {
    const myCanvas = canvas as HTMLCanvasElement;
    // const myVideo = video as HTMLVideoElement;
    const context = myCanvas.getContext('2d');
    if (!canvas || !context) return;
    
    myCanvas.width = img.width;
    myCanvas.height = img.height;
    context.drawImage(img, 0, 0);
    // Get base64 string (remove the data:image/png;base64, prefix)
    const dataURL = myCanvas.toDataURL('image/png');
    
    const base64String = dataURL.split(',')[1];

    return dataURL;
}


// Start the camera when the page loads
// startCamera();

// Add event listener for capturing image
captureButton?.addEventListener('click', async ()=>{
    await captureImage()
});


async function open_ai_question(){
    const userPrompt = {
        role: "user",
        content: [
            {
                "type": "image_url",
                "image_url": {
                    "url": `${imgToBase64(img1)}`,
                    "detail": "high"
                }
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": `${imgToBase64(img2)}`,
                    "detail": "high"
                }
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": `${imgToBase64(img3)}`,
                    "detail": "high"
                }
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": `${imgToBase64(img4)}`,
                    "detail": "high"
                }
            }
        ]
      };
    
    const sysPropmpt = {
        role: "system",
        content: prompts.systemPrompt
      };
  
    const allMessages = [
        sysPropmpt,
        userPrompt
      ];

    let data  = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-W`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: allMessages,
          temperature: 0.7
        })
      })
      .then(response => response.json())

      console.log(data);
     return data.choices[0].message.content
}

function resizeImage() {
    let width = 60;
    let height = 80;
    var smallCanvas:HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
    smallCanvas.width =width;
    smallCanvas.height = height;
    var smallCanvasCtx = smallCanvas.getContext('2d');

    const myCanvas = canvas as HTMLCanvasElement;
    var ctxLittle = myCanvas.getContext('2d');

    smallCanvasCtx?.drawImage(myCanvas, 0, 0, width, height, 0, 0, width, height);

    const dataURL = myCanvas.toDataURL('image/png');
    
    const base64String = dataURL.split(',')[1];

    return base64String;
}
