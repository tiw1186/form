<template>
  <div>
    <div class="hero">
      <v-container class="text-center py-10 py-sm-14">
        <v-avatar size="84" class="mb-4 elevation-6" color="white">
          <v-img :src="logo" contain />
        </v-avatar>
        <div class="text-h6 text-sm-h4 font-weight-bold white--text px-4">
          แบบสำรวจรายชื่อผู้เข้าร่วมประชุม และปัญหา อุปสรรค
          ในการดำเนินการเกี่ยวกับที่ราชพัสดุ
        </div>
        <div class="text-body-2 text-sm-subtitle-1 white--text mt-2" style="opacity: 0.85">
          สำนักงานเขตพื้นที่การศึกษาประถมศึกษาอุดรธานี เขต 3
        </div>
      </v-container>
    </div>

    <survey-form />
  </div>
</template>

<script>
import SurveyForm from '../components/SurveyForm.vue'
import logo from '../assets/logo_udn3.png'

export default {
  name: 'SurveyView',
  components: { SurveyForm },
  data() {
    return { logo }
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #0d47a1, #00695c);
  padding-bottom: 24px;
}
</style>
