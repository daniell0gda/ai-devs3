
export interface PhoneCall{
  "start": string,
  "end": string,
  "length": number,
  _content:string[]
}

export interface PhoneJson{
  "rozmowa1": PhoneCall,
  "rozmowa2": PhoneCall,
  "rozmowa3": PhoneCall,
  "rozmowa4": PhoneCall,
  "rozmowa5": PhoneCall,
  "reszta": string[]
}

export interface PhoneJsonSorted{
  "rozmowa1": string[],
  "rozmowa2": string[],
  "rozmowa3": string[],
  "rozmowa4": string[],
  "rozmowa5": string[]
}
