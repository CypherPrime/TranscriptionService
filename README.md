# Customer Service Call Transcriber

## Overview
This program transcribes customer service call recordings with speaker diarization (Agent/Caller). It uses a publicly available AI transcription API to process `.ogg` files. I used the Speech Recognition API on Google Cloud Speech Recognition to recognize audio samples
ensure you set up gcp-key.json on your system
## Setup

1. Install Node.js (https://nodejs.org) and ensure it’s working on your MacOS system.
2. Clone the repository and navigate to the project directory.
3. Run the following command to install dependencies:
   ```bash
   npm install

4. to run the recognition, run this on terminal:
   ```bash
   npx ts-node implementation.ts <path-to-audio-file.ogg>

the program will generate the following output:

### combined_texr.txt : contains the text output and the anotated conversation

### transcript_yourdateandtime.txt : contains the anotated transcript only


thank you

Best regards

TAMANJI COURAGE 
GitHub: https://github.com/CypherPrime/

https://github.com/CypherPrime/TranscriptionService : the code is available here