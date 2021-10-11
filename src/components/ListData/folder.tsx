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
import { useRecoilValue, useRecoilState } from 'recoil';

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
    // 한글 오름차순
    if (sortBy === SortMode.Alphabetically) {
      if (a.noteFolder!.folderName < b.noteFolder!.folderName) return -1;
      if (a.noteFolder!.folderName > b.noteFolder!.folderName) return 1;
      return 0;
    }
    // 한글 내림차순
    if (sortBy === SortMode.ReverseAlphabetically) {
      if (a.noteFolder!.folderName > b.noteFolder!.folderName) return -1;
      if (a.noteFolder!.folderName < b.noteFolder!.folderName) return 1;
      return 0;
    }
    // 오래된 순
    if (sortBy === SortMode.Oldest) {
      if (a.noteFolder!.createdAt < b.noteFolder!.createdAt) return -1;
      if (a.noteFolder!.createdAt > b.noteFolder!.createdAt) return 1;
      return 0;
    }
    // 새로 만든 순
    if (a.noteFolder!.createdAt > b.noteFolder!.createdAt) return -1;
    if (a.noteFolder!.createdAt < b.noteFolder!.createdAt) return 1;
    return 0;
  };

  const sortNote = (a, b) => {
    // 한글 오름차순
    if (sortBy === SortMode.Alphabetically) {
      if (a.noteFile!.fileName < b.noteFile!.fileName) return -1;
      if (a.noteFile!.fileName > b.noteFile!.fileName) return 1;
      return 0;
    }
    // 한글 내림차순
    if (sortBy === SortMode.ReverseAlphabetically) {
      if (a.noteFile!.fileName > b.noteFile!.fileName) return -1;
      if (a.noteFile!.fileName < b.noteFile!.fileName) return 1;
      return 0;
    }
    // 오래된 순
    if (sortBy === SortMode.Oldest) {
      if (a.noteFile!.createdAt < b.noteFile!.createdAt) return -1;
      if (a.noteFile!.createdAt > b.noteFile!.createdAt) return 1;
      return 0;
    }
    // 새로 만든 순
    if (a.noteFile!.createdAt > b.noteFile!.createdAt) return -1;
    if (a.noteFile!.createdAt < b.noteFile!.createdAt) return 1;
    return 0;
  };

  const getFolderItems = async () => {
    const response = await axios.get(`/v1/note/folder/childs/${folderId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    let folderData: NoteResponse[] = response.data;
    if (mode === NotesMode.Star)
      folderData = folderData.filter(
        (value) =>
          value.itemType === 'FOLDER' ||
          (value.itemType === 'FILE' && value.noteFile!.isImportant === 1)
      );
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
        alert('폴더 이름을 변경하지 못했습니다');
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
      // 폴더(id)를 폴더(folderId) 내부로 옮길 때
      if (parseInt(id, 10) !== folderId) {
        const fileData = new FormData();
        fileData.append('folderId', id);
        fileData.append('parentFolderId', String(folderId));
        await axios.put(`/v1/note/folder/${id}`, fileData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        // 폴더(id)의 상위 폴더와 옮겨 온 폴더(folderId) 리렌더
        refreshDrag();
        refreshFolder();
      }
    } else {
      // 파일(id)를 폴더(folderId) 내부로 옮길 때
      const fileData = new FormData();
      fileData.append('fileId', id);
      fileData.append('folderId', String(folderId));
      await axios.put(`/v1/note/file/${id}`, fileData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // 파일(id)의 상위 폴더와 옮겨 온 폴더(folderId) 리렌더
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
        dragOver={dragOver}
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
  border-bottom: #e6e6e6 1rem solid;
  padding: 0 30rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) => (props.dragOver ? 'background-color: #f6f6f6;' : '')}

  &:hover {
    background-color: #f6f6f6;
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
  color: #000;

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
`;

const TitleImage = styled.img<{ depth: number }>`
  width: 24rem;
  margin-right: 11rem;
  margin-left: ${(props) => `${props.depth * 20}rem`};
  user-select: none !important;
`;

export default FolderData;
