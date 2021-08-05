import React, { useState } from 'react';

const RecordingPage = () => {
  const [start, setStart] = useState(false);
  const [restart, setRestart] = useState(true);
  const [stop, setStop] = useState(true);
  const [download, setDownload] = useState(true);
  const [status, setStatus] = useState('');
  const [recorder, setRecorder] = useState();
  const [stream, setStream] = useState();
  const [chunks, setChunks] = useState([]);

  function checkTime(i) {
    return i < 10 ? `0${i}` : i;
  }

  function getFileName() {
    const today = new Date();
    const mon = checkTime(today.getMonth() + 1);
    const day = checkTime(today.getDay() + 1);
    const h = checkTime(today.getHours());
    const m = checkTime(today.getMinutes());
    const s = checkTime(today.getSeconds());
    return String(mon + day + h + m + s);
  }

  const displayMediaOptions = {
    video: true,
    audio: {
      sampleRate: 16000,
    },
  };

  async function startCapture() {
    // logElem.innerHTML = "";
    try {
      // 공유 시작
      navigator.mediaDevices
        .getDisplayMedia(displayMediaOptions)
        .then((mediaStream) => {
          // 두번째 파라미터인 options 없어도 무방; mimeType에 audio/x-wav 불가
          const options = {
            audioBitsPerSecond: 16000,
            mimeType: 'audio/webm;codecs=opus',
          };
          const mediaRecorder = new MediaRecorder(mediaStream, options);
          mediaRecorder.start();

          mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };

          mediaRecorder.onstop = (e) => {
            const blob = new Blob(chunks, { type: chunks[0].type });
            setChunks([]);
            // stream.getVideoTracks()[0].stop();
            const filename = getFileName();
            const downloadElem = window.document.createElement('a');
            downloadElem.href = window.URL.createObjectURL(blob);
            downloadElem.download = filename;
            document.body.appendChild(downloadElem);
            downloadElem.click();
            document.body.removeChild(downloadElem);
          };

          setChunks([]);
          setStream(mediaStream);
          setRecorder(mediaRecorder);
        });
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }

  function uploadToServer() {
    const blob = new Blob(chunks, { type: chunks[0].type });

    const formdata = new FormData();
    formdata.append('fname', 'audio.webm');
    formdata.append('data', blob);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', false);
    xhr.send(formdata);
  }

  function stopCapture(evt) {
    // 공유 중지
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  }

  const onStart = (e) => {
    startCapture();
    setStart(true);
    setStop(false);
    setRestart(true);
    setDownload(false);
    setStatus(`녹화 중`);
  };

  const onStop = (e) => {
    // 녹화 중지
    recorder.stop();
    // 공유 중지
    stopCapture();
    // videoElem.play();
    setStart(false);
    setStop(true);
    setRestart(true);
    setDownload(true);
    setStatus('');
  };

  const onRestart = (e) => {
    // recorder.resume();
    recorder.start();
    setStart(true);
    setStop(false);
    setRestart(true);
    setDownload(false);
    setStatus(`녹화 중`);
  };

  const onPause = (e) => {
    // recorder.pause();
    recorder.stop();
    setStart(true);
    setStop(true);
    setRestart(false);
    setDownload(true);
    setStatus(`녹화가 일시정지되었습니다`);
  };

  const onDownload = (e) => {
    recorder.stop();
    recorder.start();
  };

  return (
    <div>
      <p>비전 노트 녹화 테스트</p>

      <p>
        <button onClick={onStart} disabled={start}>
          녹화 시작
        </button>
        &nbsp;
        <button onClick={onPause} disabled={stop}>
          녹화 일시정지
        </button>
        <button onClick={onRestart} disabled={restart}>
          녹화 재시작
        </button>
        &nbsp;
        <button onClick={onStop} disabled={stop}>
          녹화 정지
        </button>
      </p>

      <p>
        <button onClick={onDownload} disabled={download}>
          다운로드
        </button>
      </p>

      <p>{status}</p>
    </div>
  );
};

export default RecordingPage;
