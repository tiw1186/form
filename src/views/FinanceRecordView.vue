<template>
  <div class="finance-page">
    <div class="hero">
      <v-container class="py-8 py-sm-10">
        <div class="d-flex align-center" style="gap: 16px">
          <div class="hero-icon">
            <v-icon color="white" size="26">mdi-bank</v-icon>
          </div>
          <div>
            <div class="hero-eyebrow">Daily School Finance Record</div>
            <div class="text-h5 text-sm-h4 font-weight-bold white--text">
              ระบบกรอกเงินคงเหลือประจำวันโรงเรียน
            </div>
          </div>
        </div>
        <div class="hero-subtitle mt-2">
          ค้นหาโรงเรียน กรอกยอดเงิน และบันทึกข้อมูลประจำวันลงในตารางของโรงเรียน
        </div>
      </v-container>
    </div>

    <v-container class="content-lift pb-10" style="max-width: 1180px">
      <v-card
        v-if="submitted"
        elevation="8"
        class="pa-6 pa-sm-10 text-center rounded-xl success-card"
      >
        <v-avatar color="#1F6F4A" size="88" class="mb-2 success-pulse">
          <v-icon color="white" size="52">mdi-check-bold</v-icon>
        </v-avatar>
        <div class="text-h5 font-weight-bold mt-4">บันทึกข้อมูลเรียบร้อยแล้ว</div>
        <div class="text-body-1 grey--text text--darken-1 mt-2">
          บันทึกเงินคงเหลือประจำวันเรียบร้อยแล้ว
        </div>
        <div class="d-flex flex-wrap justify-center mt-5" style="gap: 8px">
          <v-chip color="#1F6F4A" outlined label text-color="#1F6F4A">
            <v-icon left small color="#1F6F4A">mdi-school-outline</v-icon>{{ lastSavedSchool }}
          </v-chip>
          <v-chip outlined label>
            <v-icon left small>mdi-calendar-outline</v-icon>{{ lastSavedDateDisplay }}
          </v-chip>
          <v-chip color="#1F6F4A" outlined label text-color="#1F6F4A">
            <v-icon left small color="#1F6F4A">mdi-cash-multiple</v-icon>฿ {{ formatCurrency(lastSavedTotal) }}
          </v-chip>
        </div>
        <v-btn class="save-btn mt-8 px-8" dark large rounded elevation="2" @click="startNewResponse">
          <v-icon left>mdi-plus</v-icon>
          บันทึกรายการถัดไป
        </v-btn>
      </v-card>

      <v-row v-else dense>
        <!-- เลือกโรงเรียน -->
        <v-col cols="12" md="4" lg="3">
          <v-card elevation="6" class="sidebar-card rounded-xl">
            <div class="pa-4">
              <div class="d-flex align-center mb-1">
                <v-avatar size="28" color="#E7F2EA" class="mr-2">
                  <v-icon small color="#1F6F4A">mdi-office-building-outline</v-icon>
                </v-avatar>
                <span class="text-subtitle-1 font-weight-bold">เลือกโรงเรียน</span>
              </div>
              <div class="text-caption grey--text text--darken-1 mb-3">
                พิมพ์ชื่อ กลุ่ม หรือเลขลำดับเพื่อค้นหา
              </div>

              <v-text-field
                v-model="schoolSearchQuery"
                dense
                outlined
                rounded
                hide-details
                prepend-inner-icon="mdi-magnify"
                placeholder="ค้นหารายชื่อโรงเรียน"
                class="mb-3"
              />

              <div v-if="selectedSchool" class="selected-school-chip mb-3">
                โรงเรียนที่เลือก: <strong>{{ selectedSchoolDisplay }}</strong>
              </div>

              <v-alert v-if="schoolsError" type="warning" dense outlined class="mb-3 rounded-lg">
                {{ schoolsError }}
              </v-alert>

              <div class="text-center py-6" v-if="schoolsLoading">
                <v-progress-circular indeterminate color="#1F6F4A" size="28" />
              </div>
              <div v-else class="school-list">
                <button
                  v-for="school in filteredSchools"
                  :key="school.number"
                  type="button"
                  class="school-item"
                  :class="{ 'school-item--active': school.name === selectedSchool }"
                  @click="selectedSchool = school.name"
                >
                  <span class="school-item__number">{{ school.number }}</span>
                  <span class="school-item__dot">·</span>
                  <span class="school-item__name">{{ school.name }}</span>
                </button>

                <div v-if="!filteredSchools.length && !schoolSearchQuery.trim()" class="text-caption grey--text text-center py-4">
                  ไม่พบรายชื่อโรงเรียน
                </div>
                <div v-else-if="!filteredSchools.length" class="text-center py-3">
                  <div class="text-caption grey--text mb-2">ไม่พบโรงเรียนที่ค้นหา</div>
                  <v-btn small text color="#1F6F4A" @click="selectedSchool = schoolSearchQuery.trim()">
                    ใช้ชื่อ "{{ schoolSearchQuery.trim() }}"
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- แบบบันทึกประจำวัน -->
        <v-col cols="12" md="8" lg="9">
          <v-card elevation="6" class="form-card rounded-xl">
            <div class="d-flex justify-space-between align-start flex-wrap pa-4 pa-sm-6 pb-4" style="gap: 16px">
              <div>
                <div class="panel-eyebrow">แบบบันทึกประจำวัน</div>
                <div class="text-h6 text-sm-h5 font-weight-bold">รายละเอียดเงินตามประเภท</div>
              </div>
              <div>
                <div class="text-caption grey--text text-right mb-1">วันที่บันทึก</div>
                <v-text-field
                  :value="displayDate"
                  dense
                  outlined
                  rounded
                  readonly
                  disabled
                  hide-details
                  append-icon="mdi-lock-outline"
                  style="width: 170px"
                  class="locked-date-field"
                  title="วันที่บันทึกล็อคเป็นวันที่ปัจจุบัน"
                />
              </div>
            </div>

            <v-divider />

            <v-form ref="form" v-model="formValid" lazy-validation>
              <!-- รายการเงินและเงินฝากธนาคาร -->
              <div class="section-bar">รายการเงินและเงินฝากธนาคาร</div>

              <div class="ledger-subhead">
                <span>รายการเงินฝากส่วนราชการผู้เบิก</span>
                <span class="ledger-subhead__col">ยอดเงิน (บาท)</span>
              </div>
              <div v-for="item in remitItems" :key="'remit-' + item.key" class="ledger-row">
                <span class="ledger-row__label">{{ item.label }}</span>
                <v-text-field
                  v-model.number="form.remit[item.key]"
                  dense
                  outlined
                  hide-details
                  inputmode="decimal"
                  placeholder="0.00"
                  class="ledger-input"
                />
              </div>

              <div class="ledger-subhead mt-2">
                <span>รายการงบประมาณ</span>
                <span class="ledger-subhead__col ledger-subhead__col--wide">
                  <span>เงินสด (บาท)</span>
                  <span>เงินฝากธนาคาร (บาท)</span>
                </span>
              </div>
              <div v-for="item in allBudgetItems" :key="'budget-' + item.key" class="ledger-row">
                <span class="ledger-row__label">{{ item.label }}</span>
                <div class="ledger-row__inputs">
                  <v-text-field
                    v-model.number="form.budget[item.key].cash"
                    dense
                    outlined
                    hide-details
                    inputmode="decimal"
                    placeholder="0.00"
                    class="ledger-input"
                  />
                  <v-text-field
                    v-model.number="form.budget[item.key].bank"
                    dense
                    outlined
                    hide-details
                    inputmode="decimal"
                    placeholder="0.00"
                    class="ledger-input"
                  />
                </div>
              </div>

              <!-- เงินคงเหลือ -->
              <div class="section-bar mt-6">เงินคงเหลือ</div>
              <div class="pa-4 pa-sm-6">
                <v-row dense>
                  <v-col v-for="meta in balanceMeta" :key="meta.key" cols="6">
                    <div class="cell-label">{{ meta.label }}</div>
                    <v-text-field
                      :value="form.balance[meta.key]"
                      dense
                      outlined
                      hide-details
                      inputmode="decimal"
                      placeholder="0.00"
                      class="ledger-input ledger-input--block"
                      @input="setBalance(meta.key, $event)"
                    >
                      <template v-if="balanceOverridden[meta.key]" #append>
                        <v-icon
                          small
                          color="#1F6F4A"
                          title="คำนวณอัตโนมัติใหม่"
                          style="cursor: pointer"
                          @click="recalcBalance(meta.key)"
                        >
                          mdi-calculator-variant
                        </v-icon>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <div class="cell-label">รวมทั้งหมด</div>
                    <div class="total-cell">{{ formatCurrency(grandTotal) }}</div>
                  </v-col>
                </v-row>
              </div>

              <!-- หมายเหตุเงินอื่น ๆ -->
              <div class="section-bar">หมายเหตุเงินอื่น ๆ</div>
              <div class="pa-4 pa-sm-6">
                <v-row dense>
                  <v-col v-for="meta in otherNoteMeta" :key="meta.key" cols="12" sm="6">
                    <div class="cell-label">{{ meta.label }}</div>
                    <v-text-field
                      v-model="form.otherNote[meta.key]"
                      dense
                      outlined
                      hide-details
                      placeholder="ระบุรายละเอียด..."
                      class="note-input"
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- อัพโหลดไฟล์ -->
              <div class="section-bar">อัพโหลดไฟล์</div>
              <div class="pa-4 pa-sm-6">
                <div class="d-flex align-center flex-wrap" style="gap: 14px">
                  <v-btn outlined rounded color="#1F6F4A" class="upload-btn" @click="triggerFilePicker">
                    <v-icon left>mdi-tray-arrow-up</v-icon>
                    แนบไฟล์
                  </v-btn>
                  <div class="text-caption grey--text">
                    รองรับรูปภาพ (JPG, PNG), PDF, Word และ Excel ทุกเวอร์ชัน ขนาดไม่เกิน 5MB ต่อไฟล์
                  </div>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  class="hidden-file-input"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,image/jpeg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  @change="onNativeFileChange"
                />
                <v-alert v-if="attachmentError" type="error" dense outlined class="mt-2 rounded-lg">
                  {{ attachmentError }}
                </v-alert>
                <div v-if="attachments.length" class="attachment-list mt-3">
                  <div v-for="(file, idx) in attachments" :key="file.name + idx" class="attachment-item">
                    <v-icon small color="#1F6F4A" class="mr-2">{{ attachmentIcon(file.mimeType) }}</v-icon>
                    <span class="attachment-item__name">{{ file.name }}</span>
                    <span class="attachment-item__size">{{ formatFileSize(file.size) }}</span>
                    <v-btn icon x-small @click="removeAttachment(idx)">
                      <v-icon x-small>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>

              <div class="px-4 px-sm-6">
                <v-alert v-if="submitError" type="error" dense outlined class="mt-2 rounded-lg">
                  {{ submitError }}
                </v-alert>
                <v-alert v-if="schoolRequiredError" type="error" dense outlined class="mt-2 rounded-lg">
                  กรุณาเลือกหรือค้นหาชื่อโรงเรียนก่อนบันทึกข้อมูล
                </v-alert>
              </div>

              <v-divider class="mt-6" />

              <div class="d-flex flex-wrap justify-end pa-4 pa-sm-6" style="gap: 8px">
                <v-btn text rounded @click="resetForm" :disabled="submitting">ล้างแบบฟอร์ม</v-btn>
                <v-btn
                  class="save-btn"
                  dark
                  rounded
                  large
                  elevation="2"
                  :loading="submitting"
                  @click="submitForm"
                >
                  <v-icon left>mdi-content-save-outline</v-icon>
                  บันทึกข้อมูล
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {
  GOOGLE_FINANCE_WEBAPP_URL,
  FINANCE_SPREADSHEET_ID,
  FINANCE_SCHOOL_LIST_GID
} from '../config'

const BUDGET_ITEMS = [
  { key: 'perHead', label: 'เงินอุดหนุนรายหัว' },
  { key: 'poorStudent', label: 'เงินอุดหนุนนักเรียนยากจน' },
  { key: 'textbook', label: 'เงินอุดหนุนหนังสือนักเรียน' },
  { key: 'uniform', label: 'เงินอุดหนุนเครื่องแบบนักเรียน' },
  { key: 'supplies', label: 'เงินอุดหนุนอุปกรณ์การเรียน' },
  { key: 'activity', label: 'เงินอุดหนุนกิจกรรมพัฒนาคุณภาพผู้เรียน' },
  { key: 'lunch', label: 'เงินอาหารกลางวัน' },
  { key: 'lunchFund', label: 'เงินกองทุนอาหารกลางวัน' },
  { key: 'equityFund', label: 'เงินกองทุนเพื่อความเสมอภาคทางการศึกษา' },
  { key: 'schoolIncome', label: 'เงินรายได้สถานศึกษา' },
  { key: 'stateIncome', label: 'เงินรายได้แผ่นดิน' },
  { key: 'withholdingTax', label: 'เงินภาษีหัก ณ ที่จ่าย' }
]

const OTHER_ITEMS = [
  { key: 'other1', label: 'เงินอื่น ๆ รายการที่ 1' },
  { key: 'other2', label: 'เงินอื่นๆ รายการที่ 2' }
]

const ALL_BUDGET_ITEMS = BUDGET_ITEMS.concat(OTHER_ITEMS)

const REMIT_ITEMS = [
  { key: 'contractDeposit', label: 'เงินประกันสัญญา' },
  { key: 'lunch', label: 'เงินอาหารกลางวัน' }
]

const BALANCE_META = [
  { key: 'cash', label: 'เงินสด' },
  { key: 'bank', label: 'เงินฝากธนาคาร' },
  { key: 'remit', label: 'เงินฝากส่วนราชการผู้เบิก' }
]

const OTHER_NOTE_META = [
  { key: 'other1', label: 'เงินอื่นๆ รายการที่ 1' },
  { key: 'other2', label: 'เงินอื่นๆ รายการที่ 2' }
]

const ALLOWED_ATTACHMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

const ALLOWED_ATTACHMENT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx']

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024

function toNum(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function emptyBudget() {
  const budget = {}
  ALL_BUDGET_ITEMS.forEach((item) => {
    budget[item.key] = { cash: 0, bank: 0 }
  })
  return budget
}

function emptyForm() {
  return {
    recordDate: new Date().toISOString().substr(0, 10),
    remit: { contractDeposit: 0, lunch: 0 },
    budget: emptyBudget(),
    balance: { cash: 0, bank: 0, remit: 0 },
    otherNote: { other1: '', other2: '' }
  }
}

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += c
    }
  }
  if (field !== '' || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

export default {
  name: 'FinanceRecordView',
  data() {
    return {
      form: emptyForm(),
      formValid: true,
      allBudgetItems: ALL_BUDGET_ITEMS,
      remitItems: REMIT_ITEMS,
      balanceMeta: BALANCE_META,
      otherNoteMeta: OTHER_NOTE_META,
      selectedSchool: null,
      schoolSearchQuery: '',
      schoolOptions: [],
      schoolsLoading: false,
      schoolsError: '',
      balanceOverridden: { cash: false, bank: false, remit: false },
      attachments: [],
      attachmentError: '',
      submitting: false,
      submitError: '',
      schoolRequiredError: false,
      submitted: false,
      lastSavedSchool: '',
      lastSavedDateDisplay: '',
      lastSavedTotal: 0
    }
  },
  computed: {
    displayDate() {
      if (!this.form.recordDate) return ''
      const [y, m, d] = this.form.recordDate.split('-')
      return `${d}/${m}/${y}`
    },
    numberedSchools() {
      return this.schoolOptions.map((name, i) => ({ number: String(i + 1).padStart(3, '0'), name }))
    },
    filteredSchools() {
      const q = this.schoolSearchQuery.trim().toLowerCase()
      if (!q) return this.numberedSchools
      return this.numberedSchools.filter(
        (s) => s.name.toLowerCase().includes(q) || s.number.includes(q)
      )
    },
    selectedSchoolDisplay() {
      if (!this.selectedSchool) return ''
      const found = this.numberedSchools.find((s) => s.name === this.selectedSchool)
      return found ? `${found.number} - ${found.name}` : this.selectedSchool
    },
    computedCashSum() {
      return this.allBudgetItems.reduce((sum, item) => sum + toNum(this.form.budget[item.key].cash), 0)
    },
    computedBankSum() {
      return this.allBudgetItems.reduce((sum, item) => sum + toNum(this.form.budget[item.key].bank), 0)
    },
    computedRemitSum() {
      return toNum(this.form.remit.contractDeposit) + toNum(this.form.remit.lunch)
    },
    grandTotal() {
      return toNum(this.form.balance.cash) + toNum(this.form.balance.bank) + toNum(this.form.balance.remit)
    }
  },
  watch: {
    computedCashSum(val) {
      if (!this.balanceOverridden.cash) this.form.balance.cash = val
    },
    computedBankSum(val) {
      if (!this.balanceOverridden.bank) this.form.balance.bank = val
    },
    computedRemitSum(val) {
      if (!this.balanceOverridden.remit) this.form.balance.remit = val
    }
  },
  created() {
    this.form.balance.cash = this.computedCashSum
    this.form.balance.bank = this.computedBankSum
    this.form.balance.remit = this.computedRemitSum
    this.fetchSchools()
  },
  methods: {
    formatCurrency(v) {
      return toNum(v).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    setBalance(field, value) {
      this.form.balance[field] = toNum(value)
      this.balanceOverridden[field] = true
    },
    recalcBalance(field) {
      this.balanceOverridden[field] = false
      const map = { cash: 'computedCashSum', bank: 'computedBankSum', remit: 'computedRemitSum' }
      this.form.balance[field] = this[map[field]]
    },
    isAllowedAttachment(file) {
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase()
      return ALLOWED_ATTACHMENT_TYPES.includes(file.type) || ALLOWED_ATTACHMENT_EXTENSIONS.includes(ext)
    },
    readFileAsBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = typeof reader.result === 'string' ? reader.result : ''
          resolve(result.split(',')[1] || '')
        }
        reader.onerror = () => reject(new Error('read-failed'))
        reader.readAsDataURL(file)
      })
    },
    triggerFilePicker() {
      this.$refs.fileInput.click()
    },
    onNativeFileChange(event) {
      const files = Array.from(event.target.files || [])
      event.target.value = ''
      this.onFilesPicked(files)
    },
    async onFilesPicked(files) {
      this.attachmentError = ''
      const list = Array.isArray(files) ? files : files ? [files] : []

      for (const file of list) {
        if (!this.isAllowedAttachment(file)) {
          this.attachmentError = `ไฟล์ "${file.name}" ไม่ใช่ชนิดที่รองรับ (รองรับเฉพาะ JPG, PNG, PDF, Word, Excel)`
          continue
        }
        if (file.size > MAX_ATTACHMENT_SIZE) {
          this.attachmentError = `ไฟล์ "${file.name}" มีขนาดเกิน 5MB`
          continue
        }
        try {
          const base64 = await this.readFileAsBase64(file)
          this.attachments.push({ name: file.name, mimeType: file.type, size: file.size, base64 })
        } catch (err) {
          this.attachmentError = `ไม่สามารถอ่านไฟล์ "${file.name}" ได้`
        }
      }
    },
    removeAttachment(index) {
      this.attachments.splice(index, 1)
    },
    formatFileSize(bytes) {
      if (!bytes) return '0 KB'
      const kb = bytes / 1024
      if (kb < 1024) return `${kb.toFixed(0)} KB`
      return `${(kb / 1024).toFixed(1)} MB`
    },
    attachmentIcon(mimeType) {
      if (mimeType.startsWith('image/')) return 'mdi-file-image-outline'
      if (mimeType === 'application/pdf') return 'mdi-file-pdf-box'
      if (mimeType.includes('word')) return 'mdi-file-word-outline'
      if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'mdi-file-excel-outline'
      return 'mdi-file-outline'
    },
    async fetchSchools() {
      this.schoolsLoading = true
      this.schoolsError = ''
      try {
        if (GOOGLE_FINANCE_WEBAPP_URL && !GOOGLE_FINANCE_WEBAPP_URL.includes('PASTE_YOUR')) {
          const res = await fetch(`${GOOGLE_FINANCE_WEBAPP_URL}?action=schools`)
          const data = await res.json()
          this.schoolOptions = Array.isArray(data.schools) ? data.schools : []
        } else {
          const csvUrl = `https://docs.google.com/spreadsheets/d/${FINANCE_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${FINANCE_SCHOOL_LIST_GID}`
          const res = await fetch(csvUrl)
          if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ')
          const text = await res.text()
          const rows = parseCsv(text)
          if (!rows.length) throw new Error('ไม่พบข้อมูลในชีต')
          const header = rows[0].map((h) => h.trim())
          let colIndex = header.findIndex((h) => h === 'รายชื่อโรงเรียน')
          if (colIndex === -1) colIndex = header.findIndex((h) => h.includes('โรงเรียน'))
          if (colIndex === -1) colIndex = 0
          this.schoolOptions = rows
            .slice(1)
            .map((r) => (r[colIndex] || '').trim())
            .filter(Boolean)
        }
        if (!this.schoolOptions.length) {
          this.schoolsError = 'ไม่พบรายชื่อโรงเรียน สามารถพิมพ์ชื่อโรงเรียนเองได้'
        }
      } catch (err) {
        this.schoolsError = 'โหลดรายชื่อโรงเรียนไม่สำเร็จ สามารถพิมพ์ชื่อโรงเรียนเองได้'
      } finally {
        this.schoolsLoading = false
      }
    },
    resetForm() {
      this.form = emptyForm()
      this.balanceOverridden = { cash: false, bank: false, remit: false }
      this.form.balance.cash = this.computedCashSum
      this.form.balance.bank = this.computedBankSum
      this.form.balance.remit = this.computedRemitSum
      this.attachments = []
      this.attachmentError = ''
      this.submitError = ''
      this.schoolRequiredError = false
      if (this.$refs.form) this.$refs.form.resetValidation()
    },
    startNewResponse() {
      this.selectedSchool = null
      this.resetForm()
      this.submitted = false
    },
    buildPayload() {
      const schoolName = (this.selectedSchool || '').toString().trim()
      return {
        timestamp: new Date().toISOString(),
        schoolName,
        recordDate: this.form.recordDate,
        remit: {
          contractDeposit: toNum(this.form.remit.contractDeposit),
          lunch: toNum(this.form.remit.lunch)
        },
        budget: this.allBudgetItems.map((item) => ({
          key: item.key,
          label: item.label,
          cash: toNum(this.form.budget[item.key].cash),
          bank: toNum(this.form.budget[item.key].bank)
        })),
        balance: {
          cash: toNum(this.form.balance.cash),
          bank: toNum(this.form.balance.bank),
          remit: toNum(this.form.balance.remit),
          total: this.grandTotal
        },
        otherNote: {
          other1: (this.form.otherNote.other1 || '').toString().trim(),
          other2: (this.form.otherNote.other2 || '').toString().trim()
        },
        attachments: this.attachments.map((file) => ({
          name: file.name,
          mimeType: file.mimeType,
          base64: file.base64
        }))
      }
    },
    async submitForm() {
      this.submitError = ''
      this.schoolRequiredError = false

      const isFormValid = this.$refs.form.validate()
      const hasSchool = !!(this.selectedSchool && this.selectedSchool.toString().trim())

      if (!hasSchool) this.schoolRequiredError = true

      if (!isFormValid || !hasSchool) {
        this.$vuetify.goTo(0)
        return
      }

      const payload = this.buildPayload()
      const total = payload.balance.total
      const [y, m, d] = payload.recordDate.split('-')

      if (!GOOGLE_FINANCE_WEBAPP_URL || GOOGLE_FINANCE_WEBAPP_URL.includes('PASTE_YOUR')) {
        this.submitError =
          'ยังไม่ได้ตั้งค่า URL สำหรับบันทึกลง Google Sheet (ดูวิธีตั้งค่าใน apps-script/README-finance.md) — ระบบจะดาวน์โหลดข้อมูลเป็นไฟล์ JSON ให้แทน'
        this.downloadAsJson(payload)
        return
      }

      this.submitting = true
      try {
        await fetch(GOOGLE_FINANCE_WEBAPP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        })
        this.lastSavedSchool = payload.schoolName
        this.lastSavedDateDisplay = `${d}/${m}/${y}`
        this.lastSavedTotal = total
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
      a.download = `finance-record-${payload.schoolName || 'data'}-${payload.recordDate}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style scoped>
.finance-page {
  background-color: #f7f5ec;
}

.hero {
  background: linear-gradient(135deg, #1b5e43, #2f7d5b);
  padding-bottom: 64px;
  position: relative;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.12) 2px, transparent 2px);
  background-size: 28px 28px;
  pointer-events: none;
}

.hero-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.hero-eyebrow {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  max-width: 640px;
}

.content-lift {
  margin-top: -40px;
  position: relative;
  z-index: 1;
}

.sidebar-card,
.form-card,
.success-card {
  background-color: #fff;
  position: relative;
  overflow: hidden;
}

.form-card::before,
.success-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #1b5e43, #2f7d5b);
}

.panel-eyebrow {
  color: #8a8a8a;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.selected-school-chip {
  background: #e7f2ea;
  color: #155a3b;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 0.85rem;
}

.school-list {
  max-height: 560px;
  overflow-y: auto;
}

.school-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  border-radius: 8px;
  padding: 10px 10px;
  cursor: pointer;
  font-size: 0.88rem;
  color: #333;
  transition: background 0.15s ease;
}

.school-item:hover {
  background: #f5f4ee;
}

.school-item--active {
  background: #e7f2ea;
  border-left-color: #1f6f4a;
  font-weight: 700;
  color: #155a3b;
}

.school-item__number {
  color: #9a9a9a;
  font-variant-numeric: tabular-nums;
}

.school-item--active .school-item__number {
  color: #1f6f4a;
}

.school-item__dot {
  color: #ccc;
}

.school-item__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.section-bar {
  background: #e7f2ea;
  color: #155a3b;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 12px 24px;
}

.ledger-subhead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  font-size: 0.76rem;
  color: #8a8a8a;
  font-weight: 700;
  border-bottom: 1px solid #eee;
}

.ledger-subhead__col {
  min-width: 130px;
  text-align: right;
}

.ledger-subhead__col--wide {
  display: flex;
  gap: 12px;
}

.ledger-subhead__col--wide span {
  min-width: 130px;
  text-align: right;
}

.ledger-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 10px 24px;
  border-bottom: 1px solid #f2f1ea;
}

.ledger-row:last-of-type {
  border-bottom: none;
}

.ledger-row__label {
  font-size: 0.88rem;
  color: #333;
  flex: 1;
}

.ledger-row__inputs {
  display: flex;
  gap: 12px;
}

.ledger-input {
  max-width: 130px;
}

.ledger-input--block {
  max-width: none;
}

.ledger-input ::v-deep .v-input__slot {
  min-height: 36px !important;
  background: #fff;
}

.ledger-input ::v-deep input {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.note-input ::v-deep .v-input__slot {
  min-height: 36px !important;
  background: #fff;
}

.locked-date-field.v-input--is-disabled ::v-deep .v-input__slot {
  background: #f5f4ee !important;
}

.locked-date-field ::v-deep input {
  color: #333 !important;
  -webkit-text-fill-color: #333 !important;
}

.locked-date-field ::v-deep .v-icon {
  color: #9a9a9a !important;
}

.cell-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
  margin-bottom: 6px;
}

.hidden-file-input {
  display: none;
}

.upload-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  transition: background 0.15s ease, color 0.15s ease;
}

.upload-btn:hover {
  background: #e7f2ea !important;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fbfbf8;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 6px 10px;
}

.attachment-item__name {
  flex: 1;
  font-size: 0.85rem;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-item__size {
  font-size: 0.75rem;
  color: #999;
  flex: none;
}

.total-cell {
  background: #fbf3d8;
  border: 1px solid #f1e2a8;
  border-radius: 8px;
  padding: 10px 14px;
  text-align: right;
  font-weight: 700;
  font-size: 1rem;
  color: #7a5c00;
}

.save-btn {
  background: linear-gradient(135deg, #1b5e43, #2f7d5b) !important;
}

.success-pulse {
  animation: pulse-ring 1.6s ease-out 1;
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(31, 111, 74, 0.45);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(31, 111, 74, 0);
  }
}

@media (max-width: 600px) {
  .ledger-row {
    flex-wrap: wrap;
  }

  .ledger-row__label {
    flex: 1 1 100%;
    margin-bottom: 6px;
  }

  .ledger-subhead {
    flex-wrap: wrap;
    gap: 4px;
  }
}
</style>
