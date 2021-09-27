import { Transcription, Dictate } from './dictate';
// Global UI elements:
//  - log: event log
//  - trans: transcription window

// Global objects:
//  - tt: simple structure for managing the list of hypotheses
//  - dictate: dictate object with control methods 'init', 'startListening', ...
//       and event callbacks onResults, onError, ...
let tt = new Transcription();

const dictate = new Dictate({
  server: 'ws://stt.visionnote.io/client/ws/speech',
  serverStatus: 'ws://stt.visionnote.io/client/ws/status',
  recorderWorkerPath: './recorderWorker.js',
  onReadyForSpeech: () => {
    message('READY FOR SPEECH');
    showStatus('ready for speech');
  },
  onEndOfSpeech: () => {
    message('END OF SPEECH');
    showStatus('end of speech');
  },
  onEndOfSession: () => {
    message('END OF SESSION');
    showStatus('');
  },
  onServerStatus: (json) => {
    showServerStatus(
      json.num_workers_available + ':' + json.num_requests_processed
    );
    if (json.num_workers_available === 0) {
      // $("#buttonStart").prop("disabled", true);
      // $("#serverStatusBar").addClass("highlight");
      console.log('unable to start');
    } else {
      // $("#buttonStart").prop("disabled", false);
      // $("#serverStatusBar").removeClass("highlight");
      console.log('can start');
    }
  },
  onPartialResults: (hypos) => {
    // TODO: demo the case where there are more hypos
    tt.add(hypos[0].transcript, false);
    updateTranscript(tt.toString());
  },
  onResults: (hypos) => {
    // TODO: demo the case where there are more results
    tt.add(hypos[0].transcript, true);
    updateTranscript(tt.toString());
    // // diff() is defined only in diff.html
    // if (typeof(diff) === "function") {
    // 	diff();
    // }
  },
  onError: (code, data) => {
    showError(code, data);
    showStatus('Viga: ' + code);
    dictate.cancel();
  },
  onEvent: (code, data) => {
    message(code, data);
  },
});

// Private methods (called from the callbacks)
function message(code, data) {
  console.log('msg: ' + code + ': ' + (data || '') + '\n');
}

function showError(code, data) {
  console.log('ERR: ' + code + ': ' + (data || '') + '\n');
}

function showStatus(msg) {
  console.log(`status : ${msg}`);
}

function showServerStatus(msg) {
  console.log(`server status : ${msg}`);
}

function updateTranscript(text) {
  console.log(`transcript : ${text}`);
}

// Public methods (called from the GUI)
// function toggleLog() {
// 	$(log).toggle();
// }
// function clearLog() {
// 	log.innerHTML = "";
// }

function clearTranscription() {
  tt = new Transcription();
  console.log('transcript clear');
}

export function startListening() {
  dictate.startListening();
}

export function stopListening() {
  dictate.stopListening();
}

export function cancel() {
  dictate.cancel();
}

export function init() {
  dictate.init();
}

// function showConfig() {
// 	const pp = JSON.stringify(dictate.getConfig(), undefined, 2);
// 	log.innerHTML = pp + "\n" + log.innerHTML;
// 	$(log).show();
// }

// window.onload = function() {
// 	init();
// };
