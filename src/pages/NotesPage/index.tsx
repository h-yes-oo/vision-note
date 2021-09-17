import { FC, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import BaseLayout from 'components/BaseLayout';
import Paragraph from 'components/Paragraph';
import StartNote from 'components/StartNote';

import FolderSample from 'assets/images/FolderSample2.svg';
import LookCloser from 'assets/icons/LookCloser.svg';
import More from 'assets/icons/More.svg';
import Recording from 'assets/icons/Recording.svg';
import Mic from 'assets/icons/Mic.svg';
import ToggleUp from 'assets/icons/RecordingToggleUp.svg';
import ToggleDown from 'assets/icons/RecordingToggleDown.svg';

interface Props {}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  width: 1000px;
`;

const NoteInfo = styled.div``;

const InfoTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InfoMiddle = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 8px 0 11px;
`;

const InfoBottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NoteTitle = styled.input`
  font-family: Pretendard;
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  border: none;
`;

const NoteDate = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #656565;
`;

const NoteFolder = styled.img`
  height: 20px;
`;

const ButtonWrapper = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'flex' : 'none')};
`;

const SearchBtn = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 20px;
`;

const MoreBtn = styled.img`
  height: 24px;
`;

const NoteContents = styled.div``;

const RecordingWrapper = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  align-items: center;
`;

const RecordingBtn = styled.img`
  width: 18px;
  margin-right: 8px;
`;

const RecordingStatus = styled.a`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const MemoBtn = styled.a`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin-left: 40px;
  &:hover {
    cursor: pointer;
  }
`;

const ToggleBtn = styled.img`
  width: 12px;
  height: 12px;
  margin-left: 8px;
`;

function checkTime(i: number): string {
  return i < 10 ? `0${i}` : String(i);
}

const getDate = () => {
  const currentdate = new Date();
  const datetime = `${currentdate.getFullYear()}.${
    currentdate.getMonth() + 1
  }.${currentdate.getDate()} ${checkTime(currentdate.getHours())}:${checkTime(
    currentdate.getMinutes()
  )}`;
  return datetime;
};

const getFileName = () => {
  const today = new Date();
  const mon = checkTime(today.getMonth() + 1);
  const day = checkTime(today.getDay() + 1);
  const h = checkTime(today.getHours());
  const m = checkTime(today.getMinutes());
  const s = checkTime(today.getSeconds());
  return String(mon + day + h + m + s);
};

const displayMediaOptions = {
  video: true,
  audio: {
    sampleRate: 16000,
  },
};

const NotesPage: FC<Props> = () => {
  const [title, setTitle] = useState<string>(getDate());
  const [date, setDate] = useState<string>(getDate());
  const [recording, setRecording] = useState<boolean>(false);
  const [showMemo, setShowMemo] = useState<boolean>(false);
  const [showRecord, setShowRecord] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [stream, setStream] = useState<MediaStream>();
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  // temp start
  const [index, setIndex] = useState<number>(0);
  const [content, setContent] = useState<string>('');

  const contents = [
    '너무 익숙한 이야기죠?\n',
    '곰이 나오고 호랑이가 나오고 그죠 단군 왕검이 나오고 우리 건국 신화입니다\n',
    '신화라는 것은 믿을 수 없는 이야기인데, 믿을 수 없는 이야기가 도대체 고조선과 어떤 관계가 있을까\n',
    '신화는 역사인가라는 물음을 여러분에게 던지고 싶었어요\n',
    '자 조금 다르게 선생님이 줄게요\n',
    '환웅이라는 것에 노란색으로 칠해졌고, 내려왔다\n',
  ];
  const addContent = (i: number) => {
    setContent(content + contents[i]);
  };

  useEffect(() => {
    if (ready)
      document.addEventListener('keydown', () => {
        addContent(index);
        setIndex(index + 1);
      });
  }, [content, index, ready]);

  // temp end

  useEffect(() => {
    if (recorder !== undefined && recorder.state === 'recording') {
      setTimer(setInterval(onDownload, 5000));
    }
  }, [recorder]);

  const onTitleChange = (e: any) => {
    const html = e.target.innerHTML;
    if (html !== '') setTitle(html);
  };

  const onStart = async () => {
    try {
      // 공유 시작
      const mediaDevices = navigator.mediaDevices as any;
      if (mediaDevices !== undefined) {
        mediaDevices
          .getDisplayMedia(displayMediaOptions)
          .then((mediaStream: any) => {
            // 두번째 파라미터인 options 없어도 무방; mimeType에 audio/x-wav 불가
            const options = {
              audioBitsPerSecond: 16000,
              mimeType: 'audio/webm;codecs=opus',
            };
            const mediaRecorder = new MediaRecorder(mediaStream, options);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = (e) => {
              const blob = new Blob([e.data], { type: e.data.type });
              // const filename = getFileName();
              // const downloadElem = window.document.createElement('a');
              // downloadElem.href = window.URL.createObjectURL(blob);
              // downloadElem.download = filename;
              // document.body.appendChild(downloadElem);
              // downloadElem.click();
              // document.body.removeChild(downloadElem);
            };

            setStream(mediaStream);
            setRecorder(mediaRecorder);
            setRecording(true);
            setReady(true);
          });
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  };

  function uploadToServer(dataArray: [Blob]) {
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
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
  }

  const onStop = useCallback(() => {
    // 녹화 중지
    recorder?.stop();
    // 공유 중지
    stopCapture();
    if (timer) clearInterval(timer);
    setRecording(false);
  }, [timer]);

  const onDownload = () => {
    recorder?.stop();
    recorder?.start();
  };

  return (
    <BaseLayout grey={false}>
      <Root>
        <NoteInfo>
          <InfoTop>
            <NoteFolder src={FolderSample} />
            <ButtonWrapper visible={ready}>
              <SearchBtn src={LookCloser} />
              <MoreBtn src={More} />
            </ButtonWrapper>
          </InfoTop>
          <InfoMiddle>
            <NoteTitle placeholder={title} />
          </InfoMiddle>
          <InfoBottom>
            <NoteDate>{date}</NoteDate>
            <RecordingWrapper visible={ready}>
              <RecordingStatus
                onClick={(e) => {
                  if (recording) onStop();
                  else onStart();
                  setRecording(!recording);
                }}
              >
                <RecordingBtn src={recording ? Recording : Mic} />
                {recording ? '녹음중' : '녹음하기'}
              </RecordingStatus>
              {recording ? (
                <></>
              ) : (
                <ToggleBtn
                  src={showRecord ? ToggleUp : ToggleDown}
                  onClick={(e) => setShowRecord(!showRecord)}
                />
              )}
              <MemoBtn onClick={(e) => setShowMemo(!showMemo)}>
                {showMemo ? '전체 메모 닫기' : '전체 메모 보기'}
              </MemoBtn>
            </RecordingWrapper>
          </InfoBottom>
        </NoteInfo>
        <NoteContents>
          {ready ? (
            <Paragraph
              bookmarked={false}
              content={content}
              time="00:00"
              note=""
            />
          ) : (
            <StartNote startRec={onStart} setReady={setReady} />
          )}
        </NoteContents>
      </Root>
    </BaseLayout>
  );
};

export default NotesPage;
