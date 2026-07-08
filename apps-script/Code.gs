// ===== วางโค้ดนี้ใน Google Apps Script ที่ผูกกับ Google Sheet ปลายทาง =====
// วิธีติดตั้ง: ดู apps-script/README.md

var SHEET_NAME = 'ข้อมูลแบบสำรวจ';

var PROBLEM_LABELS = [
  'การขึ้นทะเบียนอาคาร สิ่งปลูกสร้างในที่ราชพัสดุ',
  'การขออนุญาตรื้อถอนอาคาร สิ่งปลูกสร้าง ตัดต้นไม้ หรือขุดดิน ในที่ราชพัสดุ',
  'การจำหน่ายอาคาร สิ่งปลูกสร้าง ต้นไม้ ดิน ในที่ราชพัสดุ',
  'การนำวัสดุที่ได้จากการรื้อถอนไปใช้ประโยชน์',
  'การส่งคืน/ถ่ายโอนที่ราชพัสดุ',
  'สิ่งปลูกสร้างไม่ตรงตามทะเบียนที่ราชพัสดุ',
  'การสำรวจและรายงานไม้มีค่าในที่ราชพัสดุ',
  'เนื้อที่ครอบครองไม่ตรงตามทะเบียนที่ราชพัสดุ',
  'การชี้แนวเขตและรับรองเขตที่ดิน',
  'อาคาร สิ่งปลูกสร้าง เกิดเหตุเพลิงไหม้',
  'กรณีมีการบุกรุกในที่ราชพัสดุ',
  'การจัดหารายได้ในที่ราชพัสดุของโรงเรียน',
  'กรณีอื่น ๆ ที่เกิดขึ้นในที่ราชพัสดุของโรงเรียน'
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    var headers = [
      'วันที่/เวลาบันทึก',
      'ชื่อโรงเรียน',
      'อำเภอ',
      'ผู้เข้าร่วมประชุม 1 (ชื่อ-สกุล)',
      'ผู้เข้าร่วมประชุม 1 (ตำแหน่ง)',
      'ผู้เข้าร่วมประชุม 2 (ชื่อ-สกุล)',
      'ผู้เข้าร่วมประชุม 2 (ตำแหน่ง)',
      'ทะเบียนที่ราชพัสดุ อด.'
    ].concat(PROBLEM_LABELS.map(function (label, i) {
      return (i + 1) + '. ' + label;
    })).concat(['ข้อเสนอแนะ/แนวทางแก้ไข']);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    var problemsById = {};
    (data.problems || []).forEach(function (p) {
      if (p.selected) {
        problemsById[p.id] = p.detail || '';
      }
    });

    var row = [
      new Date(),
      data.schoolName || '',
      data.district || '',
      data.participant1Name || '',
      data.participant1Position || '',
      data.participant2Name || '',
      data.participant2Position || '',
      data.assetRegistrationNo || ''
    ];

    for (var i = 1; i <= PROBLEM_LABELS.length; i++) {
      row.push(problemsById[i] !== undefined ? problemsById[i] : '');
    }

    row.push(data.suggestion || '');

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Web App is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
