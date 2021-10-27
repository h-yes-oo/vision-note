import { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const Root = styled.div<{ notes: boolean; darkmode: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => (props.notes ? '' : 'position: absolute;')}
  overflow: hidden;
  border: none;
  width: ${(props) => (props.notes ? '100%' : '100vw')};
  min-height: ${(props) => (props.notes ? '100%' : '100vh')};
  background: ${(props) =>
    props.darkmode && !props.notes ? '#32363a' : 'inherit'};
`;

const dotFalling = keyframes`
  0% {
    box-shadow: 9999rem -15rem 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 9999rem 0 0 0 #9A9BA6;
  }
  100% {
    box-shadow: 9999rem 15rem 0 0 rgba(152, 128, 255, 0);
  }
`;

const dotFallingBefore = keyframes`
  0% {
    box-shadow: 9984rem -15rem 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 9984rem 0 0 0 #9A9BA6;
  }
  100% {
    box-shadow: 9984rem 15rem 0 0 rgba(152, 128, 255, 0);
  }
`;

const dotFallingAfter = keyframes`
  0% {
    box-shadow: 10014rem -15rem 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 10014rem 0 0 0 #9A9BA6;
  }
  100% {
    box-shadow: 10014rem 15rem 0 0 rgba(152, 128, 255, 0);
  }
`;

const DotFalling = styled.div`
  position: relative;
  left: -9999rem;
  width: 10rem;
  height: 10rem;
  border-radius: 5rem;
  background-color: #9a9ba6;
  color: #9a9ba6;
  box-shadow: 9999rem 0 0 0 #9a9ba6;
  animation: ${dotFalling} 1s infinite linear;
  animation-delay: 0.1s;

  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    width: 10rem;
    height: 10rem;
    border-radius: 5rem;
    background-color: #9a9ba6;
    color: #9a9ba6;
    animation: ${dotFallingBefore} 1s infinite linear;
    animation-delay: 0s;
  }

  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    width: 10rem;
    height: 10rem;
    border-radius: 5rem;
    background-color: #9a9ba6;
    color: #9a9ba6;
    animation: ${dotFallingAfter} 1s infinite linear;
    animation-delay: 0.2s;
  }
`;

interface Props {
  notes: boolean;
}

const Loading: FC<Props> = ({ notes }) => {
  return (
    <Root
      notes={notes}
      darkmode={localStorage.getItem('VisionNoteTheme') === '1'}
    >
      <DotFalling />
    </Root>
  );
};

export default Loading;
