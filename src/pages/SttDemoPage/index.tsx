import { FC, useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Dictate } from 'stt/dictate';
import { useRecoilValue } from 'recoil';

import { userInfo } from 'state';

interface Props {}

const SttDemoPage: FC<Props> = () => {
  const [dictate, setDictate] = useState<Dictate>();
  const [tlist, setTlist] = useState<string[]>([]);
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

  const tlistToString = () => {
    return tlist.join('.');
  };

  const addToLogs = (text) => {
    const el = logRef.current;
    if (el !== null) el.innerHTML += text;
  };

  function decodeUnicode(unicodeString) {
    const r = /\\u([\d\w]{4})/gi;
    unicodeString = unicodeString.replace(r, function (match, grp) {
      return String.fromCharCode(parseInt(grp, 16));
    });
    return unescape(unicodeString);
  }

  useEffect(() => {
    console.log(user ?? 'user 정보 없음');
    const dictate = new Dictate({
      server: 'ws://stt.visionnote.io/client/ws/speech',
      serverStatus: 'ws://stt.visionnote.io/client/ws/status',
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
          // $("#buttonStart").prop("disabled", true);
          // $("#serverStatusBar").addClass("highlight");
          addToLogs('unable to start\n');
        } else {
          const startBtn = startRef.current;
          if (startBtn !== null) startBtn.disabled = false;
          // $("#buttonStart").prop("disabled", false);
          // $("#serverStatusBar").removeClass("highlight");
          addToLogs('can start\n');
        }
      },
      onPartialResults: (hypos) => {
        // TODO: demo the case where there are more hypos
        // addToTranscription(hypos[0].transcript);
        console.log(`partial result : ${decodeUnicode(hypos[0].transcript)}`);
      },
      onResults: (hypos) => {
        // TODO: demo the case where there are more results
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

  window.onload = () => {
    init();
  };

  return (
    <Root>
      <PurpleButton onClick={init}>Init</PurpleButton>
      <PurpleButton ref={startRef} onClick={startListening}>
        startListening
      </PurpleButton>
      <PurpleButton onClick={stopListening}>stopListening</PurpleButton>
      <PurpleButton onClick={cancel}>cancel</PurpleButton>
      <Title>Transcript : </Title>
      <Logs ref={transcriptRef} />
      <Title>Log : </Title>
      <Logs ref={logRef} />
    </Root>
  );
};

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
