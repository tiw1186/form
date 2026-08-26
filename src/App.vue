<template>
  <v-app>
    <v-app-bar class="app-bar-gradient" flat app elevation="1">
      <v-avatar size="40" class="mr-3" tile>
        <v-img :src="logo" contain />
      </v-avatar>
      <v-toolbar-title class="text-body-2 text-sm-h6 font-weight-bold white--text">
        สำนักงานเขตพื้นที่การศึกษาประถมศึกษาอุดรธานี เขต 3
      </v-toolbar-title>
    </v-app-bar>

    <v-main class="app-main">
      <router-view />
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
import logo from './assets/logo_udn3.png'

export default {
  name: 'App',
  data() {
    return { logo }
  }
}
</script>

<style scoped>
.app-main {
  background-color: #f2f4f8;
}

.app-bar-gradient,
.app-bar-gradient ::v-deep .v-toolbar__content {
  background: linear-gradient(90deg, #1565c0, #0d47a1) !important;
}
</style>
