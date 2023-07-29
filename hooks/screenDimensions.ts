import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

// This is a custom hook that returns the current screen width and height
const useScreenDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    Dimensions.addEventListener('change', onChange);

    // Return a cleanup function to remove the event listener
    return () => {
      Dimensions.removeEventListener('change', onChange);
    };
  }, []); // Empty dependency array means this effect will only run once, on mount

  return screenData;
};

export default useScreenDimensions;