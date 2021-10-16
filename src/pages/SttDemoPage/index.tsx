import { FC, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Dictate } from 'stt/dictate';
import { useRecoilValue } from 'recoil';
import { decodeUnicode } from 'functions';

import { userInfo } from 'state';

interface Props {}

const SttDemoPage: FC<Props> = () => {
  const [dictate, setDictate] = useState<Dictate>();
  const [recording, setRecording] = useState<boolean>(false);
  const user = useRecoilValue(userInfo);
  const [transcript, setTranscript] = useState<string>('');
  const [log, setLog] = useState<string>('');
  const [canStart, setCanStart] = useState<boolean>(false);

  const addToTranscription = (text) => {
    setTranscript((prev) => `${prev}\n${text}`);
  };

  const addToLogs = (text) => {
    setLog((prev) => `${prev}\n${text}`);
  };

  useEffect(() => {
    const dictate = new Dictate({
      server: 'wss://stt.visionnote.io/client/ws/speech',
      serverStatus: 'wss://stt.visionnote.io/client/ws/status',
      recorderWorkerPath: './recorderWorker.js',
      user_id: String(user ? user.userId : '1003'),
      content_id: String(Date.now()),
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
        console.log(`partial result : ${decodeUnicode(hypos[0].transcript)}`);
      },
      onResults: (hypos) => {
        const result = decodeUnicode(hypos[0].transcript);
        addToTranscription(result);
        console.log(`result : ${result}`);
      },
      onError: (code, data) => {
        addToLogs(`Error: ${code}: ${data}\n`);
        dictate.cancel();
      },
      onEvent: (code, data) => {
        addToLogs(`msg: ${code} : ${data || ''}\n`);
      },
    });
    setDictate(dictate);
  }, []);

  useEffect(() => {
    return () => {
      dictate?.cancel();
    };
  }, [dictate]);

  const recordWithMic = () => {
    if (dictate !== undefined) {
      dictate.init(0).then((result) => {
        if (result) {
          dictate.startListening();
          setRecording(true);
        }
      });
    }
  };

  const stopListening = () => {
    if (dictate !== undefined) dictate.stopListening();
    setRecording(false);
  };

  const recordWithoutMic = () => {
    if (dictate !== undefined) {
      dictate.init(1).then((result) => {
        if (result) {
          dictate.startListening();
          setRecording(true);
        }
      });
    }
  };

  return (
    <Root>
      <ButtonWrapper>
        <PurpleButton disabled={!canStart} onClick={recordWithoutMic}>
          마이크 없이 녹음하기
        </PurpleButton>
        <PurpleButton disabled={!canStart} onClick={recordWithMic}>
          마이크 이용하여 녹음하기
        </PurpleButton>
        <PurpleButton onClick={stopListening} disabled={!recording}>
          녹음 끝내기
        </PurpleButton>
      </ButtonWrapper>
      <Title>음성 인식 결과 : </Title>
      <Logs>{transcript}</Logs>
      <Title>실행 로그 : </Title>
      <Logs>{log}</Logs>
    </Root>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > * {
    user-select: none !important;
  }
`;

const Title = styled.div`
  font-size: 20rem;
`;

const Logs = styled.div`
  white-space: break-spaces;
  overflow: scroll;
  height: 500rem;
  width: 1000rem;
  user-select: text !important;
  font-size: 20rem;
`;

const Button = styled.button`
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  border: none;
  margin: 20rem;
  padding: 10rem 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled {
    background-color: grey;
  }
`;

const PurpleButton = styled(Button)`
  background-color: #7b68ee;
  color: #fff;
  border-radius: 6rem;
  &:hover,
  &:active {
    &:not([disabled]) {
      cursor: pointer;
      background-color: #6a58d3;
    }
  }
`;

export default SttDemoPage;
