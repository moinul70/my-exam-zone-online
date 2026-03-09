<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import api from "../../services/api";
import { useRouter } from 'vue-router'


const examCompletedFlag = ref(false);
const questions = ref([]);
const answers = ref([]);
const error = ref(null);
const loading = ref(false);
const selectedAnswer = ref([]);
const meta = ref([]);
const isAnswerVisible = ref(false);
const estimatedTime = ref(0);
const examDetails = ref(null);
const pagination = ref({
  first: 1,
  last: 1,
  next: null,
  prev: null,
});
const topic = useRouter().currentRoute.value.params.topic
const fetchExamDetails = async (url = `/get-exam-details/${topic}`) => {
  try {
    const response = await api.get(url);
    examDetails.value = response.data.data || response.data;
    const timeInMinutes = examDetails.value.estimated_time || 0;
    estimatedTime.value = timeInMinutes * 60;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load";
  }

};
const fetchQuestions = async (url = `provider/exam/questions/topic/${topic}`) => {
  loading.value = true;
  error.value = null;

  try {
    const { data } = await api.get(url);

    const result = data.data || data;

    questions.value = result;
// console.log('Fetched Questions:', questions.value[0].question);

    // Update pagination from the API response
    pagination.value = {
      current_page: data.meta.current_page || 1,
      first_page: data.links.first || 1,
      last_page: data.links.last || 1,
      next_page_url: data.links.next,
      prev_page_url: data.links.prev,
    };

  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load";
  } finally {
    loading.value = false;
  }
};
const saveAndnextQuestion = async () => {
  if (!selectedAnswer.value || selectedAnswer.value.length === 0) {
    alert("Please select an answer");
    return;
  }
  // Convert to array if radio selected
  const answerIds = Array.isArray(selectedAnswer.value)
    ? selectedAnswer.value
    : [selectedAnswer.value];
  console.log('Submitting answers:', answerIds);

  await api.post("/take-exam", {

    topic_id: questions.value[0].topic_id,
    question_id: questions.value[0].id,
    answer_ids: answerIds,
  });

  // Reset
  selectedAnswer.value = [];

  if (pagination.value.next_page_url) {
    fetchQuestions(pagination.value.next_page_url);
  }
};
const nextQuestion = () => {
  if (pagination.value.next_page_url) {
    fetchQuestions(pagination.value.next_page_url);
    selectedAnswer.value = []; // Reset selection for next question
  }
};
const lastQuestion = () => {
  if (pagination.value.last_page) {
    fetchQuestions(pagination.value.last_page);
    selectedAnswer.value = [];
  }
};
const firstQuestion = () => {
  if (pagination.value.first_page) {
    fetchQuestions(pagination.value.first_page);
    selectedAnswer.value = [];
  }
};

const prevQuestion = () => {
  if (pagination.value.prev_page_url) {
    fetchQuestions(pagination.value.prev_page_url);
    selectedAnswer.value = [];
  }
};
const router = useRouter();
const completExam = async () => {
  if (!confirm("Are you sure you want to submit the exam? You cannot undo this action.")) {
    return;
  }

  try {
    await api.post("/submit-exam", {
      exam_id: examDetails.value.id
    });
    examCompletedFlag.value = true;
    alert("Exam completed successfully!");
    router.push({
      name: 'examResult',
      params: { examId: examDetails.value.id },
      state: { examCompletedFlag: examCompletedFlag.value } // Pass the flag as state
    });

  } catch (err) {
    console.error("Error completing exam:", err);
    alert(err.response?.data?.message || "Failed to complete exam");
  }
};
const completExamByTimesUp = async () => {

  try {
    await api.post("/submit-exam", {
      topic_id: questions.value[0].topic_id,
      exam_id: examDetails.value.id
    });
    examCompletedFlag.value = true;
    alert("Exam completed successfully!");
  } catch (err) {
    alert(err.response?.data?.message || "Failed to complete exam");
  }
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};


onMounted(async () => {
  // 1. Fetch questions (doesn't affect the timer ref)
  await fetchQuestions();
  await fetchExamDetails();
});

</script>
<template>
  <div class="container py-5">
    <div class="card shadow-sm border-0 rounded-3">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h4 class="mb-0 fw-bold text-primary">Exam Creator</h4>
        <button @click="addNewQuestion" class="btn btn-outline-primary btn-sm rounded-pill">
          <i class="bi bi-plus-lg me-1"></i> Add Question
        </button>
      </div>

      <div class="card-body bg-light">
        <form @submit.prevent="handleFinalSubmit">
          <div v-for="(item, qIndex) in questions" :key="qIndex" class="mb-4 bg-white p-4 rounded shadow-sm border">
            
            <div class="mb-3">
              <label class="form-label fw-bold text-muted small uppercase">Question {{ qIndex + 1 }}</label>
              <div class="input-group">
                <span class="input-group-text bg-primary text-white border-0"><i class="bi bi-pencil-square"></i></span>
                <input 
                  type="text" 
                  v-model="item.question" 
                  class="form-control form-control-lg border-start-0" 
                  placeholder="Enter your question here..."
                />
              </div>
            </div>

            <div class="ms-md-4 mt-3">
              <label class="form-label small fw-bold text-muted">Answers & Correct Key</label>
              <div v-for="(ans, aIndex) in item.answers" :key="aIndex" class="input-group mb-2 shadow-none">
                
                <div class="input-group-text bg-white border-end-0">
                  <input 
                    class="form-check-input mt-0" 
                    type="checkbox" 
                    :name="'correct-' + qIndex" 
                    :checked="ans.is_correct === 1"
                    @change="setCorrectAnswer(qIndex, aIndex)"
                  />
                </div>

                <input 
                  type="text" 
                  v-model="ans.answer" 
                  class="form-control border-start-0" 
                  :placeholder="'Option ' + String.fromCharCode(65 + aIndex)"
                />

                <button v-if="item.answers.length > 2" @click="removeAnswer(qIndex, aIndex)" class="btn btn-outline-danger border-start-0" type="button">
                  <i class="bi bi-x"></i>
                </button>
              </div>
              
              <button @click="addOption(qIndex)" type="button" class="btn btn-link btn-sm text-decoration-none p-0 mt-1">
                + Add Option
              </button>
            </div>
          </div>

          <div class="d-grid mt-5">
            <button type="submit" class="btn btn-primary btn-lg shadow" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isSubmitting ? 'Saving Exam...' : 'Finalize & Submit Exam' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.timer-card {
  min-width: 180px;
  text-align: center;
  transition: all 0.3s ease;
  /* Smooth color transitions */
  letter-spacing: 1px;
  font-family: 'Monaco', 'Consolas', monospace;
  /* Monospaced font keeps numbers from jumping */
}

/* The "Panic" animation for when time is very low */
.animate-pulse {
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
  }
}

/* Ensures the timer stays visible even when scrolling if you want */
.timer-wrapper {
  position: sticky;
  top: 10px;
  z-index: 1000;
}

.custom-answer-row {
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.custom-answer-row:hover {
  background-color: #f0f7ff;
  /* Light blue tint on hover */
  border-color: #cfe2ff;
}

/* Ensure the radio/checkbox is aligned with the top of multi-line text */
.form-check-input {
  margin-top: 0.3rem;
}

.answer-text {
  line-height: 1.5;
  color: #4a5568;
}
</style>
