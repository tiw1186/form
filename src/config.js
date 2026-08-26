// วาง URL ของ Google Apps Script Web App ที่ deploy แล้วตรงนี้
// วิธีสร้างดูได้ที่ apps-script/README.md
export const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzdK4Pc9-OKO4F8DWGVgsFEuTnI6tnVD7UKXsUnT6goSvtTUbLGD8sLoxKwuNxw9f2D/exec'

// ===== ระบบบันทึกเงินคงเหลือประจำวันโรงเรียน (/finance-record) =====
// Google Sheet ที่เก็บรายชื่อโรงเรียน (gid=0) และบันทึกเงินคงเหลือ (gid=1035907838)
export const FINANCE_SPREADSHEET_ID = '1-QguwE2O91dK9f5dxW_S49p3CpmDnzCFg80KvY9eUPc'
export const FINANCE_SCHOOL_LIST_GID = '0'
export const FINANCE_RECORD_SHEET_GID = '1035907838'

// วาง URL ของ Google Apps Script Web App ที่ deploy จากไฟล์ apps-script/FinanceCode.gs
// (ต้องผูก Apps Script เข้ากับสเปรดชีตด้านบนโดยตรง) วิธีตั้งค่าดูที่ apps-script/README-finance.md
export const GOOGLE_FINANCE_WEBAPP_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'
