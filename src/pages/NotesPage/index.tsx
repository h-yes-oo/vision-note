import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { decodeUnicode } from 'functions';
import { Recorder } from 'stt/recorder';

import { authenticateToken, theme, userInfo } from 'state';
import { lightTheme } from 'styles/theme';
import BaseLayout from 'components/BaseLayout';
import Paragraph from 'components/Paragraph';
import NoteMenu from 'components/NoteMenu';

import GreyFolder from 'assets/icons/GreyFolder.svg';
import PurpleFolder from 'assets/icons/PurpleFolder.svg';
import BlueFolder from 'assets/icons/BlueFolder.svg';
import FolderArrow from 'assets/icons/FolderArrow.svg';
import LookCloser from 'assets/icons/LookCloser.svg';
import More from 'assets/icons/More.svg';
import LookCloserDark from 'assets/icons/LookCloserDark.svg';
import MoreDark from 'assets/icons/MoreDark.svg';
import Recording from 'assets/icons/Recording.svg';
import Mic from 'assets/icons/Mic.svg';
import RecordingDark from 'assets/icons/RecordingDark.svg';
import MicDark from 'assets/icons/MicDark.svg';
import ToggleUp from 'assets/icons/RecordingToggleUp.svg';
import ToggleDown from 'assets/icons/RecordingToggleDown.svg';
import ToggleUpDark from 'assets/icons/ToggleUpDark.svg';
import ToggleDownDark from 'assets/icons/ToggleDownDark.svg';
import Loading from 'components/Loading';
import MicGrey from 'assets/icons/MicGrey.svg';
import MicWhite from 'assets/icons/MicWhite.svg';

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

interface ParagraphData {
  paragraphId?: number;
  scriptId?: number;
  userId?: number;
  paragraphSequence: number;
  startTime: string;
  endTime: string;
  paragraphContent: string;
  memoContent: string | null;
  isBookmarked: number;
  createdAt?: string;
  updatedAt?: string | null;
}

interface initResult {
  newRecorder: Recorder;
  newAudioContext: AudioContext;
}

interface Props {}

interface MatchParams {
  noteId: string;
}

const NotesPage: FC<Props & RouteComponentProps<MatchParams>> = ({
  match,
  history,
}) => {
  const [noteId, setNoteId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [showMemo, setShowMemo] = useState<boolean>(false);
  const [showRecord, setShowRecord] = useState<boolean>(false);
  const authToken = useRecoilValue(authenticateToken);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('');
  const [folderElement, setFolderElement] = useState<JSX.Element>(<></>);
  // about editing title
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const noteNameRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [starred, setStarred] = useState<boolean>(false);
  const currentTheme = useRecoilValue(theme);
  const user = useRecoilValue(userInfo);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsServerStatus, setWsServerStatus] = useState<WebSocket | null>(null);
  const [recorder, setRecorder] = useState<Recorder>();
  const [intervalKey, setIntervalKey] = useState<NodeJS.Timeout>();
  const [content, setContent] = useState<ParagraphData[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [canStart, setCanStart] = useState<boolean>(false);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [showRecordingOptions, setShowRecordingOptions] =
    useState<boolean>(false);
  const [mouseOnMic, setMouseOnMic] = useState<boolean>(false);
  const [mouseOnCapture, setMouseOnCapture] = useState<boolean>(false);

  const addToLogs = (newLog: string) => {
    setLog((prevLogs) => [...prevLogs, newLog]);
  };

  const addToContent = (newContent: string) => {
    setContent((prevContent) => [
      ...prevContent.slice(0, -1),
      {
        ...prevContent[prevContent.length - 1],
        paragraphContent: `${
          prevContent[prevContent.length - 1].paragraphContent
        }\n${newContent}`,
      },
    ]);
  };

  const addNewParagraph = (remaining: string) => {
    if (remaining !== '') {
      setContent((prevContent) => [
        ...prevContent.slice(0, -1),
        {
          ...prevContent[prevContent.length - 1],
          paragraphContent: `${
            prevContent[prevContent.length - 1].paragraphContent
          }
          \n
          ${remaining}`,
        },
        {
          paragraphSequence:
            prevContent[prevContent.length - 1].paragraphSequence + 1,
          startTime: '00:00',
          endTime: '00:00',
          paragraphContent: '',
          memoContent: null,
          isBookmarked: 0,
        },
      ]);
    } else {
      setContent((prevContent) => [
        ...prevContent,
        {
          paragraphSequence:
            prevContent[prevContent.length - 1].paragraphSequence + 1,
          startTime: '00:00',
          endTime: '00:00',
          paragraphContent: '',
          memoContent: null,
          isBookmarked: 0,
        },
      ]);
    }
    // TODO : 끝난 paragraph api로 보내주기
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
    const result = decodeUnicode(hypos[0].transcript).replace(/<UNK>/gi, '');
    // addToTranscription(result);
    if (result.includes('^')) {
      addNewParagraph(result.split('^')[0]);
    } else if (result !== '' && result !== '.') {
      addToContent(result);
    }
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
            navigator.mediaDevices
              .getUserMedia({ audio: true })
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
    const content_id = noteId;
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
      setWaiting(false);
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
    setContent([
      {
        paragraphSequence: 0,
        startTime: '00:00',
        endTime: '00:00',
        paragraphContent: '',
        memoContent: null,
        isBookmarked: 0,
      },
    ]);
    setWaiting(true);
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

  const recordWithMic = () => {
    init(0).then((result) => {
      if (result !== null) {
        const { newRecorder, newAudioContext } = result;
        startListening(newRecorder, newAudioContext);
        setRecording(true);
        setShowRecordingOptions(false);
      }
    });
  };

  const stopRecording = async () => {
    stopListening();
    setRecording(false);
    const fileData = new FormData();
    fileData.append('scriptId', match.params.noteId);
    fileData.append('isRecording', 'false');
    await axios.put(`/v1/script/recording/${match.params.noteId}`, fileData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  };

  useEffect(() => {
    monitorServerStatus();
    const changeRecordingStatus = async () => {
      const fileData = new FormData();
      fileData.append('scriptId', match.params.noteId);
      fileData.append('isRecording', 'false');
      await axios.put(`/v1/script/recording/${match.params.noteId}`, fileData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    };
    return () => {
      changeRecordingStatus();
      cancel();
    };
  }, []);

  const recordWithoutMic = () => {
    init(1).then((result) => {
      if (result !== null) {
        const { newRecorder, newAudioContext } = result;
        startListening(newRecorder, newAudioContext);
        setRecording(true);
        setShowRecordingOptions(false);
      }
    });
  };

  const getNoteInfo = async (noteId) => {
    try {
      const { data } = await axios.get(`/v1/script/${noteId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log(data);
      setFolderName(data.parentFolder.folderName);
      setStarred(data.script.isImportant);
      setTitle(data.script.fileName);
      setDate(data.script.createdAt.slice(0, 10).replace(/-/gi, '.'));
      if (!data.script.isRecording) {
        setContent(data.scriptParagraphs);
      }
      return {
        folderId: data.parentFolder.folderId,
        isRecording: data.script.isRecording,
      };
    } catch {
      alert('노트 정보를 가져올 수 없습니다');
      return {
        folderId: null,
        isRecording: 0,
      };
    }
  };

  const getParentFolders = async (folderId) => {
    try {
      const { data } = await axios.get(`/v1/note/folder/parents/${folderId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (data.length <= 1) {
        setFolderElement(
          <FolderName>
            <NoteFolder src={GreyFolder} />
            전체 폴더
          </FolderName>
        );
      } else {
        const lastIndex = data.length - 2;
        setFolderElement(
          <FolderName>
            {data
              .slice(0, -1)
              .reverse()
              .map((folder, index) => (
                <FolderWrapper key={folder.folderId}>
                  <NoteFolder
                    src={index % 2 === 0 ? PurpleFolder : BlueFolder}
                  />
                  {folder.folderName}
                  {index !== lastIndex && <FolderNext src={FolderArrow} />}
                </FolderWrapper>
              ))}
          </FolderName>
        );
      }
    } catch {
      alert('노트 정보를 가져올 수 없습니다');
    }
  };

  const getStarted = async () => {
    const { noteId } = match.params;
    setNoteId(noteId);
    setLoading(true);
    const { folderId, isRecording } = await getNoteInfo(noteId);
    if (folderId !== null) await getParentFolders(folderId);
    setLoading(false);
    if (isRecording) {
      setShowRecordingOptions(true);
    }
  };

  useEffect(() => {
    getStarted();
    return () => {
      // TODO : 녹음중이면, 지금까지 올라온 내용 스크립트로 저장 후 녹음 상태 전환
      console.log('byebye');
    };
  }, []);
  // temp end

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setShowContextMenu(true);
    },
    [setShowContextMenu]
  );

  const editNoteTitle = () => {
    setEditing(true);
    if (noteNameRef.current !== null)
      setTimeout(() => noteNameRef.current!.focus(), 10);
  };

  const endEditing = async () => {
    setEditing(false);
    if (newName !== '') {
      try {
        const noteData = new FormData();
        noteData.append('fileId', String(noteId));
        noteData.append('fileName', newName);
        await axios.put(`/v1/note/file/${noteId}`, noteData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setTitle(newName);
      } catch {
        alert('노트 제목을 변경하지 못했습니다');
      }
    }
  };

  const onPressEnter = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await endEditing();
    }
  };

  const starNote = async () => {
    const fileData = new FormData();
    fileData.append('fileId', String(noteId));
    fileData.append('isImportant', String(starred ? 0 : 1));
    try {
      await axios.put(`/v1/note/file/${noteId}`, fileData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setStarred(!starred);
    } catch {
      alert('중요 표시 변경에 실패했습니다');
    }
  };

  const getRecordingSrc = () => {
    if (currentTheme === lightTheme) return recording ? Recording : Mic;
    return recording ? RecordingDark : MicDark;
  };

  const getToggleSrc = () => {
    if (currentTheme === lightTheme) return showRecord ? ToggleUp : ToggleDown;
    return showRecord ? ToggleUpDark : ToggleDownDark;
  };

  return (
    <BaseLayout grey={false}>
      {loading ? (
        <Loading notes={false} />
      ) : (
        <Root>
          <NoteInfo>
            <InfoTop>
              {folderElement}
              <ButtonWrapper>
                <SearchBtn
                  src={
                    currentTheme === lightTheme ? LookCloser : LookCloserDark
                  }
                />
                <Relative
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={() => setShowContextMenu(false)}
                >
                  <MoreBtn
                    src={currentTheme === lightTheme ? More : MoreDark}
                  />
                  <NoteMenu
                    noteId={Number(noteId)}
                    starred={starred}
                    show={showContextMenu}
                    closeMenu={() => setShowContextMenu(false)}
                    editNoteTitle={editNoteTitle}
                    starNote={starNote}
                  />
                </Relative>
              </ButtonWrapper>
            </InfoTop>
            <InfoMiddle>
              <NoteTitle visible={!editing}>{title}</NoteTitle>
              <EditOverlay visible={editing} onClick={endEditing} />
              <EditNoteTitle
                type="text"
                placeholder={title}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={onPressEnter}
                ref={noteNameRef}
                visible={editing}
              />
            </InfoMiddle>
            <InfoBottom>
              <NoteDate>{date}</NoteDate>
              <RecordingWrapper>
                {recording && (
                  <RecordingStatus onClick={stopRecording}>
                    <RecordingBtn src={getRecordingSrc()} />
                    녹음 멈추기
                  </RecordingStatus>
                )}
                <MemoBtn onClick={() => setShowMemo(!showMemo)}>
                  {showMemo ? '전체 메모 닫기' : '전체 메모 보기'}
                </MemoBtn>
              </RecordingWrapper>
            </InfoBottom>
          </NoteInfo>
          <ContentWrapper>
            <NoteContents half={showMemo}>
              <Fade out={!showRecordingOptions}>
                <StartBtn
                  disabled={!canStart}
                  onMouseOver={() => setMouseOnCapture(true)}
                  onMouseOut={() => setMouseOnCapture(false)}
                  onClick={recordWithoutMic}
                >
                  <BtnImage
                    src={
                      !mouseOnCapture && currentTheme === lightTheme
                        ? MicGrey
                        : MicWhite
                    }
                  />
                  마이크 없이 녹음하기
                </StartBtn>
                <StartBtn
                  disabled={!canStart}
                  onMouseOver={() => setMouseOnMic(true)}
                  onMouseOut={() => setMouseOnMic(false)}
                  onClick={recordWithMic}
                >
                  <BtnImage
                    src={
                      !mouseOnMic && currentTheme === lightTheme
                        ? MicGrey
                        : MicWhite
                    }
                  />
                  마이크로 녹음하기
                </StartBtn>
              </Fade>
              {content.map((paragraph) => (
                <Paragraph
                  key={paragraph.paragraphId ?? paragraph.paragraphSequence}
                  recording={recording}
                  paragraphId={paragraph.paragraphId ?? 0}
                  bookmarked={paragraph.isBookmarked === 1}
                  content={paragraph.paragraphContent}
                  time={paragraph.startTime}
                  note={paragraph.memoContent}
                />
              ))}
              {waiting && (
                <DotWrapper>
                  <DotFalling />
                </DotWrapper>
              )}
            </NoteContents>
            <Memos visible={showMemo} />
          </ContentWrapper>
        </Root>
      )}
    </BaseLayout>
  );
};

const DotWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: none;
  margin: 10px;
  width: 40rem;
`;

const dotFalling = keyframes`
  0% {
    box-shadow: 9999rem -15rem 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 9999rem 0 0 0 #9A9BA6;
  }
  100% {
    box-shadow: 9999rem 15rem 0 0 rgba(152, 128, 255, 0);
  }
`;

const dotFallingBefore = keyframes`
  0% {
    box-shadow: 9984rem -15rem 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 9984rem 0 0 0 #9A9BA6;
  }
  100% {
    box-shadow: 9984rem 15rem 0 0 rgba(152, 128, 255, 0);
  }
`;

const dotFallingAfter = keyframes`
  0% {
    box-shadow: 10014rem -15rem 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 10014rem 0 0 0 #9A9BA6;
  }
  100% {
    box-shadow: 10014rem 15rem 0 0 rgba(152, 128, 255, 0);
  }
`;

const DotFalling = styled.div`
  position: relative;
  left: -9999rem;
  width: 10rem;
  height: 10rem;
  border-radius: 5rem;
  background-color: #9a9ba6;
  color: #9a9ba6;
  box-shadow: 9999rem 0 0 0 #9a9ba6;
  animation: ${dotFalling} 1s infinite linear;
  animation-delay: 0.1s;

  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    width: 10rem;
    height: 10rem;
    border-radius: 5rem;
    background-color: #9a9ba6;
    color: #9a9ba6;
    animation: ${dotFallingBefore} 1s infinite linear;
    animation-delay: 0s;
  }

  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    width: 10rem;
    height: 10rem;
    border-radius: 5rem;
    background-color: #9a9ba6;
    color: #9a9ba6;
    animation: ${dotFallingAfter} 1s infinite linear;
    animation-delay: 0.2s;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const Fade = styled.div<{ out: boolean }>`
  display: ${(props) => (props.out ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;
  visibility: ${(props) => (props.out ? 'hidden' : 'visible')};
  animation: ${(props) => (props.out ? fadeOut : fadeIn)} 1s linear;
  transition: visibility 1s linear;
  margin-top: 30vh;
`;

const StartBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 310rem;
  height: 70rem;
  margin: 0 17rem;
  object-fit: contain;
  border-radius: 8rem;
  box-shadow: 0 3rem 16rem 0 rgba(0, 0, 0, 0.08);
  background-color: ${(props) => props.theme.color.lightBackground};
  font-family: Pretendard;
  font-size: 20rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.contrast};
  &:hover {
    color: #fff;
    box-shadow: 0 0 20rem 0 rgba(123, 104, 238, 0.6);
    background-color: #7b68ee;
  }

  border: none;

  &:disabled {
    background-color: grey;
  }

  &:hover,
  &:active {
    &:not([disabled]) {
      cursor: pointer;
      background-color: #6a58d3;
    }
  }
`;

const BtnImage = styled.img`
  width: 40rem;
  height: 40rem;
  margin-right: 10rem;
`;

const EditOverlay = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
`;

const FolderWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Relative = styled.div`
  position: relative;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32rem;
  width: 1000rem;
`;

const ContentWrapper = styled.div`
  display: flex;
`;

const FolderName = styled.div`
  font-family: Pretendard;
  font-style: normal;
  font-weight: normal;
  font-size: 16rem;
  max-height: 20rem;
  display: flex;
  color: ${(props) => props.theme.color.semiText};
`;

const NoteInfo = styled.div``;

const InfoTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InfoMiddle = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 8rem 0 11rem;
`;

const InfoBottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NoteTitle = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? '' : 'none')};
  font-family: Pretendard;
  font-size: 30rem;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.primaryText};
  border: none;
`;

const EditNoteTitle = styled.input<{ visible: boolean }>`
  display: ${(props) => (props.visible ? '' : 'none')};
  font-family: Pretendard;
  font-size: 30rem;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.primaryText};
  background: ${(props) => props.theme.color.background};
  border: 2rem solid #06cc80;
  z-index: 1000;
`;

const NoteDate = styled.div`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.tertiaryText};
`;

const NoteFolder = styled.img`
  height: 20rem;
  margin-right: 8rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

const SearchBtn = styled.img`
  width: 24rem;
  height: 24rem;
  margin-right: 20rem;
`;

const MoreBtn = styled.img`
  height: 24rem;
  &:hover {
    cursor: pointer;
  }
`;

const NoteContents = styled.div<{ half: boolean }>`
  width: ${(props) => (props.half ? '50%' : '100%')};
`;

const Memos = styled.div<{ visible: boolean }>`
  ${(props) => (props.visible ? 'width: 50%;' : 'display: none;')};
`;

const RecordingWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const RecordingBtn = styled.img`
  width: 18rem;
  margin-right: 8rem;
`;

const RecordingStatus = styled.a`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.primaryText};
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const MemoBtn = styled.a`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.primaryText};
  margin-left: 40rem;
  &:hover {
    cursor: pointer;
  }
`;

const ToggleBtn = styled.img`
  width: 12rem;
  height: 12rem;
  margin-left: 8rem;
  &:hover {
    cursor: pointer;
  }
`;

const FolderNext = styled.img`
  margin: 0 10rem 0 3rem;
`;

export default withRouter(NotesPage);
