<script setup>
import { ref, onBeforeUnmount } from 'vue';

const emit = defineEmits(['video-ready']);
const videoPreview = ref(null);
const mediaRecorder = ref(null);
const stream = ref(null);
const isRecording = ref(false);

const startCapture = async () => {
  try {
    const constraints = { 
      video: { width: 1280, height: 720 }, // Try explicit resolution
      audio: true 
    };
    
    stream.value = await navigator.mediaDevices.getUserMedia(constraints);
    videoPreview.value.srcObject = stream.value;
    console.log("Camera started successfully");
  } catch (err) {
    // This will tell you EXACTLY why it failed
    console.error("Camera Error Type:", err.name); 
    console.error("Camera Error Message:", err.message);
    
    if (err.name === 'NotAllowedError') {
      alert("Please enable camera permissions in your browser settings.");
    } else if (err.name === 'NotFoundError') {
      alert("No camera detected. Please plug in a webcam.");
    }
  }
};

let chunks = []; 

const startRecording = () => {
  // 2. Reset the array every time a new recording starts
  chunks = []; 
  
  mediaRecorder.value = new MediaRecorder(stream.value);
  
  mediaRecorder.value.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.value.start();
  isRecording.value = true;
};

const stopRecording = () => {
  return new Promise((resolve) => {
    // Safety check if mediaRecorder hasn't been initialized
    if (!mediaRecorder.value) {
      resolve(null);
      return;
    }

    mediaRecorder.value.onstop = () => {
      // 3. Now 'chunks' is accessible here and contains data
      const blob = new Blob(chunks, { type: 'video/webm' });
      isRecording.value = false;
      
      emit('video-ready', blob); 
      resolve(blob); 
    };

    mediaRecorder.value.stop();
  });
};
// Cleanup camera when the user leaves the exam
onBeforeUnmount(() => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
  }
});

defineExpose({ startCapture, startRecording, stopRecording });
</script>

<template>
  <div class="recorder-box border rounded p-2 bg-light">
    <!-- <video ref="videoPreview" autoplay muted playsinline class="w-100 rounded bg-dark"></video> -->
   <div class="hidden-recorder" style="display: none;">
    <video ref="videoPreview" autoplay muted playsinline></video>
  </div>
  </div>
</template>