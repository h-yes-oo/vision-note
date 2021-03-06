import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { decodeUnicode, formatTime, isMobile } from 'functions';
import { Dictate } from 'stt/dictate';

import { authenticateToken, theme, userInfo, alertInfo } from 'state';
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
import Play from 'assets/icons/Play.svg';
import Backward from 'assets/icons/Backward.svg';
import Forward from 'assets/icons/Forward.svg';
import PlayWhite from 'assets/icons/PlayWhite.svg';
import BackwardWhite from 'assets/icons/BackwardWhite.svg';
import ForwardWhite from 'assets/icons/ForwardWhite.svg';
import Pause from 'assets/icons/Pause.svg';
import PauseWhite from 'assets/icons/PauseWhite.svg';
import ProgressDot from 'assets/icons/ProgressDot.svg';

interface ParagraphData {
  paragraphId: number;
  scriptId?: number;
  userId?: number;
  paragraphSequence: number;
  startTime: number;
  endTime: number;
  paragraphContent: string;
  memoContent: string | null;
  isBookmarked: number;
  createdAt?: string;
  updatedAt?: string | null;
  keywords: any[];
}

interface Props {}

interface MatchParams {
  noteId: string;
}

const NotesPage: FC<Props & RouteComponentProps<MatchParams>> = ({
  match,
  history,
}) => {
  // about basic note info
  const [noteId, setNoteId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [folderName, setFolderName] = useState<string>('');
  const [folderElement, setFolderElement] = useState<JSX.Element>(<></>);
  const [starred, setStarred] = useState<boolean>(false);
  // about modes
  const [showMemo, setShowMemo] = useState<boolean>(false);
  const [showRecord, setShowRecord] = useState<boolean>(false);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  // about recoil states
  const authToken = useRecoilValue(authenticateToken);
  const currentTheme = useRecoilValue(theme);
  const user = useRecoilValue(userInfo);
  const setAlert = useSetRecoilState(alertInfo);
  // about editing title
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const noteNameRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  // about stt
  const [recording, setRecording] = useState<boolean>(false);
  const [dictate, setDictate] = useState<Dictate>();
  const [content, setContent] = useState<ParagraphData[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [canStart, setCanStart] = useState<boolean>(false);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [showRecordingOptions, setShowRecordingOptions] =
    useState<boolean>(false);
  const [mouseOnMic, setMouseOnMic] = useState<boolean>(false);
  const [mouseOnCapture, setMouseOnCapture] = useState<boolean>(false);
  const [lastSequence, setSequence] = useState<number>(0);
  const [lastContent, setLastContent] = useState<string>('');
  const [lastId, setLastId] = useState<number | null>(null);
  const [lastEndTime, setLastEndTime] = useState<number>(0);
  const [partialResult, setPartialResult] = useState<string>('');
  // about audio play
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [currLength, setCurrLength] = useState<number>(0);
  const [audioLength, setAudioLength] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const addToLogs = (newLog: string) => {
    setLog((prevLogs) => [...prevLogs, newLog]);
  };

  const addToContent = async (newContent: string, endTime: number) => {
    try {
      const SpacingApi = axios.create({
        baseURL: 'https://spacing.visionnote.io',
      });
      const response = await SpacingApi.post('', { text: newContent });
      newContent = response.data.result;
    } catch {
      setAlert({
        show: true,
        message: '??????????????? ??????????????????. \n',
      });
    }
    setContent((prevContent) => [
      ...prevContent.slice(0, -1),
      {
        ...prevContent[prevContent.length - 1],
        endTime,
        paragraphContent: `${
          prevContent[prevContent.length - 1].paragraphContent
        }\n${newContent}`,
      },
    ]);
    setLastContent((prev) => `${prev}\n${newContent}`);
  };

  const addNewParagraph = (time: number) => {
    const paragraphData = new FormData();
    paragraphData.append('scriptId', match.params.noteId);
    paragraphData.append('startTime', String(time));
    paragraphData.append('endTime', String(time));
    paragraphData.append('paragraphContent', String(lastSequence));
    paragraphData.append('paragraphSequence', '0');
    paragraphData.append('isBookmarked', '0');
    axios
      .post(`/v1/script/paragraph/${match.params.noteId}`, paragraphData, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        const id = response.data.paragraphId;
        setLastId((prev) => id);
        setContent((prevContent) => [
          ...prevContent,
          {
            paragraphId: id,
            paragraphSequence: lastSequence,
            startTime: time,
            endTime: time,
            paragraphContent: '',
            memoContent: null,
            isBookmarked: 0,
            keywords: [],
          },
        ]);
        setSequence((prev) => prev + 1);
      });
  };

  const record = (option: number) => {
    if (dictate !== undefined) {
      dictate.init(option).then((result) => {
        if (result) {
          const paragraphData = new FormData();
          paragraphData.append('scriptId', match.params.noteId);
          paragraphData.append('startTime', '0');
          paragraphData.append('endTime', '0');
          paragraphData.append('paragraphContent', '');
          paragraphData.append('paragraphSequence', String(lastSequence));
          paragraphData.append('isBookmarked', '0');
          axios
            .post(
              `/v1/script/paragraph/${match.params.noteId}`,
              paragraphData,
              {
                headers: { Authorization: `Bearer ${authToken}` },
              }
            )
            .then((response) => {
              const id = response.data.paragraphId;
              setLastId((prev) => id);
              setContent([
                {
                  paragraphId: id,
                  paragraphSequence: lastSequence,
                  startTime: 0,
                  endTime: 0,
                  paragraphContent: '',
                  memoContent: null,
                  isBookmarked: 0,
                  keywords: [],
                },
              ]);
              setSequence((prev) => prev + 1);
              dictate.startListening();
              setRecording(true);
              setShowRecordingOptions(false);
              setWaiting(true);
              const fileData = new FormData();
              fileData.append('scriptId', match.params.noteId);
              fileData.append('isRecording', '0');
              axios.post(
                `/v1/script/recording/${match.params.noteId}`,
                fileData,
                {
                  headers: { Authorization: `Bearer ${authToken}` },
                }
              );
            });
        }
      });
    }
  };

  const stopRecording = () => {
    if (dictate !== undefined) dictate.stopListening();
    setRecording(false);
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [dictate]);

  useEffect(() => {
    return () => {
      if (player !== null) player.pause();
    };
  }, [player]);

  // useEffect(() => {
  //   console.log(`id changed to ${lastId}`);
  // }, [lastId]);

  useEffect(() => {
    if (lastId !== null && lastContent !== '') {
      // console.log(`last Content changed to ${lastContent} and id is ${lastId}`);
      // ?????? ?????? ?????? ??????
      try {
        const prevData = new FormData();
        prevData.append('paragraphId', String(lastId));
        prevData.append('paragraphContent', lastContent);
        axios.put(`/v1/script/paragraph/${lastId}`, prevData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch {
        setAlert({
          show: true,
          message: '?????? ????????? ????????? ??????????????????. \n?????? ??????????????????.',
        });
      }
    }
  }, [lastContent]);

  useEffect(() => {
    if (lastId !== null && lastEndTime !== undefined) {
      // ?????? ???????????? ??????
      try {
        const timeData = new FormData();
        timeData.append('paragraphId', String(lastId));
        timeData.append('endTime', String(lastEndTime));
        axios.put(`/v1/script/paragraph/${lastId}`, timeData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch {
        setAlert({
          show: true,
          message: '?????? ?????? ????????? ??????????????????. \n?????? ??????????????????.',
        });
      }
    }
  }, [lastEndTime]);

  const getNoteInfo = async (noteId) => {
    try {
      const { data } = await axios.get(`/v1/script/${noteId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setFolderName(data.parentFolder.folderName);
      setStarred(data.script.isImportant);
      setTitle(data.script.fileName);
      setDate(data.script.createdAt.slice(0, 10).replace(/-/gi, '.'));
      if (!data.script.isRecording) {
        const paragraphs = data.scriptParagraphs;
        setContent(paragraphs);
        const audioName = data.script.audioFileName;
        if (audioName !== null) {
          setPlayer(
            new Audio(
              `https://visionnote-static.s3.ap-northeast-2.amazonaws.com/audio/${data.script.audioFileName}`
            )
          );
          setAudioLength(paragraphs[paragraphs.length - 1].endTime);
        }
      }
      return {
        folderId: data.parentFolder.folderId,
        isRecording: data.script.isRecording,
      };
    } catch {
      setAlert({
        show: true,
        message: '?????? ?????? ????????? ????????? ??? ????????????. \n?????? ??????????????????.',
      });
      history.push('/');
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
            ?????? ??????
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
      setAlert({
        show: true,
        message: '?????? ????????? ???????????? ???????????????.',
      });
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
      const dictate = new Dictate({
        server: 'wss://stt.visionnote.io/client/ws/speech',
        serverStatus: 'wss://stt.visionnote.io/client/ws/status',
        recorderWorkerPath: './recorderWorker.js',
        user_id: String(user ? user.userId : '1003'),
        content_id: match.params.noteId,
        onReadyForSpeech: () => {
          addToLogs('READY FOR SPEECH\n');
        },
        onEndOfSpeech: () => {
          addToLogs('END OF SPEECH\n');
        },
        onEndOfSession: () => {
          addToLogs('END OF SESSION\n');
        },
        onServerStatus: (json) => {
          addToLogs(
            json.num_workers_available + ':' + json.num_requests_processed
          );
          if (json.num_workers_available === 0) {
            setCanStart(false);
            addToLogs('unable to start\n');
          } else {
            setCanStart(true);
            addToLogs('can start\n');
          }
        },
        onPartialResults: (hypos) => {
          const result = decodeUnicode(hypos[0].transcript)
            .replace(/<UNK>/gi, '')
            .replace(/{/gi, '')
            .replace(/}/gi, '')
            .replace(/\[/gi, '')
            .replace(/\]/gi, '')
            .replace(/\(/gi, '')
            .replace(/\)/gi, '');
          if (result !== '.' && !result.includes('^'))
            setPartialResult((prev) => result);
        },
        onResults: (hypos, start: number, end: number) => {
          setPartialResult((prev) => '');
          const result = decodeUnicode(hypos[0].transcript)
            .replace(/<UNK>/gi, '')
            .replace(/{/gi, '')
            .replace(/}/gi, '')
            .replace(/\[/gi, '')
            .replace(/\]/gi, '')
            .replace(/\(/gi, '')
            .replace(/\)/gi, '');
          console.log(`result : ${result}, start: ${start}, end: ${end}`);
          if (result.includes('^')) {
            const startTime = Math.floor(start);
            setLastContent((prev) => '');
            addNewParagraph(startTime);
          } else if (result !== '' && result !== '.') {
            const endTime = Math.floor(end);
            addToContent(result, endTime);
            setLastEndTime((prev) => endTime);
          }
        },
        onError: (code, data) => {
          addToLogs(`Error: ${code}: ${data}\n`);
          dictate.cancel();
        },
        onEvent: (code, data) => {
          addToLogs(`msg: ${code} : ${data || ''}\n`);
        },
        onWsClose: () => {
          setWaiting(false);
        },
        onShareStop: () => {
          setRecording(false);
        },
        onEndRecording: (blob: Blob) => {
          try {
            const audioData = new FormData();
            audioData.append('scriptId', String(match.params.noteId));
            audioData.append('audio', blob);
            console.log(blob.size);
            axios
              .post(`/v1/script/audio/${match.params.noteId}`, audioData, {
                headers: { Authorization: `Bearer ${authToken}` },
              })
              .then((response) =>
                setPlayer(
                  (prev) =>
                    new Audio(
                      `https://visionnote-static.s3.ap-northeast-2.amazonaws.com/audio/${response.data.savedAudioName}`
                    )
                )
              );
          } catch {
            setAlert({
              show: true,
              message: '?????? ????????? ???????????? ???????????????. \n',
            });
          }
        },
      });
      setDictate(dictate);
    }
  };

  useEffect(() => {
    if (dictate !== undefined) {
      stopRecording();
      setDictate(undefined);
    }
    getStarted();
  }, [match.params.noteId]);

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
        setAlert({
          show: true,
          message: '?????? ????????? ???????????? ???????????????. \n?????? ??????????????????.',
        });
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
      setAlert({
        show: true,
        message: '?????? ????????? ???????????? ???????????????. \n?????? ??????????????????.',
      });
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

  const onClickPlay = () => {
    if (player !== null) {
      player.play();
      setPlaying(true);
      setTimer(
        setInterval(() => {
          setCurrLength(Math.ceil(player.currentTime));
        }, 200)
      );
    }
  };

  const onClickPause = () => {
    if (player !== null) {
      player.pause();
      if (timer) clearInterval(timer);
      setPlaying(false);
    }
  };

  const onClickBackward = () => {
    if (player !== null) {
      const nextTime = player.currentTime - 5;
      if (nextTime < 0) player.currentTime = 0;
      else player.currentTime = nextTime;
      setCurrLength(Math.ceil(player.currentTime));
    }
  };

  const onClickForward = () => {
    if (player !== null) {
      const nextTime = player.currentTime + 5;
      if (nextTime > audioLength) player.currentTime = audioLength;
      else player.currentTime = nextTime;
      setCurrLength(Math.ceil(player.currentTime));
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
                    ?????? ?????????
                  </RecordingStatus>
                )}
                {/* <MemoBtn onClick={() => setShowMemo(!showMemo)}>
                  {showMemo ? '?????? ?????? ??????' : '?????? ?????? ??????'}
                </MemoBtn> */}
                {player !== null && !isMobile() && (
                  <MemoBtn onClick={() => setShowRecord(!showRecord)}>
                    ?????? ??????
                    <ToggleBtn src={getToggleSrc()} />
                  </MemoBtn>
                )}
              </RecordingWrapper>
            </InfoBottom>
            {showRecord && (
              <PlayBar>
                <Control>
                  <ControlButton
                    src={currentTheme === lightTheme ? Backward : BackwardWhite}
                    onClick={onClickBackward}
                  />
                  {playing ? (
                    <ControlButton
                      src={currentTheme === lightTheme ? Pause : PauseWhite}
                      onClick={onClickPause}
                    />
                  ) : (
                    <ControlButton
                      src={currentTheme === lightTheme ? Play : PlayWhite}
                      onClick={onClickPlay}
                    />
                  )}
                  <ControlButton
                    src={currentTheme === lightTheme ? Forward : ForwardWhite}
                    onClick={onClickForward}
                  />
                </Control>
                <ProgressBar>
                  <CurrentProgress current={currLength / audioLength} />
                </ProgressBar>
                <CurrentTime>{formatTime(currLength)}</CurrentTime>
              </PlayBar>
            )}
          </NoteInfo>
          <ContentWrapper>
            <NoteContents half={showMemo}>
              <Fade out={!showRecordingOptions}>
                {!canStart && (
                  <Message>
                    ????????? ????????? ????????? ????????? ??? ????????????. ?????? ??????????????????
                  </Message>
                )}
                <Flex>
                  <StartBtn
                    disabled={!canStart}
                    onMouseOver={() => setMouseOnCapture(true)}
                    onMouseOut={() => setMouseOnCapture(false)}
                    onClick={() => record(1)}
                  >
                    <BtnImage
                      src={
                        !mouseOnCapture && currentTheme === lightTheme
                          ? MicGrey
                          : MicWhite
                      }
                    />
                    ????????? ?????? ????????????
                  </StartBtn>
                  <StartBtn
                    disabled={!canStart}
                    onMouseOver={() => setMouseOnMic(true)}
                    onMouseOut={() => setMouseOnMic(false)}
                    onClick={() => record(0)}
                  >
                    <BtnImage
                      src={
                        !mouseOnMic && currentTheme === lightTheme
                          ? MicGrey
                          : MicWhite
                      }
                    />
                    ???????????? ????????????
                  </StartBtn>
                </Flex>
              </Fade>
              {content
                .filter(
                  (paragraph, index) =>
                    (waiting && paragraph.paragraphId === lastId) ||
                    (paragraph.paragraphContent !== '' &&
                      paragraph.paragraphContent !== '0' &&
                      paragraph.paragraphContent !== ' ')
                )
                .map((paragraph, index) => (
                  <Paragraph
                    key={paragraph.paragraphId}
                    recording={waiting}
                    paragraphId={paragraph.paragraphId}
                    bookmarked={paragraph.isBookmarked === 1}
                    content={paragraph.paragraphContent}
                    startTime={paragraph.startTime}
                    note={paragraph.memoContent}
                    waiting={waiting && paragraph.paragraphId === lastId}
                    partialResult={partialResult}
                    keywords={paragraph.keywords.map(({ keyword }) => keyword)}
                  />
                ))}
            </NoteContents>
            <Memos visible={showMemo} />
          </ContentWrapper>
        </Root>
      )}
    </BaseLayout>
  );
};

const Flex = styled.div`
  display: flex;
`;

const PlayBar = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  margin-top: 34rem;
  align-items: center;
`;

const Control = styled(Flex)`
  width: 81rem;
  justify-content: space-between;
`;

const ControlButton = styled.img`
  width: 25rem;
`;

const ProgressBar = styled.div`
  position: relative;
  width: 837rem;
  height: 4rem;
  border-radius: 5rem;
  background-color: ${(props) => props.theme.color.lightBorder};
`;

const CurrentTime = styled.div`
  object-fit: contain;
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #a2a2a2;
`;

const CurrentProgress = styled.div<{ current: number }>`
  position: absolute;
  left: 0;
  width: ${(props) => props.current * 837}rem;
  max-width: 837rem;
  height: 4rem;
  border-radius: 5rem;
  background-color: #7b68ee;
`;

const ProgressBtn = styled.img`
  width: 12rem;
  height: 12rem;
  object-fit: contain;
  box-shadow: 0 0 4rem 0 rgba(0, 0, 0, 0.2);
`;

const Message = styled.div`
  height: 20rem;
  font-family: Pretendard;
  font-size: 20rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  white-space: break-spaces;
  color: ${(props) => props.theme.color.tertiaryText};
  padding-bottom: 100rem;
  margin-top: -120rem;
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
  flex-direction: column;
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

  border: none;

  &:disabled {
    background-color: grey;
  }

  &:hover,
  &:active {
    &:not([disabled]) {
      color: #fff;
      box-shadow: 0 0 20rem 0 rgba(123, 104, 238, 0.6);
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
  padding-bottom: 200rem;
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
