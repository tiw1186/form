import Vue from 'vue'
import VueRouter from 'vue-router'
import SurveyView from '../views/SurveyView.vue'
import FinanceRecordView from '../views/FinanceRecordView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'survey',
    component: SurveyView,
    meta: { title: 'แบบสำรวจที่ราชพัสดุ สพป.อุดรธานี เขต 3' }
  },
  {
    path: '/finance-record',
    name: 'finance-record',
    component: FinanceRecordView,
    meta: { title: 'ระบบกรอกเงินคงเหลือประจำวันโรงเรียน' }
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
