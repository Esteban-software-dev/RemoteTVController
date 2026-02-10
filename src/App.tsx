import 'react-native-gesture-handler';
import './config/i18n';

import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';
import { EXPANDED_HEIGHT } from './navigation/constants/appbarDimensions.constant';
import { AppBarLayoutContext } from './navigation/context/AppbarLayoutContext';
import { DrawerNavigator } from './navigation/navigators/DrawerNavigator';
import { AppBar } from './navigation/components/Appbar';
import { ContextMenuProvider } from './shared/context/ContextMenu';
import { useTranslation } from 'react-i18next';
import { BottomSheetProvider } from './shared/context/BottomSheetContext';
import { colors } from './config/theme/colors/colors';
import { ToastProvider } from './shared/context/ToastContext';
import { AlertProvider } from './shared/context/AlertContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  const [height, setHeight] = useState(EXPANDED_HEIGHT);
  const isDarkMode = useColorScheme() === 'dark';

  const { i18n } = useTranslation();
  if (!i18n.isInitialized) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ContextMenuProvider>
          <BottomSheetProvider>
            <ToastProvider>
              <AlertProvider>
                <NavigationContainer>
                  <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.accent.purple.soft} />
                  <AppBarLayoutContext.Provider value={{ height, setHeight }}>
                    <AppBar />
                    <DrawerNavigator />
                  </AppBarLayoutContext.Provider>
                </NavigationContainer>
              </AlertProvider>
            </ToastProvider>
          </BottomSheetProvider>
        </ContextMenuProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
export default App;
