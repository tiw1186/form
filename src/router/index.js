import Vue from 'vue'
import VueRouter from 'vue-router'
import SurveyView from '../views/SurveyView.vue'
import FinanceRecordView from '../views/FinanceRecordView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'survey', component: SurveyView },
  { path: '/finance-record', name: 'finance-record', component: FinanceRecordView }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
