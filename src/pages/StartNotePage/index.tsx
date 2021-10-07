import { FC, useState, useEffect, useRef } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { authenticateToken } from 'state';
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
import MicGrey from 'assets/icons/MicGrey.svg';
import MicWhite from 'assets/icons/MicWhite.svg';
import UploadGrey from 'assets/icons/UploadGrey.svg';
import UploadWhite from 'assets/icons/UploadWhite.svg';
import FolderSample from 'assets/images/FolderSample2.svg';

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
  const [onRec, setOnRec] = useState<boolean>(false);
  const [onUpload, setOnUpload] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const authToken = useRecoilValue(authenticateToken);
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

  return (
    <BaseLayout grey={false}>
      <Root>
        <NoteInfo>
          <InfoTop>
            <NoteFolder src={FolderSample} />
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
                  full={KoreanFull}
                  empty={KoreanEmpty}
                  selected={course === Subject.Korean}
                />
                <CourseName>국어</CourseName>
              </Course>
              <Course>
                <CourseBox
                  onClick={() => setCourse(Subject.Math)}
                  full={MathFull}
                  empty={MathEmpty}
                  selected={course === Subject.Math}
                />
                <CourseName>수학</CourseName>
              </Course>
              <Course>
                <CourseBox
                  onClick={() => setCourse(Subject.Social)}
                  full={SocialFull}
                  empty={SocialEmpty}
                  selected={course === Subject.Social}
                />
                <CourseName>사회</CourseName>
              </Course>
              <Course>
                <CourseBox
                  onClick={() => setCourse(Subject.Science)}
                  full={ScienceFull}
                  empty={ScienceEmpty}
                  selected={course === Subject.Science}
                />
                <CourseName>과학</CourseName>
              </Course>
              <Course>
                <CourseBox
                  onClick={() => setCourse(Subject.General)}
                  full={GeneralFull}
                  empty={GeneralEmpty}
                  selected={course === Subject.General}
                />
                <CourseName>일반</CourseName>
              </Course>
            </CourseWrapper>
            <Fade out={course === undefined}>
              <StartBtn
                onMouseOver={() => setOnRec(true)}
                onMouseOut={() => setOnRec(false)}
                onClick={onClickStart}
              >
                <BtnImage src={onRec ? MicWhite : MicGrey} />
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
                <BtnImage src={onUpload ? UploadWhite : UploadGrey} />
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

const NoteTitle = styled.input`
  font-family: Pretendard;
  font-size: 30rem;
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
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #656565;
`;

const NoteFolder = styled.img`
  height: 20rem;
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
  color: #000;
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

const CourseBox = styled.a<{ full: string; empty: string; selected: boolean }>`
  width: 168rem;
  height: 168rem;
  border-radius: 8rem;
  background-color: #fff;
  margin: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${(props) =>
    props.selected ? props.full : props.empty});
  box-shadow: 0 0 16rem 0
    rgba(0, 0, 0, ${(props) => (props.selected ? '0.2' : '0.12')});
  &:hover {
    background-image: url(${(props) => props.full});
    box-shadow: 0 0 16rem 0 rgba(0, 0, 0, 0.2);
  }
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
  color: #000;
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
  background-color: #fff;
  font-family: Pretendard;
  font-size: 20rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #000;
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
