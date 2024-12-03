import { SpeechClient, protos } from '@google-cloud/speech';
import fs from 'fs';

const speechClient = new SpeechClient();

async function transcribeCall(filePath: string): Promise<void> {
    try {
        // Validate file format
        if (!filePath.endsWith('.ogg')) {
            throw new Error('Invalid file format. Please provide an .ogg file.');
        }

        // Read the audio file
        const audioBytes = fs.readFileSync(filePath).toString('base64');

        // Configure the request
        const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
            audio: {
                content: audioBytes,
            },
            config: {
                encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.OGG_OPUS,
                sampleRateHertz: 16000,
                languageCode: 'en-US',
                diarizationConfig: {
                    enableSpeakerDiarization: true,
                    minSpeakerCount: 2,
                    maxSpeakerCount: 2,
                },
            } as protos.google.cloud.speech.v1.IRecognitionConfig, // Explicit assertion
        };

        // Perform the transcription
        console.log('Transcribing audio...');
        const [response] = await speechClient.recognize(request);

        const transcript = formatTranscript(response);

        // Save transcript to a file
        const outputFilePath = `transcript_${Date.now()}.txt`;
        fs.writeFileSync(outputFilePath, transcript);
        console.log(`Transcript saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

function formatTranscript(response: protos.google.cloud.speech.v1.IRecognizeResponse): string {
    const { results } = response;
    if (!results || results.length === 0) return 'No transcription available.';

    let transcript = '';

    results.forEach((result) => {
        const alternatives = result.alternatives && result.alternatives[0];
        const words = alternatives?.words || [];

        words.forEach((word) => {
            const speaker = word.speakerTag === 1 ? 'AGENT' : 'CALLER';
            transcript += `${speaker}: ${word.word} `;
        });

        transcript += '\n';
    });

    return transcript.trim();
}

// Entry point
const filePath = process.argv[2]; // Pass file path as a command-line argument
if (!filePath) {
    console.error('Please provide the path to an .ogg file.');
    process.exit(1);
}
transcribeCall(filePath);