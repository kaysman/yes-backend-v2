import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as argon from 'argon2';

export async function hashString(unHashedPassword: string): Promise<string> {
  return await argon.hash(unHashedPassword);
}

const webp = require('webp-converter');


export function publicFilePath(filename: string) {
  return 'public/' + filename;
}

/*
  Image Filter
*/
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

/* 
  Helper function to edit filename before saving.
*/
export const editFileName = (file: Express.Multer.File): string => {
  const timestamp = new Date().toISOString()
  const randomtext = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('')
  const justName = file.originalname.split('.')[0].toLowerCase();
  const ref = `${timestamp}-${justName}-${randomtext}.webp`;
  return ref;
};

/*
  Write file into /public
*/
export const saveFile = async (filename, buffer) => {
  const fs = require('fs');
  const sharp = require('sharp');
  const loc = './public'
  try {
    fs.access(loc, (err) => {
      if (err) fs.mkdirSync(loc)
    });
    await sharp(buffer)
      .webp({ quality: 80 })
      .resize(600)
      .toBuffer().then((data) => {
        fs.writeFile(`${loc}/${filename}`, data, function (err) {
          if (err) throw err;
          console.log(`${filename} saved.`);
        });
      })
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/*
  Delete file from /public
*/
export const deleteFile = (filename: string): boolean => {
  const fs = require('fs');
  const loc = './public/'
  try {
    for (let file of fs.readdirSync(loc)) {
      if (file === filename) {
        fs.unlinkSync(loc + filename);
        console.log(`${filename} deleted.`);
        return true
      }
    };
    throw new NotFoundException(`No such image found in ${loc}. ${filename}`)
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// TODO 
export function getImagePath(fileName) {
  return 'assets/images/' + fileName + '.webp';
}

export function writeFileFromBase64(base64String: string, fileName: string) {
  const fs = require('fs');
  fs.writeFile(getImagePath(fileName), base64String, { encoding: 'base64' }, function (err) {
    if (err) {
      throw err;
    } else {
      console.log('created');
    }
  });
}

export function get_webpbase64(path) {
  const fs = require('fs');
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
export function GetExcelFile() {
  var XLSX = require('xlsx')
  var workbook = XLSX.readFile('C:/Users/hajym/OneDrive/Documents/doc.xlsx');
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  console.log(xlData);

}

// Function to get current filenames
// in directory with specific extension
export function getFilesInDirectory() {
  const fs = require('fs');
  console.log("\nFiles present in directory:");
  let files = fs.readdirSync(__dirname);
  files.forEach(file => {
    console.log(file);
  });
}
