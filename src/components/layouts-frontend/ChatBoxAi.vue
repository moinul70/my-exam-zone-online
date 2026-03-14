<template>
  <!-- Toggle Button -->
  <button class="chat-toggle" @click="toggleChat">
    💬 AI Chat
  </button>

  <!-- Chat Window -->
  <div v-if="open" class="chat-container">

    <!-- Header -->
    <div class="chat-header">
      <span>AI Assistant</span>
      <button class="close-btn" @click="toggleChat">✖</button>
    </div>

    <!-- Messages -->
    <div class="chat-body" ref="chatBody">
      <div v-for="(msg,index) in messages" :key="index" :class="msg.role">

        <div class="message">
          {{ msg.text }}
        </div>

      </div>

      <div v-if="loading" class="ai">
        <div class="message">AI is typing...</div>
      </div>

    </div>

    <!-- Input -->
    <div class="chat-input">

      <input
        v-model="message"
        @keyup.enter="sendMessage"
        placeholder="Ask something..."
      />

      <button @click="sendMessage">Send</button>

    </div>

  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import api from '../../services/api'

const open = ref(false)
const message = ref('')
const messages = ref([])
const loading = ref(false)
const chatBody = ref(null)

const toggleChat = () => {
  open.value = !open.value
}

const sendMessage = async () => {

  if(!message.value) return

  messages.value.push({
    role: 'user',
    text: message.value
  })

  const userMessage = message.value
  message.value = ''

  loading.value = true

  try {

    const response = await api.post('/chat/ai', {
      message: userMessage
    })

    messages.value.push({
      role: 'ai',
      text: response.data.response
    })

  } catch (error) {

    messages.value.push({
      role: 'ai',
      text: 'Error contacting AI'
    })

  }

  loading.value = false

  await nextTick()

  if(chatBody.value){
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }

}
</script>

<style scoped>

.chat-toggle{
  position: fixed;
  bottom:20px;
  right:20px;
  background:#4f46e5;
  color:white;
  border:none;
  padding:12px 18px;
  border-radius:30px;
  cursor:pointer;
  z-index:9999;
}

.chat-container{
  position:fixed;
  bottom:80px;
  right:20px;
  width:420px;
  height:520px;
  background:white;
  border-radius:10px;
  box-shadow:0 8px 30px rgba(0,0,0,0.2);
  display:flex;
  flex-direction:column;
  z-index:9999;
}

.chat-header{
  background:#4f46e5;
  color:white;
  padding:12px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.close-btn{
  background:none;
  border:none;
  color:white;
  cursor:pointer;
}

.chat-body{
  flex:1;
  padding:10px;
  overflow-y:auto;
  background:#f9fafb;
}

.user{
  text-align:right;
  margin-bottom:10px;
}

.ai{
  text-align:left;
  margin-bottom:10px;
}

.message{
  display:inline-block;
  padding:8px 12px;
  border-radius:8px;
  background:#e5e7eb;
}

.user .message{
  background:#6366f1;
  color:white;
}

.chat-input{
  display:flex;
  border-top:1px solid #eee;
}

.chat-input input{
  flex:1;
  border:none;
  padding:10px;
}

.chat-input button{
  background:#4f46e5;
  color:white;
  border:none;
  padding:10px 16px;
  cursor:pointer;
}

</style>