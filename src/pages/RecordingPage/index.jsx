import { useState, useCallback, useEffect } from 'react';

const RecordingPage = () => {
  const [status, setStatus] = useState('');
  const [recorder, setRecorder] = useState();
  const [stream, setStream] = useState();
  const [timer, setTimer] = useState();
  const [onRec, setOnRec] = useState(false);

  useEffect(() => {
    if (recorder !== undefined && recorder.state === 'recording') {
      setTimer(setInterval(onDownload, 5000));
    }
  }, [recorder]);

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
            const blob = new Blob([e.data], { type: e.data.type });
            const filename = getFileName();
            const downloadElem = window.document.createElement('a');
            downloadElem.href = window.URL.createObjectURL(blob);
            downloadElem.download = filename;
            document.body.appendChild(downloadElem);
            downloadElem.click();
            document.body.removeChild(downloadElem);
          };

          setStream(mediaStream);
          setRecorder(mediaRecorder);
          setOnRec(true);
        });
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }

  function uploadToServer(dataArray) {
    const blob = new Blob(dataArray, { type: dataArray[0].type });

    const formdata = new FormData();
    formdata.append('fname', 'audio.webm');
    formdata.append('data', blob);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', false);
    xhr.send(formdata);
  }

  function stopCapture() {
    // 공유 중지
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  }

  const onStart = (e) => {
    startCapture();
    setStatus(`녹화 중`);
  };

  const onStop = useCallback(() => {
    // 녹화 중지
    recorder.stop();
    // 공유 중지
    stopCapture();
    setStatus('');
    clearInterval(timer);
    setOnRec(false);
  }, [timer]);

  const onDownload = (e) => {
    recorder.stop();
    recorder.start();
  };

  return (
    <div>
      <p>비전 노트 녹화 테스트</p>
      <button onClick={onRec ? onStop : onStart}>
        {onRec ? '녹화 종료하기' : '녹화 시작하기'}
      </button>
      <p>{status}</p>
    </div>
  );
};

export default RecordingPage;
