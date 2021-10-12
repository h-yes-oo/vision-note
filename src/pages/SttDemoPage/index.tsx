import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { decodeUnicode } from 'functions';
import { Recorder } from 'stt/recorder';

import { userInfo } from 'state';

interface AudioSourceConstraints {
  audio?: any;
}

// Defaults
const TAG_END_OF_SENTENCE = 'EOS';
const server = 'wss://stt.visionnote.io/client/ws/speech';
const serverStatus = 'wss://stt.visionnote.io/client/ws/status';
const contentType =
  'content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1';
const interval = 250;

// Error codes (mostly following Android error names and codes)
const ERR_NETWORK = 2;
const ERR_AUDIO = 3;
const ERR_SERVER = 4;
const ERR_CLIENT = 5;

// Event codes
const MSG_WAITING_MICROPHONE = 1;
const MSG_MEDIA_STREAM_CREATED = 2;
const MSG_INIT_RECORDER = 3;
const MSG_RECORDING = 4;
const MSG_SEND = 5;
const MSG_SEND_EMPTY = 6;
const MSG_SEND_EOS = 7;
const MSG_WEB_SOCKET = 8;
const MSG_WEB_SOCKET_OPEN = 9;
const MSG_WEB_SOCKET_CLOSE = 10;
const MSG_STOP = 11;
const MSG_SERVER_CHANGED = 12;
const MSG_AUDIOCONTEXT_RESUMED = 13;

// Server status codes
// from https://github.com/alumae/kaldi-gstreamer-server
const SERVER_STATUS_CODE = {
  0: 'Success', // Usually used when recognition results are sent
  1: 'No speech', // Incoming audio contained a large portion of silence or non-speech
  2: 'Aborted', // Recognition was aborted for some reason
  9: 'No available', // Recognizer processes are currently in use and recognition cannot be performed
};

interface initResult {
  newRecorder: Recorder;
  newAudioContext: AudioContext;
}

interface Props {}

const SttDemoPage: FC<Props> = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const user = useRecoilValue(userInfo);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsServerStatus, setWsServerStatus] = useState<WebSocket | null>(null);
  const [recorder, setRecorder] = useState<Recorder>();
  const [intervalKey, setIntervalKey] = useState<NodeJS.Timeout>();
  const [content, setContent] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [canStart, setCanStart] = useState<boolean>(false);

  const addToLogs = (newLog) => {
    setLog((prevLogs) => [...prevLogs, newLog]);
  };

  const addToContent = (newContent) => {
    setContent((prevContent) => [...prevContent, newContent]);
  };

  const onReadyForSpeech = () => {
    addToLogs('READY FOR SPEECH\n');
  };

  const onEndOfSpeech = () => {
    addToLogs('END OF SPEECH\n');
  };

  const onEndOfSession = () => {
    addToLogs('END OF SESSION\n');
  };

  const onServerStatus = (json) => {
    addToLogs(json.num_workers_available + ':' + json.num_requests_processed);
    if (json.num_workers_available === 0) {
      setCanStart(false);
      addToLogs('unable to start\n');
    } else {
      setCanStart(true);
      addToLogs('can start\n');
    }
  };

  const onPartialResults = (hypos) => {
    console.log(`partial result  = ${decodeUnicode(hypos[0].transcript)}`);
  };

  const onResults = (hypos) => {
    const result = decodeUnicode(hypos[0].transcript);
    // addToTranscription(result);
    addToContent(result);
    console.log(`result  = ${result}`);
  };

  const onError = (code, data) => {
    addToLogs(`Error = ${code} = ${data}\n`);
    cancel();
  };

  const onEvent = (code, data) => {
    addToLogs(`msg = ${code}  = ${data || ''}\n`);
  };

  const monitorServerStatus = () => {
    if (wsServerStatus !== null) {
      wsServerStatus.close();
    }
    const newWsServerStatus = new WebSocket(serverStatus);
    newWsServerStatus.onmessage = (evt) => {
      onServerStatus(JSON.parse(evt.data));
    };
    setWsServerStatus(newWsServerStatus);
  };

  useEffect(() => {
    monitorServerStatus();
  }, []);

  const init = (type: number): Promise<initResult | null> => {
    return new Promise((resolve) => {
      onEvent(
        MSG_WAITING_MICROPHONE,
        'Waiting for approval to access your microphone ...'
      );
      // 유저로부터 stream 받아오기
      try {
        // window.AudioContext = window.AudioContext || window.webkitAudioContext;
        // navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
        const newAudioContext = new AudioContext();
        // setAudioContext(newAudioContext);
        if (navigator.mediaDevices.getUserMedia !== undefined) {
          // 마이크를 이용하여 녹음
          if (type === 0) {
            const audioSourceConstraints: AudioSourceConstraints = {};
            audioSourceConstraints.audio = true;
            navigator.mediaDevices
              .getUserMedia(audioSourceConstraints)
              .then((stream) => {
                setStream(stream);
                /* use the stream */
                const input: MediaStreamAudioSourceNode =
                  newAudioContext.createMediaStreamSource(stream);
                onEvent(MSG_MEDIA_STREAM_CREATED, 'Media stream created');
                // Firefox loses the audio input stream every five seconds
                // To fix added the input to window.source
                // let window: Window & CustomWindow & typeof globalThis;
                // if (document.defaultView !== null) {
                //   window = document.defaultView;
                //   window.source = input;
                //   window.userSpeechAnalyser = newAudioContext.createAnalyser();
                //   input.connect(window.userSpeechAnalyser);
                // }
                const newRecorder = new Recorder(input, {});
                setRecorder(newRecorder);
                onEvent(MSG_INIT_RECORDER, 'Recorder initialized');
                resolve({ newRecorder, newAudioContext });
              });
          } else {
            // 마이크를 통하지 않고 오디오 캡쳐
            const displayMediaConstraints = {
              video: true,
              audio: {
                sampleRate: 16000,
              },
            };
            navigator.mediaDevices
              .getDisplayMedia(displayMediaConstraints)
              .then((stream) => {
                setStream(stream);
                /* use the stream */
                try {
                  const input: MediaStreamAudioSourceNode =
                    newAudioContext.createMediaStreamSource(stream);
                  onEvent(MSG_MEDIA_STREAM_CREATED, 'Media stream created');
                  // Firefox loses the audio input stream every five seconds
                  // To fix added the input to window.source
                  // let window: Window & CustomWindow & typeof globalThis;
                  // if (document.defaultView !== null) {
                  //   window = document.defaultView;
                  //   window.source = input;
                  //   window.userSpeechAnalyser = audioContext.createAnalyser();
                  //   input.connect(window.userSpeechAnalyser);
                  // }
                  const newRecorder = new Recorder(input, {});
                  setRecorder(newRecorder);
                  onEvent(MSG_INIT_RECORDER, 'Recorder initialized');
                  resolve({ newRecorder, newAudioContext });
                } catch {
                  // 오디오가 공유되지 않은 경우
                  alert('오디오 공유 표시에 체크해주세요');
                  // 공유된 화면 취소
                  if (stream !== undefined) {
                    const tracks = stream.getTracks();
                    if (tracks !== undefined)
                      tracks.forEach((track) => {
                        track.stop();
                      });
                  }
                  resolve(null);
                }
              });
          }
        } else {
          onError(ERR_CLIENT, 'No user media support');
          resolve(null);
        }
      } catch (e) {
        // Firefox 24: TypeError: AudioContext is not a constructor
        // Set media.webaudio.enabled = true (in about:config) to fix this.
        onError(ERR_CLIENT, `Error initializing Web Audio browser: ${e}`);
        resolve(null);
      }
    });
  };

  const cancel = () => {
    // Stop the regular sending of audio (if present)
    if (intervalKey !== undefined) clearInterval(intervalKey);
    if (recorder) {
      recorder.stop();
      recorder.clear();
      onEvent(MSG_STOP, 'Stopped recording');
    }
    if (ws !== null) {
      ws.close();
      setWs(null);
    }
  };

  const getDescription = (code) => {
    if (code in SERVER_STATUS_CODE) {
      return SERVER_STATUS_CODE[code];
    }
    return 'Unknown error';
  };

  const socketSend = (ws, item) => {
    if (ws !== null) {
      const state = ws.readyState;
      if (state === 1) {
        // If item is an audio blob
        if (item instanceof Blob) {
          if (item.size > 0) {
            ws.send(item);
            onEvent(MSG_SEND, `Send: blob: ${item.type}, ${item.size}`);
          } else {
            onEvent(MSG_SEND_EMPTY, `Send: blob: ${item.type}, EMPTY`);
          }
          // Otherwise it's the EOS tag (string)
        } else {
          ws.send(item);
          onEvent(MSG_SEND_EOS, `Send tag: ${item}`);
        }
      } else {
        onError(
          ERR_NETWORK,
          `WebSocket: readyState!=1: ${state} : failed to send: ${item}`
        );
      }
    } else {
      onError(ERR_CLIENT, `No web socket connection: failed to send: ${item}`);
    }
  };

  const createWebSocket = (recorder: Recorder) => {
    const user_id = String(user ? user.userId : '1003');
    const content_id = String(Date.now());
    const url = `${server}?${contentType}&user-id=${user_id}&content-id=${content_id}`;
    const ws = new WebSocket(url);

    ws.onmessage = (e) => {
      const { data } = e;
      onEvent(MSG_WEB_SOCKET, data);
      if (data instanceof Object && !(data instanceof Blob)) {
        onError(
          ERR_SERVER,
          'WebSocket: onEvent: got Object that is not a Blob'
        );
      } else if (data instanceof Blob) {
        onError(ERR_SERVER, 'WebSocket: got Blob');
      } else {
        const res = JSON.parse(data);
        if (res.status === 0) {
          if (res.result) {
            if (res.result.final) {
              onResults(res.result.hypotheses);
            } else {
              onPartialResults(res.result.hypotheses);
            }
          }
        } else {
          onError(
            ERR_SERVER,
            `Server error: ${res.status}:${getDescription(res.status)}`
          );
        }
      }
    };

    // Start recording only if the socket becomes open
    ws.onopen = (e) => {
      const newIntervalKey = setInterval(() => {
        recorder.export16kMono((blob) => {
          socketSend(ws, blob);
          recorder.clear();
        }, 'audio/x-raw');
      }, interval);
      setIntervalKey(newIntervalKey);
      // Start recording
      recorder?.record();
      onReadyForSpeech();
      onEvent(MSG_WEB_SOCKET_OPEN, e);
    };

    // This can happen if the blob was too big
    // E.g. "Frame size of 65580 bytes exceeds maximum accepted frame size"
    // Status codes
    // http://tools.ietf.org/html/rfc6455#section-7.4.1
    // 1005:
    // 1006:
    ws.onclose = (e) => {
      const { code, reason, wasClean } = e;
      // The server closes the connection (only?)
      // when its endpointer triggers.
      onEndOfSession();
      onEvent(MSG_WEB_SOCKET_CLOSE, `${code}/${reason}/${wasClean}`);
    };

    ws.onerror = (e: any) => {
      const { data } = e;
      onError(ERR_NETWORK, data);
    };

    return ws;
  };

  const startListening = (recorder: Recorder, audioContext: AudioContext) => {
    if (!recorder) {
      onError(ERR_AUDIO, 'Recorder undefined');
      return;
    }

    if (ws) {
      cancel();
    }

    try {
      setWs(createWebSocket(recorder));
      audioContext.resume().then(() => {
        onEvent(MSG_AUDIOCONTEXT_RESUMED, 'Audio context resumed');
      });
    } catch (e) {
      onError(ERR_CLIENT, 'No web socket support in this browser!');
    }
  };

  const stopListening = () => {
    // Stop the regular sending of audio
    if (intervalKey) clearInterval(intervalKey);
    // Stop recording
    if (recorder) {
      recorder.stop();
      onEvent(MSG_STOP, 'Stopped recording');
      // Push the remaining audio to the server
      recorder.export16kMono((blob) => {
        socketSend(ws, blob);
        socketSend(ws, TAG_END_OF_SENTENCE);
        recorder.clear();
      }, 'audio/x-raw');
      onEndOfSpeech();
      // custom : stopListening 시에 녹음 완전히 취소
      if (stream !== null) {
        const tracks = stream.getTracks();
        if (tracks !== undefined) {
          tracks.forEach((track) => {
            track.stop();
          });
        }
      }
    } else {
      onError(ERR_AUDIO, 'Recorder undefined');
    }
  };

  useEffect(() => {
    cancel();
  }, []);

  const recordWithMic = () => {
    init(0).then((result) => {
      if (result !== null) {
        const { newRecorder, newAudioContext } = result;
        startListening(newRecorder, newAudioContext);
        setRecording(true);
      }
    });
  };

  const stopRecording = () => {
    stopListening();
    setRecording(false);
  };

  const recordWithoutMic = () => {
    init(1).then((result) => {
      if (result !== null) {
        const { newRecorder, newAudioContext } = result;
        startListening(newRecorder, newAudioContext);
        setRecording(true);
      }
    });
  };

  return (
    <Root>
      <ButtonWrapper>
        <PurpleButton disabled={!canStart} onClick={recordWithoutMic}>
          마이크 없이 녹음하기
        </PurpleButton>
        <PurpleButton disabled={!canStart} onClick={recordWithMic}>
          마이크 이용하여 녹음하기
        </PurpleButton>
        <PurpleButton onClick={stopRecording} disabled={!recording}>
          녹음 끝내기
        </PurpleButton>
      </ButtonWrapper>
      <Title>음성 인식 결과 : </Title>
      <Logs>{content.join('\n')}</Logs>
      <Title>실행 로그 : </Title>
      <Logs>{log.join('\n')}</Logs>
    </Root>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    user-select: none !important;
  }
`;

const Title = styled.div`
  font-size: 20rem;
`;

const Logs = styled.div`
  white-space: break-spaces;
  overflow: scroll;
  height: 500rem;
  width: 1000rem;
  user-select: text !important;
  font-size: 20rem;
`;

const Button = styled.button`
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  border: none;
  margin: 20rem;
  padding: 10rem 20rem;

  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background-color: grey;
  }
`;

const PurpleButton = styled(Button)`
  background-color: #7b68ee;
  color: #fff;
  border-radius: 6rem;

  &:hover,
  &:active {
    &:not([disabled]) {
      cursor: pointer;
      background-color: #6a58d3;
    }
  }
`;

export default SttDemoPage;
