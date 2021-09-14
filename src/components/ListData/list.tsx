import { FC, useState, ReactNode } from 'react';
import styled from 'styled-components';

import NoteData from 'components/ListData/note';
import FolderData from 'components/ListData/folder';

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
  menu: any;
}

const ListData: FC<Props> = ({ data, depth, menu }) => {
  if (data.itemType === 'FILE') {
    const note = data.noteFile;
    const oldDate = note?.createdAt;
    const newDate = `${oldDate?.substr(0, 4)}.${oldDate?.substr(
      5,
      2
    )}.${oldDate?.substr(8, 2)}`;
    return (
      <NoteData
        key={note?.fileId}
        title={note?.fileName}
        depth={depth}
        date={newDate}
        starred={note!.isImportant === 1}
        subject={note!.categoryName}
        menu={menu}
        noteId={note!.fileId}
      />
    );
  }
  const folder = data.noteFolder;
  return (
    <FolderData
      key={folder!.folderId}
      title={folder!.folderName}
      depth={depth}
      opened={false}
      menu={menu}
      folderId={folder!.folderId}
    />
  );
};

export default ListData;
