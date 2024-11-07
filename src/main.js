import { createApp } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        primary: 'rgb(45, 31, 47)',
        background: 'rgb(45, 31, 47)',
      },
    },
  },
})

createApp(App).use(vuetify).mount('#app')
