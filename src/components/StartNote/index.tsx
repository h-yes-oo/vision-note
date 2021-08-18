import { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import * as T from 'types';

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

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Info = styled.div`
  font-family: Pretendard;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #000;
  margin: 97px 0 39px;
  white-space: pre-wrap;
`;

const CourseWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-itmes: center;
  margin-bottom: 79px;
`;

const Course = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CourseBox = styled.a<{ full: string; empty: string; selected: boolean }>`
  width: 168px;
  height: 168px;
  border-radius: 8px;
  background-color: #fff;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${(props) =>
    props.selected ? props.full : props.empty});
  box-shadow: 0 0 16px 0
    rgba(0, 0, 0, ${(props) => (props.selected ? '0.2' : '0.12')});
  &:hover {
    background-image: url(${(props) => props.full});
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
  }
`;

const CourseName = styled.div`
  font-family: Pretendard;
  font-size: 20px;
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
  width: 310px;
  height: 70px;
  margin: 0 17px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.08);
  background-color: #fff;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  &:hover {
    color: #fff;
    box-shadow: 0 0 20px 0 rgba(123, 104, 238, 0.6);
    background-color: #7b68ee;
  }
`;

const BtnImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

interface Props {
  startRec: any;
}

const StartNote: FC<Props> = ({ startRec }) => {
  const [course, setCourse] = useState<T.Subject | undefined>(undefined);
  const [onRec, setOnRec] = useState<boolean>(false);
  const [onUpload, setOnUpload] = useState<boolean>(false);

  return (
    <Root>
      <Info>
        카테고리 선택 후, 녹음을 시작하거나 {'\n'}
        녹음 파일을 업로드하여 학습 노트를 만들어 보세요.
      </Info>
      <CourseWrapper>
        <Course>
          <CourseBox
            onClick={(e) => setCourse(T.Subject.Korean)}
            full={KoreanFull}
            empty={KoreanEmpty}
            selected={course === T.Subject.Korean}
          />
          <CourseName>국어</CourseName>
        </Course>
        <Course>
          <CourseBox
            onClick={(e) => setCourse(T.Subject.Math)}
            full={MathFull}
            empty={MathEmpty}
            selected={course === T.Subject.Math}
          />
          <CourseName>수학</CourseName>
        </Course>
        <Course>
          <CourseBox
            onClick={(e) => setCourse(T.Subject.Social)}
            full={SocialFull}
            empty={SocialEmpty}
            selected={course === T.Subject.Social}
          />
          <CourseName>사회</CourseName>
        </Course>
        <Course>
          <CourseBox
            onClick={(e) => setCourse(T.Subject.Science)}
            full={ScienceFull}
            empty={ScienceEmpty}
            selected={course === T.Subject.Science}
          />
          <CourseName>과학</CourseName>
        </Course>
        <Course>
          <CourseBox
            onClick={(e) => setCourse(T.Subject.General)}
            full={GeneralFull}
            empty={GeneralEmpty}
            selected={course === T.Subject.General}
          />
          <CourseName>일반</CourseName>
        </Course>
      </CourseWrapper>
      <Fade out={course === undefined}>
        <StartBtn
          onMouseOver={() => setOnRec(true)}
          onMouseOut={() => setOnRec(false)}
          onClick={() => startRec()}
        >
          <BtnImage src={onRec ? MicWhite : MicGrey} />
          녹음 시작하기
        </StartBtn>
        <StartBtn
          onMouseOver={() => setOnUpload(true)}
          onMouseOut={() => setOnUpload(false)}
        >
          <BtnImage src={onUpload ? UploadWhite : UploadGrey} />
          녹음 파일 업로드 하기
        </StartBtn>
      </Fade>
    </Root>
  );
};

export default StartNote;
