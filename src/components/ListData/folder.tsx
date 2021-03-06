import React, {
  FC,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import { NotesMode, SortMode } from 'types';
import ContextMenuFolder from 'components/ContextMenu/folder';

import FolderPurple from 'assets/icons/FolderPurple.svg';
import FolderBlue from 'assets/icons/FolderBlue.svg';
import FolderPurpleClosed from 'assets/icons/FolderPurpleClosed.svg';
import FolderBlueClosed from 'assets/icons/FolderBlueClosed.svg';
import {
  authenticateToken,
  dragRefresh,
  notesMode,
  selectMode,
  sortMode,
  alertInfo,
} from 'state';
import ListData, { NoteResponse } from './list';

interface Props {
  title: string | undefined;
  folderId: number;
  depth: number;
  opened: boolean;
  refreshNotes: any;
  refreshRoot: () => void;
}

const FolderData: FC<Props> = ({
  title,
  folderId,
  depth,
  opened,
  refreshNotes,
  refreshRoot,
}) => {
  const [open, setOpen] = useState<boolean>(opened);
  const [notes, setNotes] = useState<ReactNode>(<></>);
  const [refresh, setRefresh] = useState<boolean>(false);
  const mode = useRecoilValue(notesMode);
  const selecting = useRecoilValue(selectMode);
  const authToken = useRecoilValue(authenticateToken);
  const [folderTitle, setFolderTitle] = useState<string>(title ?? '');
  const setAlert = useSetRecoilState(alertInfo);
  // about context menu
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [contextMode, setShowContextMenu] = useState<boolean>(false);
  // about editing folder name
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  // about drag and drop
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [refreshDrag, setRefreshDrag] = useRecoilState<() => void>(dragRefresh);
  const sortBy = useRecoilValue(sortMode);

  const folderNameRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

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

  const refreshFolder = () => setRefresh(!refresh);

  const folderImage = () => {
    // if (depth % 2 === 0)
    //   return open || dragOver ? FolderPurple : FolderPurpleClosed;
    return open || dragOver ? FolderPurple : FolderPurpleClosed;
  };

  const sortFolder = (a, b) => {
    // ?????? ????????????
    if (sortBy === SortMode.Alphabetically) {
      if (a.noteFolder!.folderName < b.noteFolder!.folderName) return -1;
      if (a.noteFolder!.folderName > b.noteFolder!.folderName) return 1;
      return 0;
    }
    // ?????? ????????????
    if (sortBy === SortMode.ReverseAlphabetically) {
      if (a.noteFolder!.folderName > b.noteFolder!.folderName) return -1;
      if (a.noteFolder!.folderName < b.noteFolder!.folderName) return 1;
      return 0;
    }
    // ????????? ???
    if (sortBy === SortMode.Oldest) {
      if (a.noteFolder!.createdAt < b.noteFolder!.createdAt) return -1;
      if (a.noteFolder!.createdAt > b.noteFolder!.createdAt) return 1;
      return 0;
    }
    // ?????? ?????? ???
    if (a.noteFolder!.createdAt > b.noteFolder!.createdAt) return -1;
    if (a.noteFolder!.createdAt < b.noteFolder!.createdAt) return 1;
    return 0;
  };

  const sortNote = (a, b) => {
    // ?????? ????????????
    if (sortBy === SortMode.Alphabetically) {
      if (a.noteFile!.fileName < b.noteFile!.fileName) return -1;
      if (a.noteFile!.fileName > b.noteFile!.fileName) return 1;
      return 0;
    }
    // ?????? ????????????
    if (sortBy === SortMode.ReverseAlphabetically) {
      if (a.noteFile!.fileName > b.noteFile!.fileName) return -1;
      if (a.noteFile!.fileName < b.noteFile!.fileName) return 1;
      return 0;
    }
    // ????????? ???
    if (sortBy === SortMode.Oldest) {
      if (a.noteFile!.createdAt < b.noteFile!.createdAt) return -1;
      if (a.noteFile!.createdAt > b.noteFile!.createdAt) return 1;
      return 0;
    }
    // ?????? ?????? ???
    if (a.noteFile!.createdAt > b.noteFile!.createdAt) return -1;
    if (a.noteFile!.createdAt < b.noteFile!.createdAt) return 1;
    return 0;
  };

  const getFolderItems = async () => {
    const response = await axios.get(`/v1/note/folder/childs/${folderId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    let folderData: NoteResponse[] = response.data;
    if (mode === NotesMode.Star) {
      folderData = folderData.filter(
        (value) =>
          value.itemType === 'FOLDER' ||
          (value.itemType === 'FILE' && value.noteFile!.isImportant === 1)
      );
    }
    // else if (mode === NotesMode.Recent) {
    //   const currentdate = new Date();
    //   currentdate.setMonth(currentdate.getMonth() - 1);
    //   const beforeOneMonth = `${currentdate.getFullYear()}.${checkTime(
    //     currentdate.getMonth() + 1
    //   )}.${checkTime(currentdate.getDate())}`;
    //   folderData = folderData.filter(
    //     (value) =>
    //       value.itemType === 'FOLDER' ||
    //       (value.itemType === 'FILE' &&
    //         value.noteFile!.createdAt.slice(0, 10).replace(/-/gi, '.') >
    //           beforeOneMonth)
    //   );
    // }

    if (folderData !== undefined) {
      const folders = folderData
        .filter((value) => value.itemType === 'FOLDER')
        .sort(sortFolder)
        .map((value) => {
          const key = `FOLDER.${value.noteFolder!.folderId}`;
          return (
            <ListData
              key={key}
              data={value}
              depth={depth + 1}
              refreshNotes={refreshFolder}
              refreshRoot={refreshRoot}
            />
          );
        });

      const notes = folderData
        .filter((value) => value.itemType === 'FILE')
        .sort(sortNote)
        .map((value) => {
          const key = `FILE.${value.noteFile!.fileId}.${
            value.noteFile!.isImportant
          }`;
          return (
            <ListData
              key={key}
              data={value}
              depth={depth + 1}
              refreshNotes={refreshFolder}
              refreshRoot={refreshRoot}
            />
          );
        });

      const mixed = folderData.map((value) => {
        let key = '';
        if (value.itemType === 'FOLDER') {
          key = `FOLDER.${value.noteFolder!.folderId}`;
        } else {
          key = `FILE.${value.noteFile!.fileId}.${value.noteFile!.isImportant}`;
        }
        return (
          <ListData
            key={key}
            data={value}
            depth={depth + 1}
            refreshNotes={refreshFolder}
            refreshRoot={refreshRoot}
          />
        );
      });

      setNotes(
        <>
          {folders}
          {notes}
        </>
      );
    } else setNotes(<></>);
  };

  useEffect(() => {
    if (authToken !== null) getFolderItems();
  }, [refresh, mode, sortBy]);

  const handleClick = () => {
    if (!editing) {
      setOpen(!open);
    }
  };

  const editFolderName = () => {
    setEditing(true);
    if (folderNameRef.current !== null)
      setTimeout(() => folderNameRef.current!.focus(), 10);
  };

  const endEditing = async () => {
    setEditing(false);
    if (newName !== '') {
      try {
        const folderData = new FormData();
        folderData.append('folderId', String(folderId));
        folderData.append('folderName', newName);
        await axios.put(`/v1/note/folder/${folderId}`, folderData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setFolderTitle(newName);
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

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const data = e.dataTransfer.getData('text');
    const type = data[0];
    const id = data.slice(1);
    if (type === 'f') {
      // ??????(id)??? ??????(folderId) ????????? ?????? ???
      if (parseInt(id, 10) !== folderId) {
        const fileData = new FormData();
        fileData.append('folderId', id);
        fileData.append('parentFolderId', String(folderId));
        await axios.put(`/v1/note/folder/move/${id}`, fileData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        // ??????(id)??? ?????? ????????? ?????? ??? ??????(folderId) ?????????
        refreshDrag();
        refreshFolder();
      }
    } else {
      // ??????(id)??? ??????(folderId) ????????? ?????? ???
      const fileData = new FormData();
      fileData.append('fileId', id);
      fileData.append('folderId', String(folderId));
      await axios.put(`/v1/note/file/move/${id}`, fileData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // ??????(id)??? ?????? ????????? ?????? ??? ??????(folderId) ?????????
      refreshDrag();
      refreshFolder();
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // setOpen(true);
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const onDragStart = (e: React.DragEvent) => {
    setOpen(false);
    e.dataTransfer.setData('text', `f${folderId}`);
    setRefreshDrag(() => refreshNotes);
  };

  return (
    <>
      <ContextMenuFolder
        visible={contextMode}
        anchorPoint={anchorPoint}
        closeContextMenu={closeContextMenu}
        folderId={folderId}
        refreshNotes={refreshNotes}
        editFolderName={editFolderName}
      />
      <DataRow
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        dragOver={dragOver || contextMode}
        draggable
        onDragStart={onDragStart}
      >
        <TitleData>
          <TitleImage depth={depth} src={folderImage()} />
          <EditOverlay visible={editing} onClick={endEditing} />
          <EditTitleName
            type="text"
            value={newName}
            placeholder={folderTitle}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={onPressEnter}
            ref={folderNameRef}
            visible={editing}
          />
          <TitleName visible={!editing}> {folderTitle} </TitleName>
        </TitleData>
      </DataRow>
      <NoteWrapper visible={open}>{notes}</NoteWrapper>
    </>
  );
};

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

const NoteWrapper = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? '' : 'none')};
`;

const DataRow = styled.div<{ dragOver: boolean }>`
  min-height: 65rem;
  border-bottom: ${(props) => props.theme.color.border} 1rem solid;
  padding: 0 30rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.dragOver ? props.theme.color.hover : ''};

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

const TitleName = styled.p<{ visible: boolean }>`
  display: ${(props) => (props.visible ? '' : 'none')};
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none !important;
  color: ${(props) => props.theme.color.primaryText};
`;

const EditTitleName = styled.input<{ visible: boolean }>`
  display: ${(props) => (props.visible ? '' : 'none')};
  border: 2rem solid #06cc80;
  border-radius: 3rem;
  box-sizing: border-box;
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  background: ${(props) => props.theme.color.background};
  color: ${(props) => props.theme.color.primaryText};
`;

const TitleImage = styled.img<{ depth: number }>`
  width: 24rem;
  margin-right: 11rem;
  margin-left: ${(props) => `${props.depth * 20}rem`};
  user-select: none !important;
`;

export default FolderData;
