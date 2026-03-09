<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import api from "../../services/api";
import { useRouter } from 'vue-router'


const questions = ref([]);
const error = ref(null);
const loading = ref(false);
const selectedAnswer = ref([]);
const isSubmitting = ref(false);
const nextUrl = ref(null);  // Store the URL for the next page
const isLoading = ref(false);
const pagination = ref({
  first: 1,
  last: 1,
  next: null,
  prev: null,
});
const topic = useRouter().currentRoute.value.params.topic

const fetchQuestions = async (url = `provider/exam/questions/topic/${topic}`) => {
  loading.value = true;
  error.value = null;
  // if (isLoading.value) return;

  // isLoading.value = true;

  try {
    const { data } = await api.get(url);

    const result = data.data || data;

    questions.value = [...questions.value, ...result];
// console.log('Fetched Questions:', questions.value[0].question);
nextUrl.value = data.links.next;
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

const handleSubmit = async () => {
  isSubmitting.value = true;

  // We map the reactive array to a plain object for the API
  const payload = {
    // If you are editing an existing exam, pass its ID
    //prepare_exam_id: currentExamId.value, 
    
    questions: questions.value.map(q => {
      return {
        id: q.id,               // The ID of the question being edited
        question_text: q.question, // The updated text from the input box
        
        // Map the multiple answers for this specific question
        answers: q.answers.map(ans => {
          return {
            id: ans.id,         // The ID of the answer being edited
            answer_text: ans.answer, // The updated answer text
            is_correct: ans.is_correct // The 1 or 0 from your checkbox
          };
        })
      };
    })
  };

  try {
    console.log("Submitting payload:", payload);
    const response = await api.post('provider/exam/questions/update-batch', payload);
    toast.success("Changes saved successfully!");
  } catch (error) {
    console.error("Update failed", error.response?.data);
    alert("Check console for validation errors");
  } finally {
    isSubmitting.value = false;
  }
};


onMounted(async () => {
  // 1. Fetch questions (doesn't affect the timer ref)
  await fetchQuestions();
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
        <form @submit.prevent="handleSubmit">
          <div v-for="(item, qIndex) in questions" :key="qIndex" class="mb-4 bg-white p-4 rounded shadow-sm border">
            
            <div class="mb-3">
              <label class="form-label fw-bold text-muted small uppercase">Question {{ qIndex + 1 }}</label>
              <div class="input-group">
                <span class="input-group-text bg-primary text-white border-0"><i class="bi bi-pencil-square"></i></span>
               <textarea 
  v-model="item.question" 
  class="form-control border-start-0" 
  @input="($event) => { $event.target.style.height = 'auto'; $event.target.style.height = $event.target.scrollHeight + 'px'; }"
  style="overflow:hidden"
></textarea>
              </div>
            </div>

            <div class="ms-md-4 mt-3">
              <label class="form-label small fw-bold text-muted">Answers & Correct Key</label>
              <div v-for="(ans, aIndex) in item.answers" :key="aIndex" class="input-group mb-2 shadow-none">
                
                <div class="input-group-text bg-white border-end-0">
  <input 
    class="form-check-input mt-0" 
    type="checkbox" 
    v-model="ans.is_correct"
    :true-value="1"
    :false-value="0"
    :name="'correct_check_' + qIndex + '_' + aIndex"
  />
</div>

<input 
  type="text" 
  v-model="ans.answer" 
  class="form-control border-start-0 transition-all" 
  :class="{ 'border-success bg-success-subtle fw-bold': ans.is_correct === 1 }"
  :placeholder="'Option ' + String.fromCharCode(64 + aIndex)"
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
              {{ isSubmitting ? 'Saving...' : 'Finalize & Submit' }}
            </button>
          </div>
          <div class="text-center mt-5 mb-4">
      <button 
        v-if="nextUrl" 
        @click="fetchQuestions(nextUrl)" 
        :disabled="isLoading"
        class="btn btn-outline-primary px-5 rounded-pill shadow-sm"
      >
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
        {{ isLoading ? 'Loading...' : 'Load More Questions' }}
      </button>
      
      <p v-else class="text-muted small">
        <i class="bi bi-check2-all me-1"></i> All questions loaded
      </p>
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
