import { FC, useState, useCallback } from 'react';

import { ContextMode } from 'types';
import NoteData from 'components/ListData/note';
import FolderData from 'components/ListData/folder';
import ContextMenu from 'components/ContextMenu';

export interface NoteFile {
  fileId: number;
  userId: number;
  folderId: number;
  fileName: string;
  createdAt: string;
  updatedAt: string | null;
  categoryName: string;
  isImportant: number;
}

export interface NoteFolder {
  folderId: number;
  parentFolderId: number;
  folderName: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteResponse {
  itemType: string;
  noteFile: NoteFile | null;
  noteFolder: NoteFolder | null;
}

interface Props {
  data: NoteResponse;
  depth: number;
  refreshNotes: any;
}

const ListData: FC<Props> = ({ data, depth, refreshNotes }) => {
  // about context menu
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [contextMode, setContextMode] = useState<ContextMode>(ContextMode.No);
  const [contextItemId, setContextItemId] = useState<number>(0);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent, contextItemId, note) => {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setContextMode(note ? ContextMode.Note : ContextMode.Folder);
      setContextItemId(contextItemId);
    },
    [setAnchorPoint, setContextMode]
  );

  if (data.itemType === 'FILE') {
    const note = data.noteFile!;
    const oldDate = note?.createdAt;
    const newDate = `${oldDate?.substring(0, 4)}.${oldDate?.substring(
      5,
      7
    )}.${oldDate?.substring(8, 10)}`;
    return (
      <>
        <ContextMenu
          mode={contextMode}
          anchorPoint={anchorPoint}
          setContextMode={setContextMode}
          contextItemId={contextItemId}
          refreshNotes={refreshNotes}
        />
        <NoteData
          key={note?.fileId}
          title={note?.fileName}
          depth={depth}
          date={newDate}
          starred={note.isImportant === 1}
          subject={note.categoryName}
          menu={handleContextMenu}
          noteId={note.fileId}
        />
      </>
    );
  }
  const folder = data.noteFolder!;
  return (
    <>
      <ContextMenu
        mode={contextMode}
        anchorPoint={anchorPoint}
        setContextMode={setContextMode}
        contextItemId={contextItemId}
        refreshNotes={refreshNotes}
      />
      <FolderData
        key={folder.folderId}
        title={folder.folderName}
        depth={depth}
        opened={false}
        menu={handleContextMenu}
        folderId={folder.folderId}
      />
    </>
  );
};

export default ListData;
