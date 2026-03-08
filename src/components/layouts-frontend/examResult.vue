<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { useRouter } from 'vue-router'

const router = useRouter();
const examId = router.currentRoute.value.params.examId;
const examResultData = ref(null);

const fetchExamDetails = async (url = `/exam-result/${examId}`) => {
  try {
    const response = await api.get(url);
    examResultData.value = response.data.result;
    console.log('Exam Result Data:', examResultData.value);
  } catch (error) {
    console.error('Error fetching exam result:', error);
  }
}

onMounted(async () => {
  await fetchExamDetails();

});
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-7">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden">

          <div class="card-header bg-primary bg-gradient py-4 text-center text-white">
            <h3 class="fw-bold mb-0">Exam Summary</h3>
            <p class="opacity-75 mb-0">Topic: {{ examResultData?.examDetails[0]?.topic || 'N/A' }}</p>
          </div>

          <div class="card-body p-4">
            <div class="text-center mb-5">
              <div class="display-4 fw-bold text-primary mb-1">
                {{ examResultData?.examDetails[0].total_achieved_score }}
              </div>
              <div class="text-uppercase tracking-wider text-muted small fw-bold">Total Points Earned</div>
            </div>

            <div class="row g-3">
              <div class="col-6">
                <div class="p-3 border rounded-3 bg-light h-100 text-center">
                  <div class="fs-4 fw-bold text-dark">{{ examResultData?.examDetails[0]?.question_count }}</div>
                  <div class="text-muted small">Questions</div>
                </div>
              </div>

              <div class="col-6">
                <div class="p-3 border rounded-3 bg-success-subtle h-100 text-center">
                  <div class="fs-4 fw-bold text-success">{{ examResultData?.correct_answers_count }}</div>
                  <div class="text-muted small">Correct</div>
                </div>
              </div>

              <div class="col-12">
                <div class="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                  <span class="text-muted"><i class="bi bi-clock-history me-2"></i>Estimated Time</span>
                  <span class="fw-bold">{{ examResultData?.examDetails[0]?.estimated_time }} mins</span>
                </div>
              </div>
            </div>

            <div class="mt-5 d-grid gap-2">
              <!-- <button class="btn btn-primary btn-lg rounded-pill shadow-sm">
                View Detailed Answers
              </button> -->
              <router-link :to="{ name: 'dashboard-front' }" class="btn btn-outline-secondary border-0">
                Back to Dashboard
              </router-link>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.3s ease;
}

.tracking-wider {
  letter-spacing: 1px;
}

.rounded-4 {
  border-radius: 1.5rem !important;
}
</style>
