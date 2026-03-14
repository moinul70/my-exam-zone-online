<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { useRouter } from 'vue-router'

const router = useRouter();
const topic = router.currentRoute.value.params.topic;
const examData = ref(null);

const startExam = () => {
 
  router.push({
    name: 'exam',
    params: { topic }
  });
};

onMounted(async () => {
  const response = await api.post('/prepare-exam', { topic: topic });
  examData.value = response.data;
  console.log('Exam Data:', examData.value);
});
</script>

<template>
  <div class="container my-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8">
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span class="badge bg-warning text-dark">Time Left: 01:45</span>
          </div>

          <div class="card-body">
            <h5 class="mb-3">Exam Topic: {{ topic }}</h5>
            <h5 class="mb-3">Total Questions: {{ examData?.question_count }}</h5>
            <h5 class="mb-3">Total Marks: {{ examData?.total_score }}</h5>
            <h5 class="mb-3">Total Time: {{ examData?.estimated_time }} mins</h5>
          <div class="alert alert-info border-info d-flex align-items-center" role="alert">
              <i class="bi bi-info-circle-fill me-2"></i>
              <div>
                <strong>Note:</strong> This exam is being recorded for proctoring purposes. 
                Do not stop the video and <strong>do not reload the page</strong>, or your attempt may be invalidated.
              </div>
            </div>
            <form>
              <div class="mb-2">
                <button type="button" class="btn btn-outline-warning" @click="startExam">
                  Start Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
