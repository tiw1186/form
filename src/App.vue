<template>
  <v-app>
    <v-app-bar color="white" flat app elevation="1">
      <v-avatar size="40" class="mr-3" tile>
        <v-img :src="logo" contain />
      </v-avatar>
      <v-toolbar-title class="text-body-2 text-sm-h6 font-weight-bold primary--text">
        สำนักงานเขตพื้นที่การศึกษาประถมศึกษาอุดรธานี เขต 3
      </v-toolbar-title>
    </v-app-bar>

    <v-main class="app-main">
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
    </v-main>

    <v-footer color="grey darken-3" dark app absolute padless>
      <v-col class="text-center pb-1" cols="12">
        <div class="text-caption">
          &copy; {{ new Date().getFullYear() }} สำนักงานเขตพื้นที่การศึกษาประถมศึกษาอุดรธานี เขต 3
        </div>
        <div class="text-caption grey--text" style="font-size: 0.7rem !important">
          development by chatrapee suwannalert
        </div>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import SurveyForm from './components/SurveyForm.vue'
import logo from './assets/logo_udn3.png'

export default {
  name: 'App',
  components: { SurveyForm },
  data() {
    return { logo }
  }
}
</script>

<style scoped>
.app-main {
  background-color: #f2f4f8;
}

.hero {
  background: linear-gradient(135deg, #0d47a1, #00695c);
  padding-bottom: 24px;
}
</style>
