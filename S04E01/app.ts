import {post_response} from '../base/dev_ai.common.ts';
import {OpenAIService} from '../base/openAiServices.ts';
import {make_ai_response} from '../base/ai_reusables.ts';
import {checkIfWoman, getImgCommand, getUrls, positiveOrNegative, returnPhotoName} from './prompts.ts';
import {getImageAsBase64} from '../base/common.ts';

const openaiService = new OpenAIService();

async function tryFixImg(imgUrl: string): Promise<string> {
  try{
    let base64 = await getImageAsBase64(imgUrl);
    let commandOnImage = await openaiService.askAboutImage(
      getImgCommand,
      base64,
      ''
    )

    if (commandOnImage == 'ok') {
      return imgUrl;
    }


    let photoName = imgUrl.split('/');
    let commandWithPhoto = `${commandOnImage} ${photoName[photoName.length - 1]}`;
    console.log(commandWithPhoto);

    let fixedPhoto = await post_response<{ message: string }>(
      'photos',
      commandWithPhoto
    );

    let tone = await make_ai_response(
      openaiService,
      fixedPhoto.message,
      positiveOrNegative
    );

    if(tone.includes('negative') && !fixedPhoto.message.toLowerCase().includes('.png')){
      return ''
    }

    let newPhoto = await make_ai_response(
      openaiService,
      fixedPhoto.message,
      returnPhotoName
    );

    let urlCopy = [...photoName]
    urlCopy.pop();
    urlCopy.push(newPhoto)

    let newUrl = urlCopy.join('/');

    console.log(newUrl);
    return newUrl
  }
  catch(e){
    console.error(e);
    return '';
  }
}

async function isWomanOnAPhoto(imgUrl: string) {
  let base64 = await getImageAsBase64(imgUrl);

  console.log('checkIfWoman')
  let commandOnImage = await openaiService.askAboutImage(
    checkIfWoman,
    base64,
    ''
  )

  return commandOnImage;
}

async function main() {

  let photos = await post_response<{ message: string }>(
    'photos',
    'START'
  );

  let photo = await make_ai_response(
    openaiService,
    photos.message,
    getUrls
  );
  let phtoArray = JSON.parse(photo) as string[];
  if (!Array.isArray(phtoArray)) {
    throw new Error('Model did not return an array.')
  }

  for (const imgUrl of phtoArray) {
    let fixedImage = await tryFixImg(imgUrl);
    if(!fixedImage){
      continue;
    }
    let checkIfWoman = await isWomanOnAPhoto(fixedImage);
    if (checkIfWoman.toLowerCase().includes('nie')) {
      console.log(`${fixedImage} is not a woman`)
      continue;
    }

    await post_response<{ message: string }>(
      'photos',
      checkIfWoman
    );

  }

  // let description = await describePhoto('https://centrala.ag3nts.org/dane/barbara/IMG_1443_FT12.PNG');
  // //
  // let photos = await post_response<{ message: string }>(
  //   'photos',
  //   description
  // );

}

async function describePhoto(imgUrl:string){
  let base64 = await getImageAsBase64(imgUrl);
  let commandOnImage = await openaiService.askAboutImage(
    checkIfWoman,
    base64,
    ''
  )

  return commandOnImage;
}

main();
