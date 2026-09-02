<template>
  <div class="expert-page">
    <!-- แบนเนอร์หัวเรื่อง -->
    <div class="banner">
      <v-container class="py-8 py-sm-10 text-center">
        <div class="d-flex flex-column align-center">
          <v-avatar size="104" class="banner-logo mb-3" tile>
            <v-img :src="logo" contain />
          </v-avatar>
          <div class="text-h5 text-sm-h4 font-weight-bold banner-title">
            การประเมินข้าราชการครูและบุคลากรทางการศึกษาเพื่อเลื่อนวิทยฐานะ
          </div>
          <div class="text-h5 text-sm-h4 font-weight-bold banner-title">
            {{ positionTitle }}
          </div>
        </div>

        <div class="portrait-frame mx-auto mt-4">
          <div class="portrait-frame__inner">
            <v-img :src="portrait" position="center 3%" class="portrait-frame__img" />
          </div>
        </div>

        <div class="by-chip mt-4">โดย {{ fullName }}</div>

        <div class="position-info__row mt-3">
          <v-icon small color="#0D47A1" class="mr-2">mdi-account-tie</v-icon>
          {{ currentPosition }}
        </div>
        <div class="position-info__row position-info__row--muted">
          <v-icon small color="#B8860B" class="mr-2">mdi-domain</v-icon>
          สังกัด {{ affiliation }}
        </div>
      </v-container>
    </div>

    <!-- ผลงาน -->
    <v-container class="content-lift pb-10" style="max-width: 980px">
      <div class="works-header">
        <span class="works-header__line"></span>
        <div class="works-header__badge">
          <v-icon color="#B8860B" size="28">mdi-trophy-award</v-icon>
          <span class="works-header__text">ผลงาน</span>
          <v-icon color="#B8860B" size="28">mdi-trophy-award</v-icon>
        </div>
        <span class="works-header__line"></span>
      </div>

      <!-- ด้านที่ 1 และ ด้านที่ 2 -->
      <v-card
        v-for="field in fields"
        :key="field.id"
        elevation="6"
        class="field-card rounded-xl mb-6"
      >
        <div class="field-header" :style="{ background: field.color }">
          <div class="field-header__badge">{{ field.number }}</div>
          <div>
            <div class="field-header__title">{{ field.title }}</div>
            <div class="field-header__subtitle">{{ field.subtitle }}</div>
          </div>
        </div>

        <div class="field-body">
          <div class="subsection-header subsection-header--doc">
            <v-icon small color="#0D47A1">mdi-file-document-outline</v-icon>
            เอกสาร
          </div>
          <a
            v-for="(item, idx) in field.items"
            :key="'doc-' + item.text"
            class="item-row"
            :href="item.docUrl || null"
            :target="item.docUrl ? '_blank' : null"
            rel="noopener"
          >
            <span class="item-row__number" :style="{ background: field.accent }">{{ idx + 1 }}</span>
            <span class="item-row__text">{{ item.text }}</span>
            <v-icon small class="item-row__icon" :color="item.docUrl ? field.accent : '#ccc'">mdi-open-in-new</v-icon>
          </a>
          <a
            class="bibliography-link"
            :href="field.docBibliographyUrl || null"
            :target="field.docBibliographyUrl ? '_blank' : null"
            rel="noopener"
          >
            <v-icon small color="#0D47A1" class="mr-2">mdi-book-open-variant</v-icon>
            บรรณานุกรม
          </a>

          <div class="subsection-header subsection-header--present mt-6">
            <v-icon small color="#00695C">mdi-monitor-screenshot</v-icon>
            การนำเสนอ
          </div>
          <a
            v-for="(item, idx) in field.items"
            :key="'present-' + item.text"
            class="item-row"
            :href="item.presentUrl || null"
            :target="item.presentUrl ? '_blank' : null"
            rel="noopener"
          >
            <span class="item-row__number" style="background: #00897b">{{ idx + 1 }}</span>
            <span class="item-row__text">{{ item.text }}</span>
            <v-icon small class="item-row__icon" :color="item.presentUrl ? '#00897B' : '#ccc'">mdi-open-in-new</v-icon>
          </a>
          <a
            class="bibliography-link"
            :href="field.presentBibliographyUrl || null"
            :target="field.presentBibliographyUrl ? '_blank' : null"
            rel="noopener"
          >
            <v-icon small color="#00695C" class="mr-2">mdi-book-open-variant</v-icon>
            บรรณานุกรม
          </a>
        </div>
      </v-card>

      <!-- วิจัย -->
      <v-card elevation="6" class="field-card rounded-xl mb-6">
        <div class="field-header" :style="{ background: research.color }">
          <v-icon size="30" color="white" class="field-header__icon">mdi-flask-outline</v-icon>
          <div>
            <div class="field-header__title">{{ research.title }}</div>
          </div>
        </div>

        <div class="field-body">
          <div class="subsection-header subsection-header--doc">
            <v-icon small color="#0D47A1">mdi-file-document-outline</v-icon>
            เอกสาร
          </div>

          <a
            v-for="(item, idx) in research.chapters"
            :key="item.text"
            class="item-row"
            :href="item.url || null"
            :target="item.url ? '_blank' : null"
            rel="noopener"
          >
            <span class="item-row__number" style="background: #4a148c">{{ idx + 1 }}</span>
            <span class="item-row__text">{{ item.text }}</span>
            <v-icon small class="item-row__icon" :color="item.url ? '#4A148C' : '#ccc'">mdi-open-in-new</v-icon>
          </a>

          <ul class="appendix-list">
            <li v-for="item in research.appendices" :key="item.text">
              <a :href="item.url || null" :target="item.url ? '_blank' : null" rel="noopener">{{ item.text }}</a>
            </li>
          </ul>

          <a
            class="bibliography-link"
            :href="research.bibliographyUrl || null"
            :target="research.bibliographyUrl ? '_blank' : null"
            rel="noopener"
          >
            <v-icon small color="#4A148C" class="mr-2">mdi-book-open-variant</v-icon>
            {{ research.bibliographyLabel }}
          </a>

          <div class="subsection-header subsection-header--present mt-6">
            <v-icon small color="#00695C">mdi-monitor-screenshot</v-icon>
            การนำเสนอ
          </div>

          <a
            class="presentation-banner"
            :href="research.presentationUrl || null"
            :target="research.presentationUrl ? '_blank' : null"
            rel="noopener"
          >
            <v-icon color="#4A148C" size="26" class="mr-3">mdi-monitor-screenshot</v-icon>
            <span>การนำเสนอ : {{ research.title }}</span>
          </a>
        </div>
      </v-card>

      <!-- คู่มือ -->
      <v-card elevation="6" class="field-card rounded-xl">
        <div class="field-header" :style="{ background: manual.color }">
          <v-icon size="30" color="white" class="field-header__icon">mdi-book-open-page-variant-outline</v-icon>
          <div>
            <div class="field-header__title">{{ manual.title }}</div>
          </div>
        </div>

        <div class="field-body">
          <div class="subsection-header subsection-header--present">
            <v-icon small color="#00695C">mdi-monitor-screenshot</v-icon>
            การนำเสนอ
          </div>

          <a
            class="presentation-banner presentation-banner--gold"
            :href="manual.url || null"
            :target="manual.url ? '_blank' : null"
            rel="noopener"
          >
            <v-icon color="#B8860B" size="26" class="mr-3">mdi-monitor-screenshot</v-icon>
            <span>การนำเสนอ : {{ manual.title }}</span>
          </a>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import logo from '../assets/logo_udn3.png'
import portrait from '../assets/person.jpg'

function fileItem(text) {
  return { text, docUrl: '', presentUrl: '' }
}

// ฝั่งเอกสารและการนำเสนอของด้านที่ 1 ทั้งหมดย้ายไปเป็นลิงก์ Google Drive แล้ว
// (ดู FIELD1_DOC_URL_OVERRIDES / FIELD1_PRESENT_URL_OVERRIDES ด้านล่าง)

// ฝั่งเอกสารและการนำเสนอของด้านที่ 2 ทั้งหมดย้ายไปเป็นลิงก์ Google Drive แล้ว
const FIELD2_DOC_URL_OVERRIDES = {
  'ผลลัพธ์ที่เกิดกับผู้เรียน นักศึกษา หรือผู้รับบริการ': 'https://drive.google.com/file/d/1ZzACpIu8QUIk9kg6MQPsuT9hjQPkJvir/view',
  'ผลลัพธ์ที่เกิดกับข้าราชการครูและบุคลากรทางการศึกษา': 'https://drive.google.com/file/d/11N7tkjDcLZo1EltyyLrzDj_Jkah71QtM/view',
  'ผลลัพธ์ที่เกิดกับสถานศึกษาและหน่วยงานการศึกษาในพื้นที่รับผิดชอบ': 'https://drive.google.com/file/d/1F7M0t8eLscPWDA2wWeUWmo1WrKQgvO2y/view'
}

const FIELD2_DOC_BIBLIOGRAPHY_URL = 'https://drive.google.com/file/d/1bDldTpI0KjVUPKhZozkGxe_ZCAkr_Zin/view'

const FIELD2_PRESENT_URL_OVERRIDES = {
  'ผลลัพธ์ที่เกิดกับผู้เรียน นักศึกษา หรือผู้รับบริการ': 'https://drive.google.com/file/d/1oxUAf7R275h-y19EBVG2yPk6Rjft4Onb/view',
  'ผลลัพธ์ที่เกิดกับข้าราชการครูและบุคลากรทางการศึกษา': 'https://drive.google.com/file/d/1h5vlHiFFRNP3dw69Qu9mcQJtOB3SOSSF/view'
}

// ไฟล์ฝั่งเอกสารของด้านที่ 1 ทั้งหมดย้ายไปโฮสต์บน Google Drive แทนการรวมไว้ในเว็บโดยตรง
const FIELD1_DOC_URL_OVERRIDES = {
  'ตัวชี้วัดที่ 1 การส่งเสริมผู้เรียน': 'https://drive.google.com/file/d/1hfG_2mVILYDMwysVVitg6DiD5DSmrgxT/view',
  'ตัวชี้วัดที่ 2 คุณภาพหลักสูตรและคุณภาพผู้เรียน': 'https://drive.google.com/file/d/1lyhiN5uEetOwX_uJMhA2faFVOKE5vimi/view',
  'ตัวชี้วัดที่ 3 การพัฒนาสมรรถนะ': 'https://drive.google.com/file/d/13zdygo0CM2oP7G3lM0YlF4ZZOkMTJSHB/view',
  'ตัวชี้วัดที่ 4 การเป็นที่ปรึกษาและพี่เลี้ยง': 'https://drive.google.com/file/d/1_gQgnKal-La952uYqAaMSMlsq0o-6TEh/view',
  'ตัวชี้วัดที่ 5 กระบวนการทำงาน': 'https://drive.google.com/file/d/1u6dqkmE3mrgJZmYUiz9s-8BYCzxG7i0N/view',
  'ตัวชี้วัดที่ 6 การสร้างสรรค์นวัตกรรม': 'https://drive.google.com/file/d/1I8je6ZvpkLYWuUeHrfXRikFpshnuVnot/view',
  'ตัวชี้วัดที่ 7 การประสานความร่วมมือ': 'https://drive.google.com/file/d/1A7vV4mIrRqcKTkeDLFBP76gbF62Xkf9O/view',
  'ตัวชี้วัดที่ 8 ความเป็นผู้นำ': 'https://drive.google.com/file/d/1ajHGREWHtTKODBjO9uKbHt0E5kPRjRi6/view'
}

const FIELD1_DOC_BIBLIOGRAPHY_URL = 'https://drive.google.com/file/d/1xSAweQCtyaTKib0iU3h2_ngranlpfFnL/view'

const FIELD1_PRESENT_URL_OVERRIDES = {
  'ตัวชี้วัดที่ 1 การส่งเสริมผู้เรียน': 'https://drive.google.com/file/d/1KSXip3o-xe0KFgn1UrhxLj9b3mMHFdVv/view',
  'ตัวชี้วัดที่ 2 คุณภาพหลักสูตรและคุณภาพผู้เรียน': 'https://drive.google.com/file/d/1C4_T0FS7qKI7DpY2br4z-8g4dc91vqP-/view',
  'ตัวชี้วัดที่ 3 การพัฒนาสมรรถนะ': 'https://drive.google.com/file/d/1nGat3wOy2W8wYJZqkhNNxG__ujmnJQk5/view',
  'ตัวชี้วัดที่ 4 การเป็นที่ปรึกษาและพี่เลี้ยง': 'https://drive.google.com/file/d/1RDUfguyzGBCue7d5D6-mXPQxOtJpF10t/view',
  'ตัวชี้วัดที่ 5 กระบวนการทำงาน': 'https://drive.google.com/file/d/1Xdtt9EW50eQxvl7jA-E3kgLoXJezNAGA/view',
  'ตัวชี้วัดที่ 6 การสร้างสรรค์นวัตกรรม': 'https://drive.google.com/file/d/1H6vRfp3clKvk2ZuqAPDSqEAYVwNOFT_F/view',
  'ตัวชี้วัดที่ 7 การประสานความร่วมมือ': 'https://drive.google.com/file/d/1jv8gBTND5XDdqGt50MJSeb5Ur9hO0hVx/view',
  'ตัวชี้วัดที่ 8 ความเป็นผู้นำ': 'https://drive.google.com/file/d/1Yz-RSsiiTa3vaN1f478J1pnKfNUnB1Ja/view'
}

const FIELD_ITEMS = [
  fileItem('ตัวชี้วัดที่ 1 การส่งเสริมผู้เรียน'),
  fileItem('ตัวชี้วัดที่ 2 คุณภาพหลักสูตรและคุณภาพผู้เรียน'),
  fileItem('ตัวชี้วัดที่ 3 การพัฒนาสมรรถนะ'),
  fileItem('ตัวชี้วัดที่ 4 การเป็นที่ปรึกษาและพี่เลี้ยง'),
  fileItem('ตัวชี้วัดที่ 5 กระบวนการทำงาน'),
  fileItem('ตัวชี้วัดที่ 6 การสร้างสรรค์นวัตกรรม'),
  fileItem('ตัวชี้วัดที่ 7 การประสานความร่วมมือ'),
  fileItem('ตัวชี้วัดที่ 8 ความเป็นผู้นำ')
].map((item) => ({
  ...item,
  docUrl: FIELD1_DOC_URL_OVERRIDES[item.text] || '',
  presentUrl: FIELD1_PRESENT_URL_OVERRIDES[item.text] || ''
}))

const FIELD2_ITEMS = [
  fileItem('ผลลัพธ์ที่เกิดกับผู้เรียน นักศึกษา หรือผู้รับบริการ'),
  fileItem('ผลลัพธ์ที่เกิดกับข้าราชการครูและบุคลากรทางการศึกษา'),
  fileItem('ผลลัพธ์ที่เกิดกับสถานศึกษาและหน่วยงานการศึกษาในพื้นที่รับผิดชอบ')
].map((item) => ({
  ...item,
  docUrl: FIELD2_DOC_URL_OVERRIDES[item.text] || '',
  presentUrl: FIELD2_PRESENT_URL_OVERRIDES[item.text] || ''
}))

const FIELDS = [
  {
    id: 'field1',
    number: '1',
    title: 'ด้านที่ 1',
    subtitle: 'ด้านทักษะการวางแผนกลยุทธ์การใช้เครื่องมือหรือนวัตกรรมทางการบริหาร',
    color: 'linear-gradient(135deg, #0D47A1, #1565C0)',
    accent: '#0D47A1',
    items: FIELD_ITEMS,
    docBibliographyUrl: FIELD1_DOC_BIBLIOGRAPHY_URL,
    presentBibliographyUrl: ''
  },
  {
    id: 'field2',
    number: '2',
    title: 'ด้านที่ 2',
    subtitle:
      'ด้านผลลัพธ์ในการพัฒนาคุณภาพผู้เรียน ข้าราชการครูและบุคลากรทางการศึกษาสถานศึกษา และหน่วยงานการศึกษาในพื้นที่รับผิดชอบ',
    color: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
    accent: '#1B5E20',
    items: FIELD2_ITEMS,
    docBibliographyUrl: FIELD2_DOC_BIBLIOGRAPHY_URL,
    presentBibliographyUrl: ''
  }
]

// ไฟล์ทั้งหมดของหัวข้อวิจัย (เอกสารและการนำเสนอ) ย้ายไปเป็นลิงก์ Google Drive แล้ว
function researchItem(text, url) {
  return { text, url }
}

const RESEARCH = {
  title: 'วิจัย',
  color: 'linear-gradient(135deg, #4A148C, #6A1B9A)',
  bibliographyLabel: 'รวมเล่มรายงานการวิจัยฯ',
  bibliographyUrl: 'https://drive.google.com/file/d/1PbJ04mu6ge4ip2lwdJH-W_FzVKp2Bjs_/view',
  presentationUrl: 'https://drive.google.com/file/d/1SyMrgAJ8to7FB4jwFRQIPITNsS2SLDd4/view',
  chapters: [
    researchItem('บทที่ 1 บทนำ', 'https://drive.google.com/file/d/16zHL6sOe2xycqEUhQSlEXUcZUS2OHqqC/view'),
    researchItem('บทที่ 2 เอกสารงานวิจัยที่เกี่ยวข้อง', 'https://drive.google.com/file/d/111erojq8W6S18W85WCVsnjk7yV9JMKLj/view'),
    researchItem('บทที่ 3 วิธีดำเนินการวิจัย', 'https://drive.google.com/file/d/1WwHE2eMmJWpp-5KeJyEYjWCSD0Jc3K90/view'),
    researchItem('บทที่ 4 ผลการวิเคราะห์ข้อมูล', 'https://drive.google.com/file/d/1wz8ITlak878ce6MnDprPaa9FqSBvVRHo/view'),
    researchItem('บทที่ 5 สรุป อภิปรายผล และข้อเสนอแนะ', 'https://drive.google.com/file/d/1J49Ekmkoaz_1c70NLUusSYNOVY-S7T-E/view')
  ],
  appendices: [
    researchItem('บรรณานุกรม', 'https://drive.google.com/file/d/1c2E-6R7kG8v9avWTdUwm0uafBIrwZYJw/view'),
    researchItem('ภาคผนวก ก - ค', 'https://drive.google.com/file/d/1Ca43WFA3AAzPXYnD4gv6QVigDs6Qr07i/view'),
    researchItem('ภาคผนวก ง', 'https://drive.google.com/file/d/14qpdG4yxKGpBKvfvrSEE-YDVldk7Kaxm/view'),
    researchItem('ภาคผนวก จ', 'https://drive.google.com/file/d/1voL8W5li19n9JFfUqd5K_6FQxiDQym5B/view'),
    researchItem('ภาคผนวก ฉ', 'https://drive.google.com/file/d/14XafZHJbUJ62gNgIFXSAmqzBQU5myu3p/view')
  ]
}

// ไฟล์การนำเสนอของคู่มือย้ายไปเป็นลิงก์ Google Drive แล้ว
const MANUAL = {
  title: 'คู่มือ',
  color: 'linear-gradient(135deg, #C9A227, #E0B93A)',
  url: 'https://drive.google.com/file/d/10Fdgpwp1SFL0VHoToLFhgrnmVjEJgL_N/view'
}

export default {
  name: 'Udn3ExpertView',
  data() {
    return {
      logo,
      portrait,
      fullName: 'นางแสงเดือน สุขรมย์',
      positionTitle: 'รองผู้อำนวยการสำนักงานเขตพื้นที่การศึกษาเชี่ยวชาญ',
      currentPosition: 'รองผู้อำนวยการเขตพื้นที่การศึกษาประถมศึกษาอุดรธานี เขต 3',
      affiliation: 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน',
      fields: FIELDS,
      research: RESEARCH,
      manual: MANUAL
    }
  }
}
</script>

<style scoped>
.expert-page {
  background-color: #f4f6fb;
}

.banner {
  background: linear-gradient(120deg, #eaf2ff 0%, #ffffff 55%, #fff7e0 100%);
  border-bottom: 4px solid;
  border-image: linear-gradient(90deg, #0d47a1, #c9a227) 1;
}

.banner-logo {
  flex: none;
}

.banner-title {
  color: #0d47a1;
  line-height: 1.35;
}

.by-chip {
  display: inline-block;
  background: #0d47a1;
  color: #fff;
  font-weight: 700;
  border-radius: 999px;
  padding: 6px 20px;
  font-size: 0.95rem;
}

.position-info__row {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: #16294f;
}

.position-info__row--muted {
  font-size: 0.85rem;
  font-weight: 500;
  font-style: italic;
  color: #7a6a3f;
  margin-top: 4px;
}

.portrait-frame {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d47a1, #c9a227);
  padding: 4px;
}

.portrait-frame__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
}

.portrait-frame__img {
  width: 100%;
  height: 100%;
}

.content-lift {
  margin-top: -12px;
  position: relative;
  z-index: 1;
}

.works-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 8px 0 24px;
}

.works-header__line {
  flex: 1 1 auto;
  max-width: 140px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #c9a227, transparent);
}

.works-header__badge {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.works-header__text {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0d47a1;
  letter-spacing: 0.02em;
}

.field-card {
  border-radius: 18px !important;
  overflow: hidden;
}

.field-header {
  color: #fff;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.field-header__badge {
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  border: 2px solid rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
}

.field-header__icon {
  flex: none;
}

.field-header__title {
  font-weight: 800;
  font-size: 1.25rem;
}

.field-header__subtitle {
  font-size: 0.88rem;
  opacity: 0.92;
  margin-top: 4px;
}

.field-body {
  padding: 20px 24px;
}

.subsection-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.98rem;
  font-weight: 800;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 10px;
}

.subsection-header--doc {
  background: #e3ecfa;
  color: #0d47a1;
}

.subsection-header--present {
  background: #e0f2ef;
  color: #00695c;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 4px;
  border-bottom: 1px solid #f0f0f0;
  text-decoration: none;
  color: inherit;
  border-radius: 6px;
  transition: background 0.12s ease;
}

.item-row:last-of-type {
  border-bottom: none;
}

.item-row[href] {
  cursor: pointer;
}

.item-row[href]:hover {
  background: #f5f7fb;
  padding-left: 8px;
  padding-right: 8px;
}

.item-row:not([href]) .item-row__text {
  color: #999;
}

.item-row__number {
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-row:not([href]) .item-row__number {
  opacity: 0.5;
}

.item-row__text {
  flex: 1;
  font-size: 0.98rem;
  color: #2a2a2a;
  font-weight: 500;
}

.item-row__icon {
  flex: none;
}

.appendix-list {
  list-style: disc;
  padding-left: 34px;
  margin: 8px 0 16px;
  color: #2a2a2a;
  font-size: 0.98rem;
  font-weight: 500;
}

.appendix-list li {
  padding: 3px 0;
}

.appendix-list a {
  color: inherit;
  text-decoration: none;
}

.appendix-list a[href] {
  cursor: pointer;
}

.appendix-list a[href]:hover {
  color: #0d47a1;
  text-decoration: underline;
}

.bibliography-link {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0d47a1;
  text-decoration: none;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 8px;
}

.bibliography-link[href] {
  cursor: pointer;
}

.bibliography-link[href]:hover {
  text-decoration: underline;
}

.bibliography-link:not([href]) {
  color: #999;
}

.presentation-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3e9fb;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  font-weight: 700;
  color: #4a148c;
  font-size: 1rem;
  text-decoration: none;
}

.presentation-banner[href] {
  cursor: pointer;
}

.presentation-banner[href]:hover {
  filter: brightness(0.97);
}

.presentation-banner:not([href]) {
  opacity: 0.55;
}

.presentation-banner--gold {
  background: #fdf6e3;
  color: #7a5c00;
}

</style>
