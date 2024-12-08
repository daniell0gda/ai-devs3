import fs from 'fs';

const axios = require('axios');
export interface MyFile {
    content:string;
    name:string;
    fullPath:string;
}

export async function fetchPageContent<ResponseType = string>(url:string, mode: 'json'|'text'):Promise<ResponseType> {
    try {
        console.log('Fetching page content', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        if(mode == 'text'){
            const html = await response.text();
            return html as ResponseType; // Returns the HTML content as a string
        }

        const json = await response.json();
        return json; // Returns the HTML content as a string
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);

        return '' as ResponseType;
    }
}


export async function downloadFileGetBuffer(url:string) {
    try {
        // Make a GET request to the URL with responseType set to 'arraybuffer'
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Create a buffer from the response data
        const buffer = Buffer.from(response.data);

        console.log(`${url} file downloaded successfully!`);
        return buffer; // Return the buffer containing the MP3 data
    } catch (error:any) {
        console.error('Error downloading MP3:', error?.message);
    }
}

export async function buffer2File(buffer:Buffer, filePath:string){
    return fs.writeFile(filePath, buffer, ()=>{
        console.log(`${filePath} file saved successfully`)
    })
}

export async function downloadFile(url:string, filePath:string){
    let buffer = await downloadFileGetBuffer(url);
    if(!buffer){
        throw new Error(`File not available at ${url}`)
    }
    return buffer2File(buffer, filePath);
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

export async function read_files(path:string, ext = '.txt'): Promise<MyFile[]> {
    const directoryPath = path;

    // Convert fs.readdir to Promise-based operation
    const files = await new Promise<string[]>((resolve,
      reject) => {
        fs.readdir(
          directoryPath,
          (err,
            files) => {
              if (err) {
                  reject(err);
                  return;
              }
              resolve(files);
          }
        );
    });

    let allTODO: MyFile[] = [];
    for (const file of files) {

        if (!file.endsWith(ext)) {
            continue;
        }

        let fullPath = `${directoryPath}/${file}`;

        let text = fs.readFileSync(fullPath)
          .toString();
        allTODO.push({
            name: file,
            content: text,
            fullPath
        });
    }

    return allTODO;
}
