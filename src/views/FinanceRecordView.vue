<template>
  <div>
    <div class="hero">
      <v-container class="text-center py-8 py-sm-12">
        <v-avatar size="72" class="mb-4 elevation-8 hero-avatar" color="white">
          <v-img :src="logo" contain />
        </v-avatar>
        <div class="text-h6 text-sm-h4 font-weight-bold white--text px-4">
          บันทึกเงินคงเหลือประจำวันโรงเรียน
        </div>
        <div class="text-body-2 text-sm-subtitle-1 white--text mt-2" style="opacity: 0.85">
          สำนักงานเขตพื้นที่การศึกษาประถมศึกษาอุดรธานี เขต 3
        </div>
      </v-container>
    </div>

    <v-container class="form-container py-6 py-sm-10 content-lift" style="max-width: 980px">
      <!-- แถบเครื่องมือเลือก/ค้นหาโรงเรียน -->
      <v-card elevation="6" class="pa-3 pa-sm-5 rounded-xl mb-5 school-toolbar">
        <div class="d-flex align-center flex-wrap" style="gap: 12px">
          <v-avatar color="primary" size="44" class="d-none d-sm-flex">
            <v-icon color="white">mdi-school</v-icon>
          </v-avatar>
          <v-combobox
            v-model="selectedSchool"
            :items="schoolOptions"
            :loading="schoolsLoading"
            outlined
            dense
            rounded
            hide-selected
            clearable
            prepend-inner-icon="mdi-magnify"
            label="ค้นหา / เลือกโรงเรียน"
            placeholder="พิมพ์เพื่อค้นหาชื่อโรงเรียน..."
            class="flex-grow-1 school-combobox"
            style="min-width: 240px"
            hide-details="auto"
          />
          <v-btn icon :loading="schoolsLoading" @click="fetchSchools" title="โหลดรายชื่อโรงเรียนใหม่">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
        <v-alert v-if="schoolsError" type="warning" dense outlined class="mt-3 mb-0 rounded-lg">
          {{ schoolsError }}
        </v-alert>
      </v-card>

      <v-card
        v-if="submitted"
        elevation="10"
        class="pa-6 pa-sm-10 text-center rounded-xl success-card"
      >
        <v-avatar color="success" size="92" class="mb-2 success-pulse">
          <v-icon color="white" size="54">mdi-check-bold</v-icon>
        </v-avatar>
        <div class="text-h5 font-weight-bold mt-4">บันทึกข้อมูลเรียบร้อยแล้ว</div>
        <div class="text-body-1 grey--text text--darken-1 mt-2">
          บันทึกเงินคงเหลือประจำวันเรียบร้อยแล้ว
        </div>
        <div class="d-flex flex-wrap justify-center mt-5" style="gap: 8px">
          <v-chip color="primary" outlined label>
            <v-icon left small>mdi-school-outline</v-icon>{{ lastSavedSchool }}
          </v-chip>
          <v-chip color="secondary" outlined label>
            <v-icon left small>mdi-calendar-outline</v-icon>{{ lastSavedDateDisplay }}
          </v-chip>
          <v-chip color="success" outlined label>
            <v-icon left small>mdi-cash-multiple</v-icon>฿ {{ formatCurrency(lastSavedTotal) }}
          </v-chip>
        </div>
        <v-btn color="primary" large rounded elevation="2" class="mt-8 px-8" @click="startNewResponse">
          <v-icon left>mdi-plus</v-icon>
          บันทึกรายการถัดไป
        </v-btn>
      </v-card>

      <!-- แถบแบบบันทึกประจำวัน -->
      <v-card v-else elevation="10" class="rounded-xl form-card">
        <div class="pa-4 pa-sm-6 pb-0">
          <section-header number="1" title="วันที่บันทึก" required />
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="displayDate"
                outlined
                dense
                rounded
                readonly
                prepend-inner-icon="mdi-calendar-outline"
                placeholder="เลือกวันที่"
                :rules="[rules.required]"
                v-bind="attrs"
                v-on="on"
                class="mb-2"
                style="max-width: 280px"
              />
            </template>
            <v-date-picker
              v-model="form.recordDate"
              locale="th-TH"
              no-title
              color="primary"
              @input="dateMenu = false"
            />
          </v-menu>
        </div>

        <v-divider class="mt-4" />

        <v-card-text class="pa-4 pa-sm-6">
          <v-form ref="form" v-model="formValid" lazy-validation>
            <section-header
              number="2"
              title="รายการเงินฝากส่วนราชการผู้เบิก"
              hint="เงินฝากที่หน่วยงานส่วนราชการเป็นผู้เบิกแทนโรงเรียน"
            />
                <div class="section-panel pa-4 pa-sm-5 mb-5" :style="panelStyle('#3F51B5')">
                  <v-row dense>
                    <v-col v-for="item in remitItems" :key="item.key" cols="12" sm="6">
                      <v-card class="pa-3 entry-card">
                        <div class="d-flex align-center mb-2">
                          <v-avatar size="32" color="indigo lighten-5" class="mr-2">
                            <v-icon small color="indigo darken-2">{{ item.icon }}</v-icon>
                          </v-avatar>
                          <span class="text-body-2 font-weight-medium">{{ item.label }}</span>
                        </div>
                        <v-text-field
                          v-model.number="form.remit[item.key]"
                          outlined
                          dense
                          rounded
                          type="number"
                          suffix="บาท"
                          label="ยอดเงิน"
                          hide-details
                        />
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <section-header
                  number="3"
                  title="รายการงบประมาณ"
                  hint="กรอกยอดเงินสดและเงินฝากธนาคารของแต่ละรายการ"
                />
                <div
                  v-for="group in budgetGroups"
                  :key="group.title"
                  class="section-panel pa-4 pa-sm-5 mb-5"
                  :style="panelStyle(group.color)"
                >
                  <div class="d-flex align-center mb-3">
                    <v-avatar :color="group.color" size="28" class="mr-2">
                      <v-icon x-small color="white">{{ group.icon }}</v-icon>
                    </v-avatar>
                    <span class="text-subtitle-2 font-weight-bold" :style="{ color: group.color }">
                      {{ group.title }}
                    </span>
                  </div>
                  <v-row dense>
                    <v-col v-for="item in group.items" :key="item.key" cols="12" md="6">
                      <v-card class="pa-3 entry-card">
                        <div class="d-flex align-center mb-2">
                          <v-avatar size="30" color="grey lighten-4" class="mr-2">
                            <v-icon small :color="group.color">{{ item.icon }}</v-icon>
                          </v-avatar>
                          <span class="text-body-2 font-weight-medium">{{ item.label }}</span>
                        </div>
                        <v-row dense>
                          <v-col cols="6">
                            <v-text-field
                              v-model.number="form.budget[item.key].cash"
                              outlined
                              dense
                              rounded
                              type="number"
                              suffix="บาท"
                              label="เงินสด"
                              hide-details
                            />
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              v-model.number="form.budget[item.key].bank"
                              outlined
                              dense
                              rounded
                              type="number"
                              suffix="บาท"
                              label="เงินฝากธนาคาร"
                              hide-details
                            />
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <section-header
                  number="4"
                  title="เงินคงเหลือ"
                  hint="คำนวณยอดรวมให้อัตโนมัติ (ไม่รวมเงินอื่นๆ รายการที่ 1 และ 2) แก้ไขตัวเลขเองได้"
                  class="mt-4"
                />

                <v-alert
                  color="primary"
                  dark
                  dense
                  class="rounded-lg mb-4 total-banner"
                  icon="mdi-cash-multiple"
                >
                  ยอดเงินคงเหลือรวมทั้งสิ้น
                  <span class="text-h6 font-weight-bold ml-1">฿ {{ formatCurrency(grandTotal) }}</span>
                </v-alert>

                <div class="section-panel pa-4 pa-sm-5 mb-2" :style="panelStyle('#0D47A1')">
                  <v-row dense>
                    <v-col v-for="meta in balanceMeta" :key="meta.key" cols="12" sm="4">
                      <v-card class="stat-card" :style="{ borderTopColor: meta.color }">
                        <div class="pa-4">
                          <div class="d-flex align-center mb-3">
                            <v-avatar :color="meta.color" size="38" class="mr-3">
                              <v-icon color="white" small>{{ meta.icon }}</v-icon>
                            </v-avatar>
                            <div class="text-body-2 font-weight-medium grey--text text--darken-2">
                              {{ meta.label }}
                            </div>
                          </div>
                          <v-text-field
                            :value="form.balance[meta.key]"
                            outlined
                            dense
                            type="number"
                            suffix="บาท"
                            hide-details
                            class="stat-input"
                            @input="setBalance(meta.key, $event)"
                          >
                            <template #append>
                              <v-icon
                                v-if="balanceOverridden[meta.key]"
                                small
                                color="primary"
                                title="คำนวณอัตโนมัติใหม่"
                                style="cursor: pointer"
                                @click="recalcBalance(meta.key)"
                              >
                                mdi-calculator-variant
                              </v-icon>
                            </template>
                          </v-text-field>
                          <div class="text-caption grey--text mt-2">
                            ฿ {{ formatCurrency(form.balance[meta.key]) }}
                          </div>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <section-header
                  number="5"
                  title="หมายเหตุอื่น ๆ"
                  hint="ยอดรวมของเงินอื่นๆ รายการที่ 1 และ 2 คำนวณอัตโนมัติ แก้ไขตัวเลขเองได้"
                  class="mt-4"
                />
                <div class="section-panel pa-4 pa-sm-5 mb-2" :style="panelStyle('#546E7A')">
                  <v-row dense>
                    <v-col v-for="meta in otherNoteMeta" :key="meta.key" cols="12" sm="6">
                      <v-card class="stat-card stat-card--muted" :style="{ borderTopColor: meta.color }">
                        <div class="pa-4">
                          <div class="d-flex align-center mb-3">
                            <v-avatar :color="meta.color" size="38" class="mr-3">
                              <v-icon color="white" small>{{ meta.icon }}</v-icon>
                            </v-avatar>
                            <div class="text-body-2 font-weight-medium grey--text text--darken-2">
                              {{ meta.label }}
                            </div>
                          </div>
                          <v-text-field
                            :value="form.otherNote[meta.key]"
                            outlined
                            dense
                            type="number"
                            suffix="บาท"
                            hide-details
                            class="stat-input"
                            @input="setOtherNote(meta.key, $event)"
                          >
                            <template #append>
                              <v-icon
                                v-if="otherNoteOverridden[meta.key]"
                                small
                                color="primary"
                                title="คำนวณอัตโนมัติใหม่"
                                style="cursor: pointer"
                                @click="recalcOtherNote(meta.key)"
                              >
                                mdi-calculator-variant
                              </v-icon>
                            </template>
                          </v-text-field>
                          <div class="text-caption grey--text mt-2">
                            ฿ {{ formatCurrency(form.otherNote[meta.key]) }}
                          </div>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <v-alert v-if="submitError" type="error" dense outlined class="mt-4 rounded-lg">
                  {{ submitError }}
                </v-alert>
                <v-alert v-if="schoolRequiredError" type="error" dense outlined class="mt-4 rounded-lg">
                  กรุณาเลือกหรือค้นหาชื่อโรงเรียนก่อนบันทึกข้อมูล
                </v-alert>

                <v-divider class="my-6" />

                <div class="d-flex flex-wrap justify-end" style="gap: 8px">
                  <v-btn text rounded @click="resetForm" :disabled="submitting">ล้างแบบฟอร์ม</v-btn>
                  <v-btn
                    color="primary"
                    rounded
                    large
                    elevation="2"
                    class="px-8 save-btn"
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
  </div>
</template>

<script>
import {
  GOOGLE_FINANCE_WEBAPP_URL,
  FINANCE_SPREADSHEET_ID,
  FINANCE_SCHOOL_LIST_GID
} from '../config'
import SectionHeader from '../components/SectionHeader.vue'
import logo from '../assets/logo_udn3.png'

const BUDGET_ITEMS = [
  { key: 'perHead', label: 'เงินอุดหนุนรายหัว', icon: 'mdi-account-group-outline' },
  { key: 'poorStudent', label: 'เงินอุดหนุนนักเรียนยากจน', icon: 'mdi-hand-heart-outline' },
  { key: 'textbook', label: 'เงินอุดหนุนหนังสือนักเรียน', icon: 'mdi-book-open-variant' },
  { key: 'uniform', label: 'เงินอุดหนุนเครื่องแบบนักเรียน', icon: 'mdi-tshirt-crew-outline' },
  { key: 'supplies', label: 'เงินอุดหนุนอุปกรณ์การเรียน', icon: 'mdi-pencil-ruler-outline' },
  { key: 'activity', label: 'เงินอุดหนุนกิจกรรมพัฒนาคุณภาพผู้เรียน', icon: 'mdi-run-fast' },
  { key: 'lunch', label: 'เงินอาหารกลางวัน', icon: 'mdi-food-outline' },
  { key: 'lunchFund', label: 'เงินกองทุนอาหารกลางวัน', icon: 'mdi-piggy-bank-outline' },
  { key: 'equityFund', label: 'เงินกองทุนเพื่อความเสมอภาคทางการศึกษา', icon: 'mdi-scale-balance' },
  { key: 'schoolIncome', label: 'เงินรายได้สถานศึกษา', icon: 'mdi-domain' },
  { key: 'stateIncome', label: 'เงินรายได้แผ่นดิน', icon: 'mdi-bank-outline' },
  { key: 'withholdingTax', label: 'เงินภาษีหัก ณ ที่จ่าย', icon: 'mdi-receipt-text-outline' }
]

const OTHER_ITEMS = [
  { key: 'other1', label: 'เงินอื่น ๆ รายการที่ 1', icon: 'mdi-shape-outline' },
  { key: 'other2', label: 'เงินอื่นๆ รายการที่ 2', icon: 'mdi-shape-plus-outline' }
]

const ALL_BUDGET_ITEMS = BUDGET_ITEMS.concat(OTHER_ITEMS)

const BUDGET_GROUP_DEFS = [
  { title: 'เงินอุดหนุน', icon: 'mdi-hand-coin-outline', color: '#1565C0', keys: ['perHead', 'poorStudent', 'textbook', 'uniform', 'supplies', 'activity', 'lunch'] },
  { title: 'เงินกองทุน', icon: 'mdi-piggy-bank-outline', color: '#00695C', keys: ['lunchFund', 'equityFund'] },
  { title: 'เงินรายได้และภาษี', icon: 'mdi-cash-register', color: '#F9A825', keys: ['schoolIncome', 'stateIncome', 'withholdingTax'] },
  { title: 'เงินอื่น ๆ', icon: 'mdi-dots-horizontal-circle-outline', color: '#546E7A', keys: ['other1', 'other2'] }
]

const REMIT_ITEMS = [
  { key: 'contractDeposit', label: 'เงินประกันสัญญา', icon: 'mdi-file-document-edit-outline' },
  { key: 'lunch', label: 'เงินอาหารกลางวัน', icon: 'mdi-food-outline' }
]

const BALANCE_META = [
  { key: 'cash', label: 'เงินสด', icon: 'mdi-cash', color: '#2E7D32' },
  { key: 'bank', label: 'เงินฝากธนาคาร', icon: 'mdi-bank', color: '#0D47A1' },
  { key: 'remit', label: 'เงินฝากส่วนราชการผู้เบิก', icon: 'mdi-domain', color: '#6A1B9A' }
]

const OTHER_NOTE_META = [
  { key: 'other1', label: 'เงินอื่นๆ รายการที่ 1', icon: 'mdi-shape-outline', color: '#546E7A' },
  { key: 'other2', label: 'เงินอื่นๆ รายการที่ 2', icon: 'mdi-shape-plus-outline', color: '#546E7A' }
]

function toNum(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const bigint = parseInt(full, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
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
    otherNote: { other1: 0, other2: 0 }
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
  components: { SectionHeader },
  data() {
    return {
      logo,
      form: emptyForm(),
      formValid: true,
      dateMenu: false,
      allBudgetItems: ALL_BUDGET_ITEMS,
      budgetItems: BUDGET_ITEMS,
      remitItems: REMIT_ITEMS,
      balanceMeta: BALANCE_META,
      otherNoteMeta: OTHER_NOTE_META,
      budgetGroups: BUDGET_GROUP_DEFS.map((group) => ({
        title: group.title,
        icon: group.icon,
        color: group.color,
        items: group.keys.map((key) => ALL_BUDGET_ITEMS.find((item) => item.key === key))
      })),
      selectedSchool: null,
      schoolOptions: [],
      schoolsLoading: false,
      schoolsError: '',
      balanceOverridden: { cash: false, bank: false, remit: false },
      otherNoteOverridden: { other1: false, other2: false },
      submitting: false,
      submitError: '',
      schoolRequiredError: false,
      submitted: false,
      lastSavedSchool: '',
      lastSavedDateDisplay: '',
      lastSavedTotal: 0,
      rules: {
        required: (v) => (v !== null && v !== undefined && String(v).trim() !== '') || 'กรุณากรอกข้อมูลนี้'
      }
    }
  },
  computed: {
    displayDate: {
      get() {
        if (!this.form.recordDate) return ''
        const [y, m, d] = this.form.recordDate.split('-')
        return `${d}/${m}/${y}`
      },
      set() {}
    },
    computedCashSum() {
      return this.budgetItems.reduce((sum, item) => sum + toNum(this.form.budget[item.key].cash), 0)
    },
    computedBankSum() {
      return this.budgetItems.reduce((sum, item) => sum + toNum(this.form.budget[item.key].bank), 0)
    },
    computedRemitSum() {
      return toNum(this.form.remit.contractDeposit) + toNum(this.form.remit.lunch)
    },
    computedOther1Sum() {
      return toNum(this.form.budget.other1.cash) + toNum(this.form.budget.other1.bank)
    },
    computedOther2Sum() {
      return toNum(this.form.budget.other2.cash) + toNum(this.form.budget.other2.bank)
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
    },
    computedOther1Sum(val) {
      if (!this.otherNoteOverridden.other1) this.form.otherNote.other1 = val
    },
    computedOther2Sum(val) {
      if (!this.otherNoteOverridden.other2) this.form.otherNote.other2 = val
    }
  },
  created() {
    this.form.balance.cash = this.computedCashSum
    this.form.balance.bank = this.computedBankSum
    this.form.balance.remit = this.computedRemitSum
    this.form.otherNote.other1 = this.computedOther1Sum
    this.form.otherNote.other2 = this.computedOther2Sum
    this.fetchSchools()
  },
  methods: {
    formatCurrency(v) {
      return toNum(v).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    panelStyle(color) {
      return {
        backgroundColor: hexToRgba(color, 0.06),
        borderLeft: `4px solid ${color}`
      }
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
    setOtherNote(field, value) {
      this.form.otherNote[field] = toNum(value)
      this.otherNoteOverridden[field] = true
    },
    recalcOtherNote(field) {
      this.otherNoteOverridden[field] = false
      const map = { other1: 'computedOther1Sum', other2: 'computedOther2Sum' }
      this.form.otherNote[field] = this[map[field]]
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
      this.otherNoteOverridden = { other1: false, other2: false }
      this.form.balance.cash = this.computedCashSum
      this.form.balance.bank = this.computedBankSum
      this.form.balance.remit = this.computedRemitSum
      this.form.otherNote.other1 = this.computedOther1Sum
      this.form.otherNote.other2 = this.computedOther2Sum
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
          remit: toNum(this.form.balance.remit)
        },
        otherNote: {
          other1: toNum(this.form.otherNote.other1),
          other2: toNum(this.form.otherNote.other2)
        }
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
      const total = payload.balance.cash + payload.balance.bank + payload.balance.remit
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
.hero {
  background: linear-gradient(135deg, #0d47a1, #00695c);
  padding-bottom: 72px;
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

.hero-avatar {
  border: 3px solid rgba(255, 255, 255, 0.6);
}

.content-lift {
  margin-top: -56px;
  position: relative;
  z-index: 1;
}

.form-card,
.success-card,
.school-toolbar {
  background: linear-gradient(180deg, #ffffff 0%, #f6f8fc 100%);
  position: relative;
  overflow: hidden;
}

.form-card::before,
.success-card::before,
.school-toolbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #0d47a1, #00695c);
}

.school-combobox ::v-deep .v-select__selection {
  font-weight: 600;
  color: #0d47a1;
}

.section-panel {
  border-radius: 14px;
}

.entry-card {
  border-radius: 14px !important;
  background-color: #fff !important;
  transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  box-shadow: 0 1px 3px rgba(15, 30, 60, 0.08) !important;
}

.entry-card:hover {
  box-shadow: 0 4px 14px rgba(13, 71, 161, 0.12) !important;
  transform: translateY(-1px);
}

.stat-card {
  border-radius: 14px !important;
  background-color: #fff !important;
  border-top-width: 4px !important;
  border-top-style: solid !important;
  box-shadow: 0 1px 3px rgba(15, 30, 60, 0.08) !important;
}

.stat-card--muted {
  background-color: #fbfbfb !important;
}

.stat-input ::v-deep input {
  font-size: 1.15rem;
  font-weight: 700;
}

.total-banner {
  font-size: 1.05rem;
}

.save-btn {
  background: linear-gradient(135deg, #0d47a1, #00695c) !important;
}

.success-pulse {
  animation: pulse-ring 1.6s ease-out 1;
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.45);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(46, 125, 50, 0);
  }
}

.form-card ::v-deep .v-label,
.form-card ::v-deep input,
.form-card ::v-deep textarea,
.form-card ::v-deep .v-select__selection,
.form-card ::v-deep .v-messages,
.form-card ::v-deep .v-btn__content {
  font-size: 1rem;
}
</style>
