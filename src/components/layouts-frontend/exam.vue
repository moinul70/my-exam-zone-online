<script setup>
import { ref, onMounted, onUnmounted } from "vue";
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
    const examresult = response.data.data || response.data;
    console.log('Exam Details:', examresult);
    const timeInMinutes = examresult?.estimated_time || 0;
    estimatedTime.value = timeInMinutes * 60;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load";
  }

};
const fetchQuestions = async (url = `/exam/questions/topic/${topic}`) => {
  loading.value = true;
  error.value = null;

  try {
    const { data } = await api.get(url);

    const result = data.data || data;

    questions.value = result;

    // Extract answers from the first question safely
    if (result.length > 0) {
      answers.value = result[0].answers;
      meta.value = data.meta;

      questions.value[0].UserTakeExamDetail.forEach(detail => {
        if (detail.question_answers_id) {
          try {

            const parsedData = JSON.parse(detail.question_answers_id);

            if (Array.isArray(parsedData)) {

              const stringIds = parsedData.map(id => String(id));

              if (questions.value[0].correct_count > 1) {

                selectedAnswer.value.push(...stringIds);
              } else {

                selectedAnswer.value = stringIds[0];
              }
            } else {

              selectedAnswer.value = String(parsedData);
            }
          } catch (e) {
            // Fallback for plain strings
            selectedAnswer.value = String(detail.question_answers_id);
          }
        }
      });

    }

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
    // await api.post("/complete-exam", {
    //   topic_id: questions.value[0].topic_id,
    // });
    examCompletedFlag.value = true;
    alert("Exam completed successfully!");
    router.push({
      name: 'examResult',
      params: { topic },
      state: { examCompletedFlag: examCompletedFlag.value } // Pass the flag as state
    });

  } catch (err) {
    console.error("Error completing exam:", err);
    alert(err.response?.data?.message || "Failed to complete exam");
  }
};
const completExamByTimesUp = async () => {

  try {
    await api.post("/complete-exam", {
      topic_id: questions.value[0].topic_id,
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

let timerInterval = null;

const startTimer = () => {
  // Prevent multiple intervals from starting if fetchQuestions is called again
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    if (estimatedTime.value > 0) {
      estimatedTime.value--;
    } else {
      stopTimer();
      alert("Time's up! Exam will be submitted.");
      completExamByTimesUp();
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

onMounted(async () => {
  // 1. Fetch questions (doesn't affect the timer ref)
  await fetchQuestions();
  await fetchExamDetails();
  // 2. Start the countdown
  startTimer();
});

// Cleanup timer if the user leaves the page
onUnmounted(() => {
  stopTimer();
});
</script>
<template>
  <div class="container my-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8">
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span class="fw-semibold">Question {{ meta.current_page }} of {{ meta.total }}</span>
            <span class="badge bg-warning text-dark">Time Left: {{ formatTime(estimatedTime) }}</span>

            <button class="btn btn-danger" @click="
              completExam();
            isAnswerVisible = false;
            ">
              Final Submit
            </button>
          </div>

          <div class="card-body">
            <!-- Question -->
            <div v-if="questions.length > 0"
              class="question-container p-4 mb-4 rounded shadow-sm bg-light border-start border-primary border-4">
              <h5 class="question-text mb-0">
                <span class="text-muted me-2">Q:</span> {{ questions[0].question }}
              </h5>
            </div>

            <pre class="bg-light p-3 rounded small"></pre>

            <!-- Options -->
            <form>

              <div v-for="answer in answers" :key="answer.id" class="form-check mb-2">
                <input class="form-check-input" :type="questions[0].correct_count > 1 ? 'checkbox' : 'radio'"
                  name="answer" :id="'ans-' + answer.id" :value="answer.id" v-model="selectedAnswer" />

                <label class="form-check-label" :for="'ans-' + answer.id">
                  {{ answer.letter }} {{ answer.answer }}
                </label>
              </div>
            </form>
          </div>

          <!-- Footer Navigation -->
          <div class="card-footer d-flex justify-content-between align-items-center">
            <button class="btn btn-outline-warning" :disabled="!pagination.first_page || loading" @click="
              firstQuestion();
            isAnswerVisible = false;
            ">
              First
            </button>
            <button class="btn btn-outline-secondary" :disabled="!pagination.prev_page_url || loading" @click="
              prevQuestion();
            isAnswerVisible = false;
            ">
              Previous
            </button>

            <button class="btn btn-primary" :disabled="!pagination.next_page_url || loading" @click="
              nextQuestion();
            isAnswerVisible = false;
            ">
              Next
            </button>
            <button class="btn btn-secondary" :disabled="!pagination.last_page || loading" @click="
              lastQuestion();
            isAnswerVisible = false;
            ">
              Last
            </button>

            <button class="btn btn-success" @click="
              saveAndnextQuestion();
            isAnswerVisible = false;
            ">
              {{ pagination.next_page_url ? 'Save & Next' : 'Save' }}
            </button>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>
