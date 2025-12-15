import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabsNavigator } from '@src/navigaton/navigators/BottomTabNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <BottomTabsNavigator />
    </NavigationContainer>
  );
}
export default App;
