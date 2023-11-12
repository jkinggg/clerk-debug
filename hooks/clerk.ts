import { Platform } from 'react-native';

const clerk = Platform.OS === 'web' ? require('@clerk/clerk-react') : require('@clerk/clerk-expo');

export default clerk;