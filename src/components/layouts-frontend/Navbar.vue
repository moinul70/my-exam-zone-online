<script setup>
import { useAuthStore } from '../../auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="cosmos-nav app-header">
    <!-- Grid overlay strip -->
    <div class="nav-grid"></div>

    <!-- Left glow accent -->
    <div class="nav-glow-left"></div>
    <div class="nav-glow-right"></div>

    <div class="nav-inner">
      <!-- Brand -->
      <a href="/" class="brand">
        <div class="brand-icon">
          <!-- <i class="bi bi-layers-fill"></i> -->
          <img src="/public/examzone-logo.png" alt="ExamZone Logo" width="40" height="40" />
        </div>
        <span class="brand-name">Exam<span class="brand-accent">Zone</span></span>
      </a>

      <!-- Right Side -->
      <div class="nav-right">
        <!-- Home link -->
        <a href="/" class="nav-link-item d-none d-md-flex">
          <i class="bi bi-house"></i>
          <span>Home</span>
        </a>

        <!-- Auth User Dropdown -->
        <div class="user-menu" v-if="auth.isAuthenticated">
          <button class="user-trigger" data-bs-toggle="dropdown" aria-expanded="false">
            <div class="avatar">
              {{ auth.user?.charAt(0)?.toUpperCase() }}
            </div>
            <span class="username">{{ auth.user }}</span>
            <i class="bi bi-chevron-down chev"></i>
          </button>

          <ul class="dropdown-menu dropdown-menu-end cosmos-dropdown">
            <li class="dropdown-user-info">
              <div class="dropdown-avatar">{{ auth.user?.charAt(0)?.toUpperCase() }}</div>
              <div>
                <div class="dropdown-username">{{ auth.user }}</div>
                <div class="dropdown-role">Learner</div>
              </div>
            </li>
            <li><hr class="cosmos-divider"></li>
            <li>
              <a class="cosmos-dropdown-item" href="#">
                <i class="bi bi-person"></i> Profile
              </a>
            </li>
            <li>
              <a class="cosmos-dropdown-item" href="#">
                <i class="bi bi-gear"></i> Settings
              </a>
            </li>
            <li><hr class="cosmos-divider"></li>
            <li>
              <button @click="handleLogout" class="cosmos-dropdown-item logout-btn">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
          </ul>
        </div>

        <!-- Guest CTA -->
        <a v-else href="/login" class="btn-signin">
          Sign In <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Navbar Shell ── */
.cosmos-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  font-family: 'DM Sans', sans-serif;
  background: rgba(6, 9, 18, 0.82);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow: visible;
}

/* Grid texture */
.nav-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

/* Ambient glows */
.nav-glow-left {
  position: absolute;
  top: -40px; left: -60px;
  width: 260px; height: 120px;
  background: radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%);
  pointer-events: none;
  filter: blur(20px);
}
.nav-glow-right {
  position: absolute;
  top: -40px; right: -60px;
  width: 260px; height: 120px;
  background: radial-gradient(ellipse, rgba(167,139,250,0.10) 0%, transparent 70%);
  pointer-events: none;
  filter: blur(20px);
}

/* ── Inner Layout ── */
.nav-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 32px;
  height: 62px;
}

/* ── Brand ── */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.brand-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: rgba(56,189,248,0.12);
  border: 1px solid rgba(56,189,248,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  color: #38bdf8;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.brand:hover .brand-icon {
  transform: rotate(-8deg) scale(1.1);
  box-shadow: 0 0 20px rgba(56,189,248,0.35);
}
.brand-name {
  font-family: 'Syne', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.01em;
}
.brand-accent {
  background: linear-gradient(90deg, #38bdf8, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Right Side ── */
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Nav link */
.nav-link-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  color: rgba(255,255,255,0.45);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.25s, color 0.25s;
  border: 1px solid transparent;
}
.nav-link-item:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.8);
}

/* ── User Menu ── */
.user-menu {
  position: relative;
}
.user-trigger {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 12px 5px 5px;
  border-radius: 100px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
  transition: background 0.25s, border-color 0.25s;
  color: #fff;
}
.user-trigger:hover {
  background: rgba(255,255,255,0.07);
  border-color: rgba(255,255,255,0.14);
}

.avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #a78bfa);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #060912;
  flex-shrink: 0;
}
.username {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255,255,255,0.75);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chev {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.3);
  transition: transform 0.25s ease;
}
.user-trigger[aria-expanded="true"] .chev {
  transform: rotate(180deg);
}

/* ── Cosmos Dropdown ── */
.cosmos-dropdown {
  background: #0d1120 !important;
  border: 1px solid rgba(255,255,255,0.09) !important;
  border-radius: 16px !important;
  padding: 8px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) !important;
  min-width: 210px;
  margin-top: 8px !important;
  animation: dropIn 0.2s cubic-bezier(0.22,1,0.36,1) both;
}

@keyframes dropIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* User info row */
.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px 12px;
}
.dropdown-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #a78bfa);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: #060912;
  flex-shrink: 0;
}
.dropdown-username {
  font-family: 'Syne', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
}
.dropdown-role {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.3);
  margin-top: 1px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Divider */
.cosmos-divider {
  border-color: rgba(255,255,255,0.06) !important;
  margin: 6px 0 !important;
}

/* Dropdown items */
.cosmos-dropdown-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 500;
  color: rgba(255,255,255,0.5);
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  text-align: left;
}
.cosmos-dropdown-item:hover {
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.85);
}
.cosmos-dropdown-item i {
  font-size: 0.9rem;
  width: 16px;
  text-align: center;
}

/* Logout */
.logout-btn {
  color: rgba(251, 100, 100, 0.65);
}
.logout-btn:hover {
  background: rgba(251,100,100,0.08) !important;
  color: #fb6464 !important;
}

/* ── Sign In CTA ── */
.btn-signin {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 18px;
  border-radius: 12px;
  background: linear-gradient(90deg, #38bdf8, #a78bfa);
  color: #060912;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  transition: opacity 0.25s, transform 0.25s;
}
.btn-signin:hover {
  opacity: 0.88;
  transform: scale(1.03);
}
.btn-signin i {
  transition: transform 0.25s;
}
.btn-signin:hover i {
  transform: translateX(3px);
}
.app-header {
  width: 100% !important;
  max-width: 100% !important;
  left: 0 !important;
  right: 0 !important;
  margin-left: 0 !important;
}
</style>