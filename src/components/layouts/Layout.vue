<template>

    <div class="app-wrapper">
      <Navbar />
      <Sidebar />
      <!--begin::App Main-->
      <main class="app-main">
       <router-view />
      </main>

      <Footer />
    </div>

</template>

<script setup>
import Navbar from "./Navbar.vue";
import Sidebar from "./Sidebar.vue";
import Footer from "./Footer.vue";

import { auth } from "../../auth";
import { useRouter } from "vue-router";
const handleLogout = () => {
  // Logic for form submission
  auth.logout(); // Set global state to true
  router.push("/"); // Redirect
};
</script>
