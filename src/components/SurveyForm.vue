<template>
  <v-container class="form-container py-6 py-sm-10" style="max-width: 900px">
    <v-card
      v-if="submitted"
      elevation="8"
      class="pa-6 pa-sm-10 text-center rounded-lg success-card"
    >
      <v-avatar color="success" size="88" class="mb-2">
        <v-icon color="white" size="52">mdi-check-bold</v-icon>
      </v-avatar>
      <div class="text-h5 font-weight-bold mt-4">บันทึกข้อมูลเรียบร้อยแล้ว</div>
      <div class="text-body-1 grey--text text--darken-1 mt-2">
        ขอบคุณที่ให้ความร่วมมือในการตอบแบบสำรวจ
      </div>
      <v-btn color="primary" large rounded elevation="2" class="mt-8 px-8" @click="startNewResponse">
        <v-icon left>mdi-refresh</v-icon>
        ส่งคำตอบเพิ่มอีกครั้ง
      </v-btn>
    </v-card>

    <v-card v-else elevation="8" class="pa-2 pa-sm-6 rounded-lg form-card">
      <v-card-text class="pt-4">
        <v-form ref="form" v-model="formValid" lazy-validation>
          <!-- 1. ชื่อโรงเรียน -->
          <section-header number="1" title="ชื่อโรงเรียน" required />
          <v-text-field
            v-model="form.schoolName"
            outlined
            dense
            rounded
            prepend-inner-icon="mdi-school-outline"
            placeholder="เช่น บ้านหนองหาน"
            :rules="[rules.required]"
            class="mb-4"
          />

          <!-- 2. อำเภอ -->
          <section-header number="2" title="อำเภอ" required />
          <v-select
            v-model="form.district"
            outlined
            rounded
            prepend-inner-icon="mdi-map-marker-outline"
            :items="districtOptions"
            placeholder="เลือกอำเภอ"
            :rules="[rules.required]"
            :menu-props="{ contentClass: 'district-select-menu', offsetY: true }"
            class="mb-4 district-select"
          />

          <!-- 3. ผู้เข้าร่วมประชุม 1 -->
          <section-header number="3" title="ชื่อ - สกุล ผู้เข้าร่วมประชุมคนที่ 1" />
          <v-row dense class="mb-2">
            <v-col cols="12" sm="7">
              <v-text-field
                v-model="form.participant1Name"
                outlined
                dense
                rounded
                prepend-inner-icon="mdi-account-outline"
                label="ชื่อ - สกุล"
              />
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="form.participant1Position"
                outlined
                dense
                rounded
                prepend-inner-icon="mdi-briefcase-outline"
                label="ตำแหน่ง"
              />
            </v-col>
          </v-row>

          <!-- 4. ผู้เข้าร่วมประชุม 2 -->
          <section-header number="4" title="ชื่อ - สกุล ผู้เข้าร่วมประชุมคนที่ 2" />
          <v-row dense class="mb-2">
            <v-col cols="12" sm="7">
              <v-text-field
                v-model="form.participant2Name"
                outlined
                dense
                rounded
                prepend-inner-icon="mdi-account-outline"
                label="ชื่อ - สกุล"
              />
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="form.participant2Position"
                outlined
                dense
                rounded
                prepend-inner-icon="mdi-briefcase-outline"
                label="ตำแหน่ง"
              />
            </v-col>
          </v-row>

          <!-- 5. ทะเบียนที่ราชพัสดุ -->
          <section-header number="5" title="ทะเบียนที่ราชพัสดุ อด." required />
          <v-text-field
            v-model="form.assetRegistrationNo"
            outlined
            dense
            rounded
            prepend-inner-icon="mdi-file-document-outline"
            placeholder="เช่น อด. 1234"
            :rules="[rules.required]"
            class="mb-4"
          />

          <!-- 6. ปัญหาและอุปสรรค -->
          <section-header
            number="6"
            title="ปัญหาและอุปสรรคในการดำเนินการเกี่ยวกับที่ราชพัสดุของโรงเรียน"
            required
            hint="เลือกได้มากกว่า 1 ข้อ และกรอกรายละเอียดของแต่ละข้อที่เลือก"
          />

          <v-alert
            v-if="showProblemsError"
            type="error"
            dense
            outlined
            class="mb-2"
          >
            กรุณาเลือกอย่างน้อย 1 ข้อ
          </v-alert>

          <v-card
            v-for="option in problemOptions"
            :key="option.id"
            outlined
            class="mb-2 problem-card"
            :class="{ 'problem-card--selected': form.selectedProblems.includes(option.id) }"
          >
            <v-checkbox
              v-model="form.selectedProblems"
              :value="option.id"
              dense
              hide-details
              class="ma-0 pa-3"
              color="primary"
            >
              <template #label>
                <v-icon
                  :color="form.selectedProblems.includes(option.id) ? 'primary' : 'grey'"
                  class="mr-2"
                >
                  {{ option.icon }}
                </v-icon>
                <span class="text-body-1">{{ option.id }}. {{ option.text }}</span>
              </template>
            </v-checkbox>
            <v-expand-transition>
              <div
                v-if="form.selectedProblems.includes(option.id)"
                class="px-4 pb-4"
              >
                <v-textarea
                  v-model="form.problemDetails[option.id]"
                  outlined
                  dense
                  rows="2"
                  auto-grow
                  label="รายละเอียดปัญหาและอุปสรรคของข้อนี้"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </div>
            </v-expand-transition>
          </v-card>

          <!-- 7. ข้อเสนอแนะ -->
          <section-header
            number="7"
            title="ข้อเสนอแนะหรือแนวทางการแก้ไขปัญหาของโรงเรียน"
            hint="โรงเรียนสามารถระบุข้อเสนอแนะ หรือแนวทางการแก้ไขปัญหา ที่ประสงค์ให้สำนักงานเขตพื้นที่ดำเนินการ"
            class="mt-4"
          />
          <v-textarea
            v-model="form.suggestion"
            outlined
            dense
            rounded
            rows="4"
            auto-grow
            prepend-inner-icon="mdi-lightbulb-outline"
            placeholder="ระบุข้อเสนอแนะ..."
          />

          <v-alert v-if="submitError" type="error" dense outlined class="mt-4">
            {{ submitError }}
          </v-alert>

          <v-divider class="my-6" />

          <div class="d-flex flex-wrap justify-end" style="gap: 8px">
            <v-btn text rounded @click="resetForm" :disabled="submitting">ล้างแบบฟอร์ม</v-btn>
            <v-btn
              color="primary"
              rounded
              large
              elevation="2"
              class="px-8"
              :loading="submitting"
              @click="submitForm"
            >
              <v-icon left>mdi-content-save-outline</v-icon>
              บันทึกข้อมูล
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { GOOGLE_SHEET_WEBAPP_URL } from '../config'
import SectionHeader from './SectionHeader.vue'

const PROBLEM_OPTIONS = [
  { id: 1, text: 'การขึ้นทะเบียนอาคาร สิ่งปลูกสร้างในที่ราชพัสดุ', icon: 'mdi-domain' },
  { id: 2, text: 'การขออนุญาตรื้อถอนอาคาร สิ่งปลูกสร้าง ตัดต้นไม้ หรือขุดดิน ในที่ราชพัสดุ', icon: 'mdi-hammer-wrench' },
  { id: 3, text: 'การจำหน่ายอาคาร สิ่งปลูกสร้าง ต้นไม้ ดิน ในที่ราชพัสดุ', icon: 'mdi-cash-check' },
  { id: 4, text: 'การนำวัสดุที่ได้จากการรื้อถอนไปใช้ประโยชน์', icon: 'mdi-recycle' },
  { id: 5, text: 'การส่งคืน/ถ่ายโอนที่ราชพัสดุ', icon: 'mdi-swap-horizontal' },
  { id: 6, text: 'สิ่งปลูกสร้างไม่ตรงตามทะเบียนที่ราชพัสดุ', icon: 'mdi-file-alert-outline' },
  { id: 7, text: 'การสำรวจและรายงานไม้มีค่าในที่ราชพัสดุ', icon: 'mdi-tree-outline' },
  { id: 8, text: 'เนื้อที่ครอบครองไม่ตรงตามทะเบียนที่ราชพัสดุ', icon: 'mdi-map-marker-distance' },
  { id: 9, text: 'การชี้แนวเขตและรับรองเขตที่ดิน', icon: 'mdi-map-marker-radius-outline' },
  { id: 10, text: 'อาคาร สิ่งปลูกสร้าง เกิดเหตุเพลิงไหม้', icon: 'mdi-fire' },
  { id: 11, text: 'กรณีมีการบุกรุกในที่ราชพัสดุ', icon: 'mdi-account-alert-outline' },
  { id: 12, text: 'การจัดหารายได้ในที่ราชพัสดุของโรงเรียน', icon: 'mdi-cash-multiple' },
  { id: 13, text: 'กรณีอื่น ๆ ที่เกิดขึ้นในที่ราชพัสดุของโรงเรียน', icon: 'mdi-dots-horizontal-circle-outline' }
]

const DISTRICT_OPTIONS = [
  'หนองหาน',
  'บ้านดุง',
  'กู่แก้ว',
  'ไชยวาน',
  'ทุ่งฝน',
  'พิบูลย์รักษ์'
]

function emptyForm() {
  return {
    schoolName: '',
    district: null,
    participant1Name: '',
    participant1Position: '',
    participant2Name: '',
    participant2Position: '',
    assetRegistrationNo: '',
    selectedProblems: [],
    problemDetails: {},
    suggestion: ''
  }
}

export default {
  name: 'SurveyForm',
  components: { SectionHeader },
  data() {
    return {
      form: emptyForm(),
      formValid: true,
      problemOptions: PROBLEM_OPTIONS,
      districtOptions: DISTRICT_OPTIONS,
      showProblemsError: false,
      submitting: false,
      submitError: '',
      submitted: false,
      rules: {
        required: (v) => (v !== null && v !== undefined && String(v).trim() !== '') || 'กรุณากรอกข้อมูลนี้'
      }
    }
  },
  methods: {
    resetForm() {
      this.form = emptyForm()
      this.submitError = ''
      this.showProblemsError = false
      this.$refs.form.resetValidation()
    },
    startNewResponse() {
      this.submitError = ''
      this.showProblemsError = false
      this.submitted = false
    },
    buildPayload() {
      const problems = this.problemOptions.map((option) => ({
        id: option.id,
        text: option.text,
        selected: this.form.selectedProblems.includes(option.id),
        detail: this.form.selectedProblems.includes(option.id)
          ? (this.form.problemDetails[option.id] || '').trim()
          : ''
      }))

      return {
        timestamp: new Date().toISOString(),
        schoolName: this.form.schoolName.trim(),
        district: this.form.district,
        participant1Name: this.form.participant1Name.trim(),
        participant1Position: this.form.participant1Position.trim(),
        participant2Name: this.form.participant2Name.trim(),
        participant2Position: this.form.participant2Position.trim(),
        assetRegistrationNo: this.form.assetRegistrationNo.trim(),
        problems,
        suggestion: this.form.suggestion.trim()
      }
    },
    async submitForm() {
      this.submitError = ''
      this.showProblemsError = false

      const isFormValid = this.$refs.form.validate()
      const hasProblem = this.form.selectedProblems.length > 0

      if (!hasProblem) {
        this.showProblemsError = true
      }

      if (!isFormValid || !hasProblem) {
        this.$vuetify.goTo(0)
        return
      }

      const payload = this.buildPayload()

      if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL.includes('PASTE_YOUR')) {
        this.submitError =
          'ยังไม่ได้ตั้งค่า URL สำหรับบันทึกลง Google Sheet (ดูวิธีตั้งค่าใน apps-script/README.md) — ระบบจะดาวน์โหลดข้อมูลเป็นไฟล์ JSON ให้แทน'
        this.downloadAsJson(payload)
        return
      }

      this.submitting = true
      try {
        await fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        })
        this.resetForm()
        this.submitted = true
      } catch (err) {
        this.submitError = 'บันทึกลง Google Sheet ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือดาวน์โหลดข้อมูลสำรองไว้ก่อน'
        this.downloadAsJson(payload)
      } finally {
        this.submitting = false
      }
    },
    downloadAsJson(payload) {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `survey-${payload.schoolName || 'data'}-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style scoped>
.form-card,
.success-card {
  background-color: #fff;
}

.problem-card {
  border-radius: 12px !important;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.problem-card--selected {
  border-color: #0d47a1 !important;
  background-color: #e8f0fb;
}

.form-card ::v-deep .v-label,
.form-card ::v-deep input,
.form-card ::v-deep textarea,
.form-card ::v-deep .v-select__selection,
.form-card ::v-deep .v-messages,
.form-card ::v-deep .v-btn__content {
  font-size: 1rem;
}

.district-select ::v-deep .v-select__selection {
  font-size: 1.05rem;
  font-weight: 600;
  color: #0d47a1;
}

.district-select ::v-deep .v-input__icon--append .v-icon,
.district-select ::v-deep .v-input__icon--prepend-inner .v-icon {
  color: #0d47a1;
}
</style>

<style>
.district-select-menu {
  border-radius: 14px !important;
  overflow: hidden;
}

.district-select-menu .v-list {
  padding: 6px;
}

.district-select-menu .v-list-item {
  min-height: 46px;
  border-radius: 10px;
  margin-bottom: 2px;
}

.district-select-menu .v-list-item__title {
  font-size: 1.05rem;
}

.district-select-menu .v-list-item--active {
  background-color: #e8f0fb;
}

.district-select-menu .v-list-item--active .v-list-item__title {
  color: #0d47a1;
  font-weight: 700;
}
</style>
