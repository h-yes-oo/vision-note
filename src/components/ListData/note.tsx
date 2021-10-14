import React, { FC, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { selectedNotes, selectMode, dragRefresh, selectedRefresh } from 'state';
import ContextMenu from 'components/ContextMenu';
import Note from 'assets/icons/Note.svg';
import Star from 'assets/icons/Star.svg';

interface Props {
  title: string | undefined;
  depth: number;
  date: string;
  starred: boolean;
  subject: string;
  noteId: number;
  refreshNotes: any;
}

const NoteData: FC<Props & RouteComponentProps> = ({
  title,
  depth,
  date,
  starred,
  subject,
  noteId,
  refreshNotes,
  history,
}) => {
  const [selectedIds, setSelectedIds] = useRecoilState(selectedNotes);
  const selecting = useRecoilValue(selectMode);
  const [selected, setSelected] = useState<boolean>(
    selectedIds.includes(noteId)
  );
  const setRefreshDrag = useSetRecoilState(dragRefresh);
  const [selectedRefreshList, setSelectedRefresh] =
    useRecoilState(selectedRefresh);
  // about context menu
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);

  useEffect(() => {
    setSelected(selectedIds.includes(noteId));
  }, [selectedIds]);

  const addToSelectedIds = (noteId: number) => {
    setSelectedIds([...selectedIds, noteId]);
    setSelectedRefresh([...selectedRefreshList, refreshNotes]);
  };

  const removeFromSelectedIds = (noteId: number) => {
    setSelectedIds(selectedIds.filter((value) => value !== noteId));
    setSelectedRefresh(
      selectedRefreshList.filter((value) => value !== refreshNotes)
    );
  };

  const toggleSelected = () => {
    if (selected) removeFromSelectedIds(noteId);
    else addToSelectedIds(noteId);
    setSelected(!selected);
  };

  const moveToNote = () => {
    history.push(`/note/${noteId}`);
  };

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!selecting) {
        setAnchorPoint({ x: event.pageX, y: event.pageY });
        setShowContextMenu(true);
      }
    },
    [setAnchorPoint, setShowContextMenu, selecting]
  );

  const closeContextMenu = () => setShowContextMenu(false);

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text', `n${noteId}`);
    setRefreshDrag(() => refreshNotes);
  };

  return (
    <>
      <ContextMenu
        visible={showContextMenu}
        anchorPoint={anchorPoint}
        closeContextMenu={closeContextMenu}
        noteId={noteId}
        starred={starred}
        afterDelete={refreshNotes}
        afterStar={refreshNotes}
      />
      <DataRow
        selected={showContextMenu || selectedIds.includes(noteId)}
        onClick={selecting ? toggleSelected : moveToNote}
        onContextMenu={handleContextMenu}
        draggable
        onDragStart={onDragStart}
      >
        <TitleData>
          <TitleImage depth={depth} src={Note} />
          <TitleName> {title} </TitleName>
        </TitleData>
        <StarData>{starred && <StarImage src={Star} />}</StarData>
        <DateData>{date}</DateData>
        <SubjectData>{subject}</SubjectData>
      </DataRow>
    </>
  );
};

const DataRow = styled.div<{ selected: boolean }>`
  min-height: 65rem;
  border-bottom: ${(props) => props.theme.color.border} 1rem solid;
  padding: 0 30rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${(props) =>
    props.selected ? props.theme.color.hover : ''};

  &:hover {
    background-color: ${(props) => props.theme.color.hover};
  }
`;

const TableData = styled.div`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.color.primaryText};

  user-select: none !important;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  white-space: nowrap;
`;

const TitleData = styled(TableData)`
  max-width: 570rem;
  width: 570rem;
  justify-content: flex-start;
`;

const TitleName = styled.p`
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none !important;
`;

const DateData = styled(TableData)`
  width: 280rem;
`;

const StarData = styled(TableData)`
  width: 52rem;
`;

const SubjectData = styled(TableData)`
  width: 28rem;
`;

const StarImage = styled.img`
  width: 28rem;
  user-select: none !important;
`;

const TitleImage = styled.img<{ depth: number }>`
  width: 24rem;
  user-select: none !important;
  margin-right: 11rem;
  margin-left: ${(props) => `${props.depth * 20}rem`};
`;

export default withRouter(NoteData);
