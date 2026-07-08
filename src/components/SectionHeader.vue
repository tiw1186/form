<template>
  <div class="d-flex align-start mb-3">
    <v-avatar color="primary" size="34" class="mr-3 mt-1" style="flex: none">
      <span class="white--text text-subtitle-1 font-weight-bold">{{ number }}</span>
    </v-avatar>
    <div>
      <div class="text-h6 font-weight-bold">
        {{ title }}
        <span v-if="required" class="error--text">*</span>
      </div>
      <div v-if="hint" class="text-body-2 grey--text text--darken-1">
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SectionHeader',
  props: {
    number: { type: [String, Number], required: true },
    title: { type: String, required: true },
    required: { type: Boolean, default: false },
    hint: { type: String, default: '' }
  }
}
</script>
