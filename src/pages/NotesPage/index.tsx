import { FC, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';

import { authenticateToken } from 'state';
import BaseLayout from 'components/BaseLayout';
import Paragraph from 'components/Paragraph';

import FolderSample from 'assets/images/FolderSample2.svg';
import LookCloser from 'assets/icons/LookCloser.svg';
import More from 'assets/icons/More.svg';
import Recording from 'assets/icons/Recording.svg';
import Mic from 'assets/icons/Mic.svg';
import ToggleUp from 'assets/icons/RecordingToggleUp.svg';
import ToggleDown from 'assets/icons/RecordingToggleDown.svg';
import Loading from 'components/Loading';

interface Props {}

interface MatchParams {
  noteId: string;
}

const displayMediaOptions = {
  video: true,
  audio: {
    sampleRate: 16000,
  },
};

const NotesPage: FC<Props & RouteComponentProps<MatchParams>> = ({ match }) => {
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [showMemo, setShowMemo] = useState<boolean>(false);
  const [showRecord, setShowRecord] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [stream, setStream] = useState<MediaStream>();
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  const authToken = useRecoilValue(authenticateToken);
  // temp start
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const contents = [
    '노트 생성은 아직 준비중입니다\n',
    '비전노트에 놀러와 주셔서 감사합니다 :)\n',
  ];

  const getNoteInfo = async () => {
    try {
      const { data } = await axios.get(`/v1/script/${match.params.noteId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTitle(data.script.fileName);
      setDate(data.script.createdAt.slice(0, 10).replace(/-/gi, '.'));
      setLoading(false);
    } catch {
      alert('노트 정보를 가져올 수 없습니다');
    }
  };

  useEffect(() => {
    setLoading(true);
    setContent(contents.join(''));
    getNoteInfo();
  }, []);
  // temp end

  useEffect(() => {
    if (recorder !== undefined && recorder.state === 'recording') {
      setTimer(setInterval(onDownload, 5000));
    }
  }, [recorder]);

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
      {loading ? (
        <Loading notes={false} />
      ) : (
        <Root>
          <NoteInfo>
            <InfoTop>
              <NoteFolder src={FolderSample} />
              <ButtonWrapper>
                <SearchBtn src={LookCloser} />
                <MoreBtn src={More} />
              </ButtonWrapper>
            </InfoTop>
            <InfoMiddle>
              <NoteTitle>{title}</NoteTitle>
            </InfoMiddle>
            <InfoBottom>
              <NoteDate>{date}</NoteDate>
              <RecordingWrapper>
                <RecordingStatus
                  onClick={() => {
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
                    onClick={() => setShowRecord(!showRecord)}
                  />
                )}
                <MemoBtn onClick={() => setShowMemo(!showMemo)}>
                  {showMemo ? '전체 메모 닫기' : '전체 메모 보기'}
                </MemoBtn>
              </RecordingWrapper>
            </InfoBottom>
          </NoteInfo>
          <NoteContents>
            <Paragraph
              bookmarked={false}
              content={content}
              time="00:00"
              note=""
            />
          </NoteContents>
        </Root>
      )}
    </BaseLayout>
  );
};

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

const NoteTitle = styled.div`
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

const ButtonWrapper = styled.div`
  display: flex;
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

const RecordingWrapper = styled.div`
  display: flex;
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

export default NotesPage;
