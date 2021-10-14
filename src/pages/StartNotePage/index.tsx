import { FC, useState, useEffect, useRef } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { authenticateToken, theme } from 'state';
import { isChrome, isWindows } from 'functions';
import { Subject } from 'types';

import BaseLayout from 'components/BaseLayout';

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
import UploadGrey from 'assets/icons/UploadGrey.svg';
import UploadWhite from 'assets/icons/UploadWhite.svg';
import GreyFolder from 'assets/icons/GreyFolder.svg';
import { lightTheme } from 'styles/theme';

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

interface Props {}

const StartNotePage: FC<Props & RouteComponentProps> = ({ history }) => {
  const [placeholder, setPlaceholder] = useState<string>(getTitle());
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>(getCurrentDate());
  const [course, setCourse] = useState<Subject | undefined>(undefined);
  const [hover, setHover] = useState<Subject | undefined>(undefined);
  const [onRec, setOnRec] = useState<boolean>(false);
  const [onUpload, setOnUpload] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const authToken = useRecoilValue(authenticateToken);
  const currentTheme = useRecoilValue(theme);
  const [clicked, setClicked] = useState<boolean>(false);
  // TODO : change recorder and stream as recoil state values
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [stream, setStream] = useState<MediaStream>();

  const displayMediaOptions = {
    video: true,
    audio: {
      sampleRate: 16000,
    },
  };

  const sendFile = async (fileToSend: File) => {
    const data = new FormData();
    data.append('wavfile', fileToSend);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const SttApi = axios.create({
      baseURL: 'http://52.78.213.224',
    });

    const response = await SttApi.put(
      '/client/dynamic/recognize',
      data,
      config
    );
    console.log(response);
  };

  const makeNote = async (
    isRecording: number,
    fileToSend: File | null = null
  ) => {
    const noteData = new FormData();
    if (title === '') noteData.append('fileName', placeholder);
    else noteData.append('fileName', title);
    noteData.append('categoryId', String(course));
    noteData.append('isRecording', String(isRecording));
    if (fileToSend !== null) {
      // TODO : 녹음 파일 보내기
      noteData.append('audioFile', fileToSend.name);
    }
    try {
      const response = await axios.post(`/v1/script`, noteData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return response.data.scriptId;
    } catch {
      alert('노트 생성 중 문제가 발생했습니다');
      return null;
    }
  };

  const goToNote = async (fileToSend: File) => {
    // setLoading(true);
    const id = await makeNote(0, fileToSend);
    // setLoading(false);
    if (id !== null) history.push(`/note/${id}`);
  };

  const onClickStart = async () => {
    if (isChrome()) {
      const id = await makeNote(1);
      if (id !== null) history.push(`/note/${id}`);
    } else alert('녹음은 크롬 브라우저에서만 가능합니다');
  };

  // 음원 파일이 업로드 되면 노트 생성 후 페이지 이동
  useEffect(() => {
    if (file !== null) goToNote(file);
  }, [file]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const onClickUpload = () => {
    if (fileRef.current !== null) fileRef.current.click();
  };

  const startRec = async () => {
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
          });
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
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
    <BaseLayout grey={false}>
      <Root>
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
          </InfoBottom>
        </NoteInfo>
        <NoteContents>
          <StartNote>
            <Info>
              카테고리 선택 후, 녹음을 시작하거나 {'\n'}
              녹음 파일을 업로드하여 학습 노트를 만들어 보세요.
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
              <StartBtn
                onMouseOver={() => setOnRec(true)}
                onMouseOut={() => setOnRec(false)}
                onClick={onClickStart}
              >
                <BtnImage
                  src={
                    !onRec && currentTheme === lightTheme ? MicGrey : MicWhite
                  }
                />
                녹음 시작하기
              </StartBtn>
              <StartBtn
                onMouseOver={() => setOnUpload(true)}
                onMouseOut={() => setOnUpload(false)}
                onClick={onClickUpload}
              >
                <UploadButton
                  ref={fileRef}
                  type="file"
                  accept=".wav"
                  onChange={onFileChange}
                />
                <BtnImage
                  src={
                    !onUpload && currentTheme === lightTheme
                      ? UploadGrey
                      : UploadWhite
                  }
                />
                녹음 파일 업로드 하기
              </StartBtn>
            </Fade>
          </StartNote>
        </NoteContents>
      </Root>
    </BaseLayout>
  );
};

const Root = styled.div`
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

const StartNote = styled.div`
  display: flex;
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
  visibility: ${(props) => (props.out ? 'hidden' : 'visible')};
  animation: ${(props) => (props.out ? fadeOut : fadeIn)} 1s linear;
  transition: visibility 1s linear;
`;

const StartBtn = styled.a`
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
`;

const UploadButton = styled.input`
  overflow: hidden;
  position: absolute;
  width: 1rem;
  height: 1rem;
  margin: -1rem;
  padding: 0;
  border: 0;
  clip: rect(0, 0, 0, 0);
`;

const BtnImage = styled.img`
  width: 40rem;
  height: 40rem;
  margin-right: 10rem;
`;

export default withRouter(StartNotePage);
