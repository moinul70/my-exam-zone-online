<script setup>
import { auth } from '../auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['toggle-sidebar'])

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="main-header navbar navbar-expand navbar-white navbar-light border-bottom">
    <div class="container-fluid">
      <!-- Left navbar links -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <!-- Sidebar Toggle Button -->
          <a class="nav-link" href="#" @click.prevent="$emit('toggle-sidebar')" role="button">
            <i class="bi bi-list fs-4"></i>
          </a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
          <router-link to="/dashboard" class="nav-link">Home</router-link>
        </li>
      </ul>

      <!-- Right navbar links -->
      <ul class="navbar-nav ms-auto">
        <!-- Notifications Dropdown -->
        <li class="nav-item dropdown">
          <a class="nav-link" data-bs-toggle="dropdown" href="#">
            <i class="bi bi-bell"></i>
            <span class="badge bg-warning navbar-badge">15</span>
          </a>
          <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end">
            <span class="dropdown-header">15 Notifications</span>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item">New Message</a>
            <div class="dropdown-divider"></div>
            <button @click="handleLogout" class="dropdown-item text-danger">
              <i class="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar-badge {
  font-size: .6rem;
  font-weight: 300;
  padding: 2px 4px;
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
