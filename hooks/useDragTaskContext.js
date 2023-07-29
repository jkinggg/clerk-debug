import React from 'react';
import { DragTaskContext } from '../contexts/dragTaskProvider';

export function useDragTaskContext() {
  const context = React.useContext(DragTaskContext);
  if (context === undefined) {
    throw new Error(
      'useDragTaskContext must be used within a DragTaskProvider'
    );
  }
  return context;
}