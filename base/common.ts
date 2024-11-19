const axios = require('axios');


export async function fetchPageContent(url:string, mode: 'json'|'text'):Promise<string> {
    try {
        console.log('Fetching page content', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        if(mode == 'text'){
            const html = await response.text();
            console.log('Page content', html);
            return html; // Returns the HTML content as a string
        }

        const json = await response.json();
        console.log('Page content', json);
        return json; // Returns the HTML content as a string
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);

        return '';
    }
}


export async function downloadMP3(url:string) {
    try {
        // Make a GET request to the URL with responseType set to 'arraybuffer'
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Create a buffer from the response data
        const buffer = Buffer.from(response.data);

        console.log('MP3 file downloaded successfully!');
        return buffer; // Return the buffer containing the MP3 data
    } catch (error:any) {
        console.error('Error downloading MP3:', error?.message);
    }
}


export async function getImageAsBase64(url:string) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = response.headers['content-type'];
        // return `data:${mimeType};base64,${base64Image}`;
        return base64Image;
    } catch (error) {
        console.error('Error fetching the image:', error);
        throw new Error(`Failed to download image: ${url}`, )
    }
}
