import { createContext } from 'react';
import { useSharedValue } from 'react-native-reanimated';

export const DragTaskContext = createContext({
  isTaskBeingDragged: null,
  taskBeingDraggedId: null,
  setTaskBeingDraggedId: () => {},
  taskDropX: null,
  taskDropY: null,
  setTaskDropX: () => {},
  setTaskDropY: () => {},
});

const DragTaskProvider = ({ children }) => {
  const isTaskBeingDragged = useSharedValue(false); // only declare this once in the provider
  const taskBeingDraggedId = useSharedValue(null);
  const taskDropX = useSharedValue(0);
  const taskDropY = useSharedValue(0);

  const setTaskBeingDraggedId = (id) => {
    taskBeingDraggedId.value = id;
  };

  const setTaskDropX = (value) => {
    taskDropX.value = value;
  };

  const setTaskDropY = (value) => {
    taskDropY.value = value;
  };

  const value = {
    isTaskBeingDragged, // include this in the value passed to provider
    setTaskBeingDraggedId,
    taskBeingDraggedId,
    taskDropX,
    setTaskDropX,
    taskDropY,
    setTaskDropY,
  };

  return (
    <DragTaskContext.Provider value={value}>
      {children}
    </DragTaskContext.Provider>
  );
};

export default DragTaskProvider;