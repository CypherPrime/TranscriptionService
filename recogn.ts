// Import the Cloud Speech-to-Text library
import { SpeechClient, protos } from '@google-cloud/speech';

// Instantiates a client
const client = new SpeechClient();

// Your local audio file to transcribe
const audioFilePath: string = "./recordings/recording.ogg";
// Full recognizer resource name
const recognizer: string = "projects/gen-lang-client-0008764226/locations/global/recognizers/_";
// The output path of the transcription result.
const workspace: string = "./";

const recognitionConfig: protos.google.cloud.speech.v2.RecognitionConfig = {
  autoDecodingConfig: {},
  model: "long",
  languageCodes: ["en-US"],
  features: {
    enableWordTimeOffsets: true,
    enableWordConfidence: true,
    multiChannelMode: protos.google.cloud.speech.v2.MultiChannelMode.SEPARATE_RECOGNITION_PER_CHANNEL,
  },
};

const audioFiles: protos.google.cloud.speech.v2.AudioFile[] = [
  { uri: audioFilePath }
];

const outputPath: protos.google.cloud.speech.v2.RecognitionOutputConfig = {
  gcsOutputConfig: {
    uri: workspace
  }
};

async function transcribeSpeech(): Promise<void> {
  const transcriptionRequest: protos.google.cloud.speech.v2.BatchRecognizeRequest = {
    recognizer: recognizer,
    config: recognitionConfig,
    files: audioFiles,
    recognitionOutputConfig: outputPath,
  };

  await client.batchRecognize(transcriptionRequest);
}

transcribeSpeech().catch(console.error);