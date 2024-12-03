// Import the Cloud Speech-to-Text library
const speech = require('@google-cloud/speech').v2;

// Instantiates a client
const client = new speech.SpeechClient();

// Your local audio file to transcribe
const audioFilePath = "./recordings/recording.ogg";
// Full recognizer resource name
const recognizer = "projects/gen-lang-client-0008764226/locations/global/recognizers/_";
// The output path of the transcription result.
const workspace = "./";

const recognitionConfig = {
  autoDecodingConfig: {},
  model: "long",
  languageCodes: ["en-US"],
  features: {
  enableWordTimeOffsets: true,
  enable_word_confidence: true,
  multiChannelMode: "SEPARATE_RECOGNITION_PER_CHANNEL",
  },
};

const audioFiles = [
  { uri: audioFilePath }
];
const outputPath = {
  gcsOutputConfig: {
    uri: workspace
  }
};

async function transcribeSpeech() {
  const transcriptionRequest = {
    recognizer: recognizer,
    config: recognitionConfig,
    files: audioFiles,
    recognitionOutputConfig: outputPath,
  };

  await client.batchRecognize(transcriptionRequest);
}

transcribeSpeech();