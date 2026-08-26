<template>
  <div>
    <div class="hero">
      <v-container class="text-center py-10 py-sm-14">
        <v-avatar size="84" class="mb-4 elevation-6" color="white">
          <v-img :src="logo" contain />
        </v-avatar>
        <div class="text-h5 text-sm-h4 font-weight-bold white--text px-4">
          ระบบ สพป.อุดรธานี เขต 3
        </div>
        <div class="text-body-2 text-sm-subtitle-1 white--text mt-2" style="opacity: 0.85">
          เลือกระบบที่ต้องการใช้งาน
        </div>
      </v-container>
    </div>

    <v-container class="content-lift pb-10" style="max-width: 900px">
      <v-row>
        <v-col v-for="item in systems" :key="item.to" cols="12" sm="6">
          <v-card
            elevation="6"
            class="pa-6 rounded-xl system-card"
            :to="item.to"
          >
            <v-avatar :color="item.color" size="56" class="mb-4">
              <v-icon color="white" size="28">{{ item.icon }}</v-icon>
            </v-avatar>
            <div class="text-h6 font-weight-bold mb-2">{{ item.title }}</div>
            <div class="text-body-2 grey--text text--darken-1">{{ item.description }}</div>
            <div class="d-flex align-center mt-4 system-card__link" :style="{ color: item.color }">
              เข้าสู่ระบบ
              <v-icon small right :color="item.color">mdi-arrow-right</v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import logo from '../assets/logo_udn3.png'

export default {
  name: 'HomeView',
  data() {
    return {
      logo,
      systems: [
        {
          to: '/form',
          title: 'แบบสำรวจรายชื่อผู้เข้าร่วมประชุม และปัญหา อุปสรรค',
          description: 'แบบสำรวจในการดำเนินการเกี่ยวกับที่ราชพัสดุของโรงเรียน',
          icon: 'mdi-clipboard-text-outline',
          color: '#0D47A1'
        },
        {
          to: '/finance-record',
          title: 'ระบบกรอกเงินคงเหลือประจำวันโรงเรียน',
          description: 'ค้นหาโรงเรียน กรอกยอดเงิน และบันทึกข้อมูลประจำวัน',
          icon: 'mdi-cash-multiple',
          color: '#1F6F4A'
        }
      ]
    }
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #0d47a1, #00695c);
  padding-bottom: 64px;
}

.content-lift {
  margin-top: -40px;
  position: relative;
  z-index: 1;
}

.system-card {
  background-color: #fff;
  text-decoration: none;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  height: 100%;
}

.system-card:hover {
  box-shadow: 0 10px 24px rgba(13, 71, 161, 0.16) !important;
  transform: translateY(-2px);
}

.system-card__link {
  font-weight: 700;
  font-size: 0.9rem;
}
</style>
