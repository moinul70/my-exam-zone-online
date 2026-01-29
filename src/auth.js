import { reactive } from 'vue'

export const auth = reactive({
  isAuthenticated: false,
  login() { this.isAuthenticated = true },
  logout() { this.isAuthenticated = false }
})
