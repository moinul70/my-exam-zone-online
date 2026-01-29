<script setup>
import { ref } from 'vue'
import { auth } from '../auth'
import { useRouter } from 'vue-router'

// Define reactive state for form fields
const email = ref('')
const password = ref('')
const router =useRouter()

const handleLogin = () => {
  // Logic for form submission
  console.log("Logging in with:", email.value, password.value)
  alert(`Attempting login for: ${email.value}`)
   auth.login()      // Set global state to true
   router.push('/dashboard') // Redirect
}

</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12">
        <!-- Bootstrap Card for styling -->
        <div class="card shadow">
          <div class="card-body">
            <h3 class="card-title text-center mb-4">Login</h3>
            
            <form @submit.prevent="handleLogin">
              <!-- Email Input with Bootstrap margin utility -->
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input 
                  v-model="email" 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  placeholder="name@example.com"
                  required
                >
              </div>

              <!-- Password Input -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  v-model="password" 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  required
                >
              </div>

              <button type="submit" class="btn btn-primary w-100">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>