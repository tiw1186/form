<template>
  <div class="disabled-page d-flex align-center justify-center">
    <v-container style="max-width: 560px">
      <v-card elevation="8" class="pa-8 pa-sm-10 text-center rounded-xl">
        <v-avatar color="#F5F5F5" size="88" class="mb-2">
          <v-icon color="#9E9E9E" size="46">mdi-lock-outline</v-icon>
        </v-avatar>
        <div class="text-h5 font-weight-bold mt-4">ระบบนี้ปิดการใช้งานไปแล้ว</div>
        <div class="text-body-1 grey--text text--darken-1 mt-3">
          ขออภัยในความไม่สะดวก ระบบนี้ไม่สามารถใช้งานได้อีกต่อไป
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'SystemDisabledView'
}
</script>

<style scoped>
.disabled-page {
  min-height: 100vh;
  background-color: #f7f5ec;
}
</style>
