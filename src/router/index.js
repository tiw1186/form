import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SurveyView from '../views/SurveyView.vue'
import FinanceRecordView from '../views/FinanceRecordView.vue'
import Udn3ExpertView from '../views/Udn3ExpertView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'สพป.อุดรธานี เขต 3' }
  },
  {
    path: '/form',
    name: 'survey',
    component: SurveyView,
    meta: { title: 'แบบสำรวจที่ราชพัสดุ สพป.อุดรธานี เขต 3' }
  },
  {
    path: '/finance-record',
    name: 'finance-record',
    component: FinanceRecordView,
    meta: { title: 'ระบบกรอกเงินคงเหลือประจำวันโรงเรียน' }
  },
  {
    path: '/udn3-expert',
    name: 'udn3-expert',
    component: Udn3ExpertView,
    meta: { title: 'ผลงานประเมินวิทยฐานะเชี่ยวชาญ - นางแสงเดือน สุขรมย์' }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) document.title = to.meta.title
})

export default router
