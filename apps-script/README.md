# วิธีเชื่อมฟอร์มนี้เข้ากับ Google Sheet

ตอบคำถาม: **ทำได้** — วิธีที่ไม่ต้องมีเซิร์ฟเวอร์ของตัวเองคือใช้ Google Apps Script เป็น "Web App"
รับข้อมูลที่ฟอร์ม POST มาแล้วเขียนลงชีตให้อัตโนมัติ

## ขั้นตอนติดตั้ง (ทำครั้งเดียว)

1. เปิด Google Sheet ที่ต้องการใช้เก็บข้อมูล (หรือสร้างไฟล์ใหม่)
2. เมนู **ส่วนขยาย (Extensions) > Apps Script**
3. ลบโค้ดตัวอย่างเดิมทั้งหมด แล้ววางโค้ดจากไฟล์ `apps-script/Code.gs` ลงไปแทน
4. กด **บันทึกโปรเจกต์** (ไอคอนแผ่นดิสก์)
5. กด **Deploy > New deployment**
6. ที่ "Select type" กดไอคอนเฟือง เลือก **Web app**
7. ตั้งค่า:
   - Execute as: **Me (อีเมลของคุณ)**
   - Who has access: **Anyone**
8. กด **Deploy** แล้วอนุญาต (Authorize) สิทธิ์การเข้าถึงตามที่ Google ขอ
9. คัดลอก **Web app URL** ที่ได้ (ขึ้นต้นด้วย `https://script.google.com/macros/s/.../exec`)
10. นำ URL ไปวางแทนที่ `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`
    ในไฟล์ `src/config.js` ของโปรเจกต์ Vue

```js
export const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/xxxxxxxxxxxxxxxx/exec'
```

11. บันทึกไฟล์ แล้วรัน/build โปรเจกต์ใหม่ (`npm run dev` หรือ `npm run build`)

เมื่อผู้ใช้กด **บันทึกข้อมูล** ในฟอร์ม ข้อมูลจะถูกส่งไปที่ Web App และเขียนเป็นแถวใหม่ในชีตชื่อ
`ข้อมูลแบบสำรวจ` โดยอัตโนมัติ (สร้างชีตและหัวตารางให้เองถ้ายังไม่มี)

## หมายเหตุ

- ถ้าภายหลังแก้โค้ดใน Apps Script ต้องกด **Deploy > Manage deployments > แก้ไข (ไอคอนดินสอ) >
  เปลี่ยน Version เป็น New version > Deploy** ทุกครั้ง ไม่เช่นนั้นการแก้ไขจะไม่มีผล
- ถ้ายังไม่ได้ตั้งค่า URL ฟอร์มจะดาวน์โหลดข้อมูลเป็นไฟล์ `.json` ให้แทน เพื่อไม่ให้ข้อมูลหาย
- ต้องการความปลอดภัยเพิ่มเติม (เช่น จำกัดเฉพาะโดเมนโรงเรียน) สามารถเพิ่มการตรวจสอบ token
  หรือ deploy เป็น "Anyone within [องค์กร]" แทน "Anyone" ได้ตามความเหมาะสม
