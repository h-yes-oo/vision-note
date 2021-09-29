import { FC, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Dictate } from 'stt/dictate';
import { useRecoilValue } from 'recoil';
import { decodeUnicode } from 'functions';

import { userInfo } from 'state';

interface Props {}

const SttDemoPage: FC<Props> = () => {
  const [dictate, setDictate] = useState<Dictate>();
  const logRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const transcriptRef: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);
  const startRef: React.RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);
  const user = useRecoilValue(userInfo);

  const addToTranscription = (text) => {
    const prevTrans = transcriptRef.current;
    if (prevTrans !== null) prevTrans.innerHTML += `${text}\n`;
  };

  const addToLogs = (text) => {
    const el = logRef.current;
    if (el !== null) el.innerHTML += text;
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
          const startBtn = startRef.current;
          if (startBtn !== null) startBtn.disabled = true;
          addToLogs('unable to start\n');
        } else {
          const startBtn = startRef.current;
          if (startBtn !== null) startBtn.disabled = false;
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
    dictate?.init();
  }, [dictate]);

  const startListening = () => {
    if (dictate !== undefined) dictate.startListening();
  };

  const stopListening = () => {
    if (dictate !== undefined) dictate.stopListening();
  };

  const cancel = () => {
    if (dictate !== undefined) dictate.cancel();
  };

  const init = () => {
    if (dictate !== undefined) dictate.init();
  };

  return (
    <Root>
      <ButtonWrapper>
        <PurpleButton onClick={init}>데모 시작하기</PurpleButton>
        <PurpleButton ref={startRef} onClick={startListening}>
          녹음 시작하기
        </PurpleButton>
        <PurpleButton onClick={stopListening}>녹음 끝내기</PurpleButton>
        <PurpleButton onClick={cancel}>데모 끝내기</PurpleButton>
      </ButtonWrapper>
      <Title>음성 인식 결과 : </Title>
      <Logs ref={transcriptRef} />
      <Title>실행 로그 : </Title>
      <Logs ref={logRef} />
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

const Title = styled.div``;

const Logs = styled.div`
  white-space: break-spaces;
  overflow: scroll;
  height: 500px;
  width: 1000px;
`;

const Button = styled.button`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  border: none;
  margin: 20px;
  padding: 10px 20px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const PurpleButton = styled(Button)`
  background-color: #7b68ee;
  color: #fff;
  border-radius: 6px;

  &:hover {
    cursor: pointer;
    background-color: #6a58d3;
  }
`;

export default SttDemoPage;
