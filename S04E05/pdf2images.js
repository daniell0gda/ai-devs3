const path = require('path');

const dataFilePath = path.join(__dirname, 'output');
const filePath = path.join(__dirname, 'notatnik-rafala.pdf');

const PdfExtractor = require('pdf-extractor').PdfExtractor;

const pdfExtractor = new PdfExtractor(dataFilePath, {
    pageRange: [19],
});
pdfExtractor.parse(filePath).then(() => {
    console.log('# End of Document');
}).catch((err) => {
    console.error('Error: ' + err);
});
