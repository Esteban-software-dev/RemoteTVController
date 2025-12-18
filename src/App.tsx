import 'react-native-gesture-handler';

import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';
import { EXPANDED_HEIGHT } from './navigation/constants/appbarDimensions.constant';
import { AppBarLayoutContext } from './navigation/context/AppbarLayoutContext';
import { AppBar } from './navigation/components/Appbar';
import { BottomTabsNavigator } from './navigation/navigators/BottomTabNavigator';

function App() {
  const [height, setHeight] = useState(EXPANDED_HEIGHT);

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppBarLayoutContext.Provider value={{ height, setHeight }}>
          <AppBar />
          <BottomTabsNavigator />
        </AppBarLayoutContext.Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default App;
