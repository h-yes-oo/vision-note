import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';

import { authenticateToken } from 'state';
import BaseLayout from 'components/BaseLayout';
import Paragraph from 'components/Paragraph';
import NoteMenu from 'components/NoteMenu';

import GreyFolder from 'assets/icons/GreyFolder.svg';
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

const NotesPage: FC<Props & RouteComponentProps<MatchParams>> = ({
  match,
  history,
}) => {
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [showMemo, setShowMemo] = useState<boolean>(false);
  const [showRecord, setShowRecord] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [stream, setStream] = useState<MediaStream>();
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  const authToken = useRecoilValue(authenticateToken);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('');
  // about editing title
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const noteNameRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  // temp start
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [starred, setStarred] = useState<boolean>(false);

  const contents = [
    '노트 생성은 아직 준비중입니다\n',
    '비전노트에 놀러와 주셔서 감사합니다 :)\n',
  ];

  const getNoteInfo = async () => {
    try {
      const { data } = await axios.get(`/v1/script/${match.params.noteId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log(data);
      setFolderName(data.parentFolder.folderName);
      setStarred(data.script.isImportant);
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

  const endEditing = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditing(false);
      if (newName !== '') {
        try {
          const noteData = new FormData();
          noteData.append('fileId', String(match.params.noteId));
          noteData.append('fileName', newName);
          await axios.put(`/v1/note/file/${match.params.noteId}`, noteData, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setTitle(newName);
        } catch {
          alert('노트 제목을 변경하지 못했습니다');
        }
      }
    }
  };

  const starNote = async () => {
    const fileData = new FormData();
    fileData.append('fileId', String(match.params.noteId));
    fileData.append('isImportant', String(starred ? 0 : 1));
    try {
      await axios.put(`/v1/note/file/${match.params.noteId}`, fileData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setStarred(!starred);
    } catch {
      alert('중요 표시 변경에 실패했습니다');
    }
  };

  return (
    <BaseLayout grey={false}>
      {loading ? (
        <Loading notes={false} />
      ) : (
        <Root>
          <NoteInfo>
            <InfoTop>
              <FolderName>
                <NoteFolder src={GreyFolder} />
                {folderName}
              </FolderName>
              <ButtonWrapper>
                <SearchBtn src={LookCloser} />
                <Relative
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={() => setShowContextMenu(false)}
                >
                  <MoreBtn src={More} />
                  <NoteMenu
                    noteId={Number(match.params.noteId)}
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
              <EditNoteTitle
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={endEditing}
                ref={noteNameRef}
                visible={editing}
              />
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
          <ContentWrapper>
            <NoteContents half={showMemo}>
              <Paragraph
                bookmarked={false}
                content={content}
                time="00:00"
                note=""
              />
            </NoteContents>
            <Memos visible={showMemo} />
          </ContentWrapper>
        </Root>
      )}
    </BaseLayout>
  );
};

const Relative = styled.div`
  position: relative;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  width: 1000px;
`;

const ContentWrapper = styled.div`
  display: flex;
`;

const FolderName = styled.div`
  font-family: Pretendard;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  max-height: 20px;
  display: flex;
  color: #656565;
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

const NoteTitle = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? '' : 'none')};
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

const EditNoteTitle = styled.input<{ visible: boolean }>`
  display: ${(props) => (props.visible ? '' : 'none')};
  font-family: Pretendard;
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  border: 2px solid #06cc80;
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
  margin-right: 8px;
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
  &:hover {
    cursor: pointer;
  }
`;

export default withRouter(NotesPage);
