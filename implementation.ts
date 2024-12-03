import { SpeechClient, protos } from '@google-cloud/speech';
import fs from 'fs';

const speechClient = new SpeechClient();

async function transcribeCall(filePath: string): Promise<void> {
    try {
        
        if (!filePath.endsWith('.ogg')) {
            throw new Error('Invalid file format. Please provide an .ogg file.');
        }

       
        const audioBytes = fs.readFileSync(filePath).toString('base64');

       
        const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
            audio: {
                content: audioBytes,
            },
            config: {
                encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.OGG_OPUS,
                sampleRateHertz: 48000, //16000
                languageCode: 'en-US',
                diarizationConfig: {
                    enableSpeakerDiarization: true,
                    minSpeakerCount: 2,
                    maxSpeakerCount: 2,
                },
                maxAlternatives: 1,
                enableWordTimeOffsets: true,
                enableWordConfidence: true,
                enableAutomaticPunctuation: true,
                enableSeparateRecognitionPerChannel: true
            } as protos.google.cloud.speech.v1.IRecognitionConfig, 
        };

        // Perform the transcription
        console.log('Transcribing audio...');
        const [response] = await speechClient.recognize(request);

        const transcription = response
            .results!.map((result) => result.alternatives![0].transcript)
            .join('\n');
            

        const transcript = formatTranscript(response);

        
        const outputFilePath = `transcript_${Date.now()}.txt`;
        fs.writeFileSync(outputFilePath, transcript);
        console.log(`Transcript saved to ${outputFilePath}`);


        const combined = `--------------@Plain text--------------------- \n\n ${transcription} \n\n ----------------------@Anotated text-------------------- \n\n ${transcript} \n\n`;
        fs.writeFileSync("combined_text.txt", combined);

    } catch (error) {
        console.error('Error:', error);
    }
}


function formatTranscript(response: protos.google.cloud.speech.v1.IRecognizeResponse): string {
    const { results } = response;
    if (!results || results.length === 0) return 'No transcription available.';

    let transcript = '';
    let currentSpeaker: string | null = null; 
    let sentence = ''; 

    results.forEach((result) => {
        const alternatives = result.alternatives && result.alternatives[0];
        const words = alternatives?.words || [];

        words.forEach((word) => {
            const speaker = word.speakerTag === 1 ? 'AGENT' : 'CALLER';

            if (currentSpeaker !== speaker || sentence.endsWith('.')) {
                if (sentence) {
                    transcript += `${currentSpeaker}: ${sentence.trim()}\n`;
                }
                sentence = word.word + ' ';
                currentSpeaker = speaker;
            } else {
                sentence += word.word + ' ';
            }
        });
    });

    if (sentence) {
        transcript += `${currentSpeaker}: ${sentence.trim()}`;
    }

    return transcript.trim();
}

// Entry point
const filePath = process.argv[2]; // Pass file path as a command-line argument
if (!filePath) {
    console.error('Please provide the path to an .ogg file.');
    process.exit(1);
}
transcribeCall(filePath);