import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    themes: {
      light: {
        primary: '#0D47A1',
        secondary: '#00695C',
        accent: '#F9A825',
        success: '#2E7D32',
        error: '#C62828'
      }
    }
  }
})
