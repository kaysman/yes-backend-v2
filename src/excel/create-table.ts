// var Excel = require('exceljs');
// var wb = new Excel.Workbook();
// var path = require('path');
// var filePath = path.resolve("C:/Users/hajym/OneDrive/Documents/doc.xlsx");

// wb.xlsx.readFile(filePath).then(function(){

//     var sh = wb.getWorksheet("Sheet1");

//     wb.xlsx.writeFile("sample2.xlsx");
//     console.log("Row-3 | Cell-2 - "+sh.getRow(3).getCell(2).value);

//     console.log(sh.rowCount);
//     //Get all the rows data [1st and 2nd column]
//     for (var i = 1; i <= sh.rowCount; i++) {
//         console.log(sh.getRow(i).getCell(1).value);
//         console.log(sh.getRow(i).getCell(2).value);
//     }
// });



var XLSX = require('xlsx')
var workbook = XLSX.readFile('C:/Users/hajym/OneDrive/Documents/doc.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

for (var i = 0 ; i<xlData.length; i++){
    console.log(i, xlData[i]);
    
}







// async function CreateExcel() {
//     const workbook = ExcelJS();


// workbook.creator = 'Hajymyrat';
// workbook.lastModifiedBy = 'Ayydoff';
// workbook.created = new Date(2022, 6,11);
// workbook.modified = new Date();
// workbook.lastPrinted = new Date(2016, 9, 27);

// workbook.properties.date1904 = true;
// workbook.calcProperties.fullCalcOnLoad = true;

// workbook.views = [
//     {
//       x: 0, y: 0, width: 10000, height: 20000,
//       firstSheet: 0, activeTab: 1, visibility: 'visible'
//     }
//   ]

//   const sheet = workbook.addWorksheet('Product_Table');

//   sheet.columns = [
//     { header: 'Id', key: 'id', width: 10 },
//     { header: 'Name', key: 'name', width: 32 },
//     { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
//   ];
//   await workbook.csv.writeFile("C:\Users\hajym\become_insider\excelFile");
// }