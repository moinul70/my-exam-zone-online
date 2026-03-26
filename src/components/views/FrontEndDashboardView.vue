<template>
  <div class="cosmos-wrap">
    <!-- Animated background orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="grid-overlay"></div>

    <div class="content-wrap">
      <!-- Header -->
      <div class="header">
        <div class="eyebrow">
          <span class="dot"></span>
          SKILL ASSESSMENT PLATFORM
          <span class="dot"></span>
        </div>
        <h1 class="main-title">
          Choose Your
          <span class="title-accent">Domain</span>
        </h1>
        <p class="subtitle">
          Select a technology, sharpen your skills, and prove your expertise.
        </p>
      </div>

      <!-- Cards Grid -->
      <div class="cards-grid">
        <div
          v-for="(topic, i) in topics"
          :key="topic.name"
          class="topic-card"
          :style="{ '--accent': topic.accent, '--accent-dim': topic.accentDim, animationDelay: i * 0.12 + 's' }"
        >
          <!-- Glow border -->
          <div class="card-glow"></div>

          <!-- Card inner -->
          <div class="card-inner">
            <!-- Top row -->
            <div class="card-top">
              <div class="icon-wrap">
                <i :class="topic.icon"></i>
              </div>
              <span class="level-pill">{{ topic.level }}</span>
            </div>

            <!-- Body -->
            <div class="card-body">
              <h3 class="topic-name">{{ topic.name }}</h3>
              <p class="topic-desc">{{ topic.desc }}</p>
            </div>

            <!-- Tags -->
            <div class="tag-row">
              <span v-for="tag in topic.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <!-- Actions -->
            <div class="actions">
              <router-link
                class="btn-primary-action"
                :to="{ name: 'practice', params: { topic: topic.slug } }"
              >
                <span>Practice</span>
                <i class="bi bi-arrow-right"></i>
              </router-link>
              <router-link
                class="btn-secondary-action"
                :to="{ name: 'prepare-exam', params: { topic: topic.slug } }"
              >
                Take Exam
              </router-link>
            </div>
          </div>

          <!-- Bottom accent line -->
          <div class="card-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const topics = ref([
  {
    name: "PHP",
    slug: "php",
    desc: "Core PHP, OOP patterns, Laravel framework & scalable backend architecture.",
    level: "Beginner → Advanced",
    icon: "bi bi-code-slash",
    accent: "#38bdf8",
    accentDim: "rgba(56,189,248,0.12)",
    tags: ["Laravel", "OOP", "REST API"],
  },
  {
    name: "Golang",
    slug: "golang",
    desc: "Concurrency models, goroutines, channels & high-performance API design.",
    level: "Intermediate",
    icon: "bi bi-cpu",
    accent: "#34d399",
    accentDim: "rgba(52,211,153,0.12)",
    tags: ["Goroutines", "gRPC", "Microservices"],
  },
  {
    name: "AWS",
    slug: "aws",
    desc: "Cloud architecture, EC2, S3, IAM policies & DevOps best practices.",
    level: "Cert Ready",
    icon: "bi bi-cloud-fill",
    accent: "#fb923c",
    accentDim: "rgba(251,146,60,0.12)",
    tags: ["EC2", "S3", "IAM", "Lambda"],
  },
  {
    name: "Physics",
    slug: "physics-class-9",
    desc: "Motion, force, energy laws & exam-focused conceptual questions.",
    level: "Class 9",
    icon: "bi bi-lightning-charge-fill",
    accent: "#a78bfa",
    accentDim: "rgba(167,139,250,0.12)",
    tags: ["Mechanics", "Energy", "Waves"],
  },
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Root ── */
.cosmos-wrap {
  min-height: 100vh;
  background: #060912;
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
  padding: 60px 20px 80px;
}

/* ── Background Effects ── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}
.orb-1 {
  width: 520px; height: 520px;
  background: radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%);
  top: -180px; left: -180px;
  animation: drift 12s ease-in-out infinite alternate;
}
.orb-2 {
  width: 440px; height: 440px;
  background: radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%);
  bottom: -140px; right: -140px;
  animation: drift 15s ease-in-out infinite alternate-reverse;
}
.orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%);
  top: 50%; left: 55%;
  animation: drift 10s ease-in-out infinite alternate;
}

@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(30px, 40px) scale(1.08); }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

/* ── Content ── */
.content-wrap {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 0 auto;
}

/* ── Header ── */
.header {
  text-align: center;
  margin-bottom: 56px;
  animation: fadeUp 0.7s ease both;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  margin-bottom: 18px;
}
.dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  display: inline-block;
}
.main-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}
.title-accent {
  background: linear-gradient(90deg, #38bdf8, #a78bfa 50%, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.subtitle {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.38);
  font-weight: 300;
  max-width: 480px;
  margin: 0 auto;
}

/* ── Grid ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
}

/* ── Card ── */
.topic-card {
  position: relative;
  border-radius: 20px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
  cursor: pointer;
  animation: fadeUp 0.6s ease both;
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
              box-shadow 0.35s ease,
              border-color 0.35s ease;
}
.topic-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent);
  box-shadow:
    0 0 0 1px var(--accent),
    0 20px 60px rgba(0,0,0,0.5),
    0 0 80px color-mix(in srgb, var(--accent) 15%, transparent);
}

/* Glow on hover */
.card-glow {
  position: absolute;
  inset: 0;
  background: var(--accent-dim);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
  border-radius: 20px;
}
.topic-card:hover .card-glow { opacity: 1; }

/* Bottom accent line */
.card-line {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0;
  transition: opacity 0.35s ease;
}
.topic-card:hover .card-line { opacity: 1; }

/* ── Card Inner ── */
.card-inner {
  padding: 24px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Top Row */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.icon-wrap {
  width: 46px; height: 46px;
  border-radius: 14px;
  background: var(--accent-dim);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem;
  color: var(--accent);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.topic-card:hover .icon-wrap {
  transform: scale(1.1) rotate(-4deg);
  box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 35%, transparent);
}
.level-pill {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-dim);
  border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
  padding: 4px 10px;
  border-radius: 100px;
}

/* Body */
.card-body { display: flex; flex-direction: column; gap: 6px; }
.topic-name {
  font-family: 'Syne', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}
.topic-desc {
  font-size: 0.82rem;
  line-height: 1.55;
  color: rgba(255,255,255,0.42);
  margin: 0;
}

/* Tags */
.tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-size: 10px;
  font-weight: 500;
  color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 3px 9px;
  border-radius: 6px;
}

/* Actions */
.actions { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }

.btn-primary-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 12px;
  background: var(--accent);
  color: #060912;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: opacity 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}
.btn-primary-action:hover {
  opacity: 0.88;
  transform: scale(1.02);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--accent) 40%, transparent);
}
.btn-primary-action i {
  transition: transform 0.25s ease;
}
.btn-primary-action:hover i {
  transform: translateX(4px);
}

.btn-secondary-action {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.55);
  font-weight: 500;
  font-size: 0.85rem;
  text-decoration: none;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
}
.btn-secondary-action:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.85);
}

/* ── Animation ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .cosmos-wrap { padding: 40px 14px 60px; }
  .cards-grid { grid-template-columns: 1fr; }
}
</style>