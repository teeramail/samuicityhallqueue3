<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import axios from 'axios';
import { getApiUrl, API_CONFIG } from '@/config/api.js';

const audioEl = ref(null);
const currentFileIndex = ref(0);
const filenames = ref([]);
const isPlaying = ref(false);
const lastProcessedQueueId = ref(null);
let checkInterval = null;

// Sound files base URL
const SOUND_BASE_URL = "https://koh-samui.com/sound";

function playNextFile() {
  if (filenames.value.length === 0) return;
  
  if (audioEl.value) {
    audioEl.value.src = filenames.value[currentFileIndex.value];
    audioEl.value.play()
      .then(() => {
        isPlaying.value = true;
        console.log(`🔊 Playing sound: ${filenames.value[currentFileIndex.value]}`);
      })
      .catch(error => {
        console.error('Error playing sound:', error);
        handleSoundEnd(); // Skip to next file on error
      });
  }
}

function handleSoundEnd() {
  currentFileIndex.value++;
  if (currentFileIndex.value >= filenames.value.length) {
    // Finished playing all sounds for this queue
    clearCurrentPlayback();
  } else {
    // Play next sound file
    playNextFile();
  }
}

function clearCurrentPlayback() {
  isPlaying.value = false;
  currentFileIndex.value = 0;
  filenames.value = [];
  if (audioEl.value) {
    audioEl.value.src = "";
  }
}

function createSoundSequence(queueNumber, counterNumber) {
  const sounds = [];
  
  // Start with invitation sound
  sounds.push('invite');
  
  // Add queue number digits
  const queueDigits = queueNumber.toString().split('');
  sounds.push(...queueDigits);
  
  // Add "channel" announcement
  sounds.push('chanel');
  
  // Add counter number digits
  const counterDigits = counterNumber.toString().split('');
  sounds.push(...counterDigits);
  
  // Convert to full URLs
  return sounds.map(sound => `${SOUND_BASE_URL}/${sound}.mp3`);
}

async function checkForNewQueues() {
  if (isPlaying.value) return; // Don't check while playing
  
  try {
    const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.QUEUE_HISTORY));
    const queueHistory = response.data || [];
    
    if (queueHistory.length > 0) {
      const latestQueue = queueHistory[0]; // Most recent queue
      
      // Check if this is a new queue we haven't announced yet
      if (lastProcessedQueueId.value !== latestQueue.id) {
        lastProcessedQueueId.value = latestQueue.id;
        
        // Create sound sequence for this queue
        filenames.value = createSoundSequence(latestQueue.queueNumber, latestQueue.counterNumber);
        currentFileIndex.value = 0;
        
        console.log(`🔊 New queue detected: Queue ${latestQueue.queueNumber} from Counter ${latestQueue.counterNumber}`);
        console.log('🎵 Sound sequence:', filenames.value);
        
        // Start playing the announcement
        playNextFile();
      }
    }
  } catch (error) {
    console.error('❌ Error checking for new queues:', error);
  }
}

onMounted(() => {
  // Create audio element
  audioEl.value = new Audio();
  audioEl.value.preload = 'auto';
  
  // Add event listeners
  audioEl.value.addEventListener("ended", handleSoundEnd);
  audioEl.value.addEventListener("error", (error) => {
    console.error('Audio error:', error);
    handleSoundEnd(); // Skip to next on error
  });
  
  // Start checking for new queues every 2 seconds
  checkInterval = setInterval(checkForNewQueues, 2000);
  
  // Check immediately
  checkForNewQueues();
  
  console.log('🔊 OnTV Sound System initialized');
});

onBeforeUnmount(() => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  
  if (audioEl.value) {
    audioEl.value.removeEventListener("ended", handleSoundEnd);
    audioEl.value.pause();
    audioEl.value.src = "";
  }
});

</script>

<script>
export default {}
</script>

