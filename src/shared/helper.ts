import * as argon from 'argon2';

export async function hashString(unHashedPassword: string): Promise<string> {
  return await argon.hash(unHashedPassword);
}

const webp = require('webp-converter');
const fs = require('fs');

export function getImagePath(fileName) {
  return 'assets/images/' + fileName + '.webp';
}

export function writeFileFromBase64(base64String: string, fileName: string) {
  fs.writeFile(getImagePath(fileName), base64String, { encoding: 'base64' }, function (err) {
    if (err) {
      throw err;
    } else {
      console.log('created');
    }
  });
}

export function get_webpbase64(path) {
  fs.readFile(path, function (error, data) {
    if (error) {
      throw error;
    } else {
      let buf = Buffer.from(data);
      let dataBase64 = Buffer.from(buf).toString('base64');
      // base64str of image
      // base64str image type jpg,png ...
      //option: options and quality,it should be given between 0 to 100
      let result = webp.str2webpstr(dataBase64, 'jpg', '-q 80');
      result.then(function (result) {
        // you access the value from the promise here
        console.log(result);
      });
    }
  });  
}
  export function GetExcelFile(){
var XLSX = require('xlsx')
var workbook = XLSX.readFile('C:/Users/hajym/OneDrive/Documents/doc.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
console.log(xlData);

  }