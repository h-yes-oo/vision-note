import { FC, useState, useEffect, useRef } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Dictate } from 'stt/dictate';
import { theme, alertInfo } from 'state';
import { isChrome, isWindows, decodeUnicode } from 'functions';
import { Subject } from 'types';

import LogoLight from 'assets/icons/LogoLight.png';
import LogoDark from 'assets/icons/LogoDark.png';
import SampleProfile from 'assets/images/SampleProfile.svg';
import KoreanFull from 'assets/icons/KoreanFull.svg';
import KoreanEmpty from 'assets/icons/KoreanEmpty.svg';
import MathFull from 'assets/icons/MathFull.svg';
import MathEmpty from 'assets/icons/MathEmpty.svg';
import SocialFull from 'assets/icons/SocialFull.svg';
import SocialEmpty from 'assets/icons/SocialEmpty.svg';
import ScienceFull from 'assets/icons/ScienceFull.svg';
import ScienceEmpty from 'assets/icons/ScienceEmpty.svg';
import GeneralFull from 'assets/icons/GeneralFull.svg';
import GeneralEmpty from 'assets/icons/GeneralEmpty.svg';
import KoreanEmptyDark from 'assets/icons/KoreanEmptyDark.svg';
import MathEmptyDark from 'assets/icons/MathEmptyDark.svg';
import SocialEmptyDark from 'assets/icons/SocialEmptyDark.svg';
import ScienceEmptyDark from 'assets/icons/ScienceEmptyDark.svg';
import GeneralEmptyDark from 'assets/icons/GeneralEmptyDark.svg';
import KoreanFullDark from 'assets/icons/KoreanFullDark.svg';
import MathFullDark from 'assets/icons/MathFullDark.svg';
import SocialFullDark from 'assets/icons/SocialFullDark.svg';
import ScienceFullDark from 'assets/icons/ScienceFullDark.svg';
import GeneralFullDark from 'assets/icons/GeneralFullDark.svg';
import MicGrey from 'assets/icons/MicGrey.svg';
import MicWhite from 'assets/icons/MicWhite.svg';
import GreyFolder from 'assets/icons/GreyFolder.svg';
import ProfileToggleDown from 'assets/icons/ProfileToggleDown.svg';
import ProfileToggleUp from 'assets/icons/ProfileToggleUp.svg';
import Recording from 'assets/icons/Recording.svg';
import Mic from 'assets/icons/Mic.svg';
import RecordingDark from 'assets/icons/RecordingDark.svg';
import MicDark from 'assets/icons/MicDark.svg';

import { lightTheme, darkTheme } from 'styles/theme';
import UserMenuForDemo from 'components/UserMenu/demo';
import ParagraphForDemo from 'components/Paragraph/demo';
import AlertTimeout from 'components/Alert/timeout';

const checkTime = (i: number): string => {
  return i < 10 ? `0${i}` : String(i);
};

const getTitle = () => {
  const currentdate = new Date();
  const datetime = `${currentdate.getFullYear()}.${
    currentdate.getMonth() + 1
  }.${currentdate.getDate()} ${checkTime(currentdate.getHours())}:${checkTime(
    currentdate.getMinutes()
  )}`;
  return datetime;
};

const getCurrentDate = () => {
  const currentdate = new Date();
  const datetime = `${currentdate.getFullYear()}.${
    currentdate.getMonth() + 1
  }.${currentdate.getDate()}`;
  return datetime;
};

interface ParagraphData {
  paragraphSequence: number;
  startTime: number;
  endTime: number;
  paragraphContent: string;
  memoContent: string | null;
  isBookmarked: number;
  keywords: any[];
}

interface Props {}

const DemoPage: FC<Props & RouteComponentProps> = ({ history }) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string>(getTitle());
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>(getCurrentDate());
  const [course, setCourse] = useState<Subject | undefined>(undefined);
  const [hover, setHover] = useState<Subject | undefined>(undefined);
  const currentTheme = useRecoilValue(theme);
  const [mouseOnMic, setMouseOnMic] = useState<boolean>(false);
  const [mouseOnCapture, setMouseOnCapture] = useState<boolean>(false);
  const [noteMade, setNoteMade] = useState<boolean>(false);
  const setAlert = useSetRecoilState(alertInfo);
  // about stt
  const [recording, setRecording] = useState<boolean>(false);
  const [dictate, setDictate] = useState<Dictate>();
  const [content, setContent] = useState<ParagraphData[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [canStart, setCanStart] = useState<boolean>(false);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [lastSequence, setSequence] = useState<number>(0);
  const [partialResult, setPartialResult] = useState<string>('');

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
        message: '띄어쓰기에 실패했습니다. \n',
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
  };

  const addNewParagraph = (time: number) => {
    setContent((prevContent) => [
      ...prevContent,
      {
        paragraphSequence:
          prevContent[prevContent.length - 1].paragraphSequence + 1,
        startTime: time,
        endTime: time,
        paragraphContent: '',
        memoContent: null,
        isBookmarked: 0,
        keywords: [],
      },
    ]);
    setSequence((prev) => prev + 1);
  };

  const recordWithMic = () => {
    if (isChrome()) {
      if (dictate !== undefined) {
        dictate.init(0).then((result) => {
          if (result) {
            setNoteMade(true);
            setContent([
              {
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
            setWaiting(true);
          }
        });
      }
    } else {
      setAlert({
        show: true,
        message:
          '녹음은 크롬 브라우저에서만 가능합니다.\n크롬에서 다시 시도해주세요.',
      });
    }
  };

  const recordWithoutMic = () => {
    if (isChrome()) {
      if (dictate !== undefined) {
        dictate.init(1).then((result) => {
          if (result) {
            setNoteMade(true);
            setContent([
              {
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
            setWaiting(true);
          }
        });
      }
    } else {
      setAlert({
        show: true,
        message:
          '녹음은 크롬 브라우저에서만 가능합니다.\n크롬에서 다시 시도해주세요.',
      });
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const dictate = new Dictate({
      server: 'wss://stt.visionnote.io/client/ws/speech',
      serverStatus: 'wss://stt.visionnote.io/client/ws/status',
      recorderWorkerPath: './recorderWorker.js',
      user_id: String(currentDate.getTime()),
      content_id: 'demo',
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
          addNewParagraph(startTime);
        } else if (result !== '' && result !== '.') {
          const endTime = Math.floor(end);
          addToContent(result, endTime);
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
        console.log(blob);
      },
    });

    setDictate(dictate);
    return () => {
      if (dictate !== undefined) dictate.cancel();
    };
  }, []);

  const stopRecording = () => {
    if (dictate !== undefined) dictate.stopListening();
    setRecording(false);
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [dictate]);

  const handleMouseEnter = () => {
    setShowUserMenu(true);
  };

  const handleMouseLeave = () => setShowUserMenu(false);

  const getRecordingSrc = () => {
    if (currentTheme === lightTheme) return recording ? Recording : Mic;
    return recording ? RecordingDark : MicDark;
  };

  const full = {};
  full[Subject.Korean] = KoreanFull;
  full[Subject.Math] = MathFull;
  full[Subject.Social] = SocialFull;
  full[Subject.Science] = ScienceFull;
  full[Subject.General] = GeneralFull;
  const light = {};
  light[Subject.Korean] = KoreanEmpty;
  light[Subject.Math] = MathEmpty;
  light[Subject.Social] = SocialEmpty;
  light[Subject.Science] = ScienceEmpty;
  light[Subject.General] = GeneralEmpty;
  const dark = {};
  dark[Subject.Korean] = KoreanEmptyDark;
  dark[Subject.Math] = MathEmptyDark;
  dark[Subject.Social] = SocialEmptyDark;
  dark[Subject.Science] = ScienceEmptyDark;
  dark[Subject.General] = GeneralEmptyDark;
  const fullDark = {};
  fullDark[Subject.Korean] = KoreanFullDark;
  fullDark[Subject.Math] = MathFullDark;
  fullDark[Subject.Social] = SocialFullDark;
  fullDark[Subject.Science] = ScienceFullDark;
  fullDark[Subject.General] = GeneralFullDark;

  const getCourseSrc = (selected: Subject) => {
    if (course === selected || hover === selected) {
      if (currentTheme === lightTheme) return full[selected];
      return fullDark[selected];
    }
    if (currentTheme === lightTheme) return light[selected];
    return dark[selected];
  };

  return (
    <Root>
      <AlertTimeout />
      <Header>
        <HeaderInside>
          <Logo onClick={() => history.push('/')}>
            <LogoImage
              src={currentTheme === darkTheme ? LogoDark : LogoLight}
            />
          </Logo>
          <UserDiv
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <ProfileImg src={SampleProfile} />
            <ProfileName>비회원님</ProfileName>
            <Relative>
              <ProfileToggle
                src={showUserMenu ? ProfileToggleUp : ProfileToggleDown}
              />
              <UserMenuForDemo show={showUserMenu} setShow={setShowUserMenu} />
            </Relative>
          </UserDiv>
        </HeaderInside>
      </Header>
      <Demo>
        <NoteInfo>
          <InfoTop>
            <NoteFolder src={GreyFolder} />
            전체 폴더
          </InfoTop>
          <InfoMiddle>
            <NoteTitle
              placeholder={placeholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            </RecordingWrapper>
          </InfoBottom>
        </NoteInfo>
        <NoteContents>
          <StartNote noteMade={noteMade}>
            <Info>
              카테고리 선택 후, 녹음을 시작해보세요 {'\n'}
              체험 페이지에서는 생성된 노트가 저장되지 않습니다. {'\n'}
              로그인 후 더 많은 기능을 이용하실 수 있습니다.
            </Info>
            <CourseWrapper>
              <Course>
                <CourseBox
                  onClick={() => setCourse(Subject.Korean)}
                  selected={
                    course === Subject.Korean || hover === Subject.Korean
                  }
                  onMouseEnter={() => setHover(Subject.Korean)}
                  onMouseLeave={() => setHover(undefined)}
                >
                  <CourseImage src={getCourseSrc(Subject.Korean)} />
                </CourseBox>
                <CourseName>국어</CourseName>
              </Course>
              <Course>
                <CourseBox
                  onClick={() => setCourse(Subject.Math)}
                  selected={course === Subject.Math || hover === Subject.Math}
                  onMouseEnter={() => setHover(Subject.Math)}
                  onMouseLeave={() => setHover(undefined)}
                >
                  <CourseImage src={getCourseSrc(Subject.Math)} />
                </CourseBox>
                <CourseName>수학</CourseName>
              </Course>
              <Course>
                <CourseBox
                  onClick={() => setCourse(Subject.Social)}
                  selected={
                    course === Subject.Social || hover === Subject.Social
                  }
                  onMouseEnter={() => setHover(Subject.Social)}
                  onMouseLeave={() => setHover(undefined)}
                >
                  <CourseImage src={getCourseSrc(Subject.Social)} />
                </CourseBox>
                <CourseName>사회</CourseName>
              </Course>
              <Course>
                <CourseBox
                  onClick={() => setCourse(Subject.Science)}
                  selected={
                    course === Subject.Science || hover === Subject.Science
                  }
                  onMouseEnter={() => setHover(Subject.Science)}
                  onMouseLeave={() => setHover(undefined)}
                >
                  <CourseImage src={getCourseSrc(Subject.Science)} />
                </CourseBox>
                <CourseName>과학</CourseName>
              </Course>
              <Course>
                <CourseBox
                  onClick={() => setCourse(Subject.General)}
                  selected={
                    course === Subject.General || hover === Subject.General
                  }
                  onMouseEnter={() => setHover(Subject.General)}
                  onMouseLeave={() => setHover(undefined)}
                >
                  <CourseImage src={getCourseSrc(Subject.General)} />
                </CourseBox>
                <CourseName>일반</CourseName>
              </Course>
            </CourseWrapper>
            <Fade out={course === undefined}>
              {!canStart && (
                <Message>
                  서버의 오류로 녹음을 시작할 수 없습니다. 잠시 기다려주세요
                </Message>
              )}
              <Flex>
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
              </Flex>
            </Fade>
          </StartNote>
          {noteMade &&
            content
              .filter(
                (paragraph, index) =>
                  (waiting &&
                    paragraph.paragraphSequence === lastSequence - 1) ||
                  (paragraph.paragraphContent !== '' &&
                    paragraph.paragraphContent !== '0' &&
                    paragraph.paragraphContent !== ' ')
              )
              .map((paragraph, index) => (
                <ParagraphForDemo
                  key={paragraph.paragraphSequence}
                  recording={waiting}
                  bookmarked={paragraph.isBookmarked === 1}
                  content={paragraph.paragraphContent}
                  startTime={paragraph.startTime}
                  note={paragraph.memoContent}
                  waiting={
                    waiting && paragraph.paragraphSequence === lastSequence - 1
                  }
                  partialResult={partialResult}
                  keywords={paragraph.keywords.map(({ keyword }) => keyword)}
                />
              ))}
        </NoteContents>
      </Demo>
    </Root>
  );
};

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

const Flex = styled.div`
  display: flex;
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

const Root = styled.div`
  background-color: ${(props) => (props.theme === darkTheme ? '#2f3437' : '')}};
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  > * {
    user-select: none !important;
  }
`;

const Header = styled.div`
  width: 100vw;
  height: 90rem;
  padding-top: 15rem;
  object-fit: contain;
  box-shadow: 0 3rem 6rem 0 rgba(0, 0, 0, 0.08);
  background-color: ${(props) => props.theme.color.background};
  display: flex;
  justify-content: center;
  z-index: 1;
`;

const HeaderInside = styled.div`
  width: 1000rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  width: 300rem;
  height: 80rem;
  margin: 0 -40rem;
  &:hover {
    cursor: pointer;
  }
  overflow: hidden;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

const UserDiv = styled(FlexDiv)`
  padding: 4rem 0;
`;

const ProfileImg = styled.img`
  width: 50rem;
  height: 50rem;
  margin: 0 12rem;
  object-fit: contain;
`;

const ProfileName = styled.div`
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.secondaryText}; ;
`;

const ProfileToggle = styled.img`
  width: 10.2rem;
  margin-left: 10rem;
`;

const Relative = styled.div`
  position: relative;
  height: 50rem;
  display: flex;
  align-items: center;
`;

const Demo = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32rem;
  width: 1000rem;
`;

const NoteInfo = styled.div``;

const InfoTop = styled.div`
  font-family: Pretendard;
  font-style: normal;
  font-weight: normal;
  font-size: 16rem;
  max-height: 20rem;
  display: flex;
  color: ${(props) => props.theme.color.semiText};
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

const NoteTitle = styled.input`
  font-family: Pretendard;
  font-size: 30rem;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.secondaryText};
  background: ${(props) => props.theme.color.background};
  border: none;

  &::placeholder {
    color: ${(props) => props.theme.color.secondaryText};
  }
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

const NoteContents = styled.div``;

const StartNote = styled.div<{ noteMade: boolean }>`
  display: ${(props) => (props.noteMade ? 'none' : 'flex')};
  flex-direction: column;
  align-items: center;
`;

const Info = styled.div`
  font-family: Pretendard;
  font-size: 24rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: ${(props) => props.theme.color.primaryText};
  margin: 97rem 0 39rem;
  white-space: pre-wrap;
`;

const CourseWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-itmes: center;
  margin-bottom: 79rem;
`;

const Course = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CourseBox = styled.div<{ selected: boolean }>`
  width: 168rem;
  height: 168rem;
  border-radius: 8rem;
  background-color: ${(props) => props.theme.color.lightBackground};
  margin: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 0 16rem 0
    rgba(0, 0, 0, ${(props) => (props.selected ? '0.2' : '0.12')});
  &:hover {
    box-shadow: 0 0 16rem 0 rgba(0, 0, 0, 0.2);
  }
`;

const CourseImage = styled.img`
  width: 76rem;
  height: 76rem;
`;

const CourseName = styled.div`
  font-family: Pretendard;
  font-size: 20rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: center;
  color: ${(props) => props.theme.color.secondaryText};
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  visibility: ${(props) => (props.out ? 'hidden' : 'visible')};
  animation: ${(props) => (props.out ? fadeOut : fadeIn)} 1s linear;
  transition: visibility 1s linear;
  margin-top: 100rem;
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

export default withRouter(DemoPage);
