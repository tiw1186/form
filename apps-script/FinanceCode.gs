// ===== วางโค้ดนี้ใน Google Apps Script ที่ผูกกับสเปรดชีต =====
// https://docs.google.com/spreadsheets/d/1-QguwE2O91dK9f5dxW_S49p3CpmDnzCFg80KvY9eUPc/edit
// วิธีติดตั้ง: ดู apps-script/README-finance.md

var SCHOOL_LIST_GID = 0;           // gid=0 : ชีตรายชื่อโรงเรียน
var RECORD_SHEET_GID = 1035907838; // gid=1035907838 : ชีตบันทึกเงินคงเหลือประจำวัน
var ATTACHMENT_FOLDER_NAME = 'ไฟล์แนบ - บันทึกเงินคงเหลือประจำวัน';

var ALLOWED_ATTACHMENT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

function getSheetByGid_(gid) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === gid) return sheets[i];
  }
  return null;
}

function getSchoolNames_() {
  var sheet = getSheetByGid_(SCHOOL_LIST_GID);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var values = sheet.getDataRange().getValues();
  var header = values[0];
  var colIndex = 0;
  for (var i = 0; i < header.length; i++) {
    if (String(header[i]).trim() === 'รายชื่อโรงเรียน') {
      colIndex = i;
      break;
    }
  }

  var names = [];
  for (var r = 1; r < values.length; r++) {
    var name = String(values[r][colIndex] || '').trim();
    if (name) names.push(name);
  }
  return names;
}

function getOrCreateAttachmentFolder_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssFile = DriveApp.getFileById(ss.getId());
  var parents = ssFile.getParents();
  var parentFolder = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();

  var existing = parentFolder.getFoldersByName(ATTACHMENT_FOLDER_NAME);
  if (existing.hasNext()) return existing.next();
  return parentFolder.createFolder(ATTACHMENT_FOLDER_NAME);
}

function sanitizeFileNamePart_(text) {
  return String(text || '').replace(/[\\/:*?"<>|]/g, '').trim();
}

function saveAttachments_(attachments, schoolName, recordDate) {
  if (!attachments || !attachments.length) return [];

  var folder = getOrCreateAttachmentFolder_();
  var links = [];
  var prefixParts = [sanitizeFileNamePart_(recordDate), sanitizeFileNamePart_(schoolName)].filter(Boolean);
  var prefix = prefixParts.length ? prefixParts.join('_') + '_' : '';

  attachments.forEach(function (att) {
    if (!att || !att.base64 || !att.name) return;
    if (ALLOWED_ATTACHMENT_MIME_TYPES.indexOf(att.mimeType) === -1) return;

    try {
      var bytes = Utilities.base64Decode(att.base64);
      var fileName = prefix + sanitizeFileNamePart_(att.name);
      var blob = Utilities.newBlob(bytes, att.mimeType, fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      links.push(file.getName() + ': ' + file.getUrl());
    } catch (err) {
      links.push(att.name + ': อัปโหลดไม่สำเร็จ');
    }
  });

  return links;
}

function buildRecordHeaders_(data) {
  var headers = ['วันที่/เวลาบันทึก', 'วันที่บันทึกข้อมูล', 'ชื่อโรงเรียน'];
  headers.push('เงินฝากส่วนราชการผู้เบิก - เงินประกันสัญญา (บาท)');
  headers.push('เงินฝากส่วนราชการผู้เบิก - เงินอาหารกลางวัน (บาท)');

  (data.budget || []).forEach(function (item) {
    headers.push(item.label + ' - เงินสด (บาท)');
    headers.push(item.label + ' - เงินฝากธนาคาร (บาท)');
  });

  headers.push('เงินคงเหลือ - เงินสด (บาท)');
  headers.push('เงินคงเหลือ - เงินฝากธนาคาร (บาท)');
  headers.push('เงินคงเหลือ - เงินฝากส่วนราชการผู้เบิก (บาท)');
  headers.push('เงินคงเหลือ - รวมทั้งหมด (บาท)');
  headers.push('หมายเหตุอื่นๆ - เงินอื่นๆ รายการที่ 1');
  headers.push('หมายเหตุอื่นๆ - เงินอื่นๆ รายการที่ 2');
  headers.push('ไฟล์แนบ');
  return headers;
}

function getOrCreateRecordSheet_(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getSheetByGid_(RECORD_SHEET_GID);
  if (!sheet) {
    sheet = ss.insertSheet('บันทึกเงินคงเหลือประจำวัน');
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(buildRecordHeaders_(data));
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateRecordSheet_(data);

    var row = [
      new Date(),
      data.recordDate || '',
      data.schoolName || '',
      (data.remit && data.remit.contractDeposit) || 0,
      (data.remit && data.remit.lunch) || 0
    ];

    (data.budget || []).forEach(function (item) {
      row.push(item.cash || 0);
      row.push(item.bank || 0);
    });

    row.push((data.balance && data.balance.cash) || 0);
    row.push((data.balance && data.balance.bank) || 0);
    row.push((data.balance && data.balance.remit) || 0);
    row.push((data.balance && data.balance.total) || 0);
    row.push((data.otherNote && data.otherNote.other1) || '');
    row.push((data.otherNote && data.otherNote.other2) || '');

    var attachmentLinks = saveAttachments_(data.attachments, data.schoolName, data.recordDate);
    row.push(attachmentLinks.join('\n'));

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

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;

  if (action === 'schools') {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', schools: getSchoolNames_() }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Web App is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
