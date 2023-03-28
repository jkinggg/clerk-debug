import React, { useState, useEffect } from 'react'
import { Dimensions } from 'react-native'

export const DimensionsContext = React.createContext({})

export const DimensionsContextProvider = (props) => {

    const windowDimensions = Dimensions.get('window');

    const [dimensions, setDimensions] = useState({
        window: windowDimensions,
    });

    useEffect(() => {
        const subscription = Dimensions.addEventListener(
          'change',
          ({window}) => {
            setDimensions({window});
          },
        );
        return () => subscription?.remove();
    });

    return (
        <DimensionsContext.Provider value={dimensions}>
            {props.children}
        </DimensionsContext.Provider>
    )
}