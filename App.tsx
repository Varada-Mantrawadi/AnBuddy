import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SignInScreen from './src/screens/SignInScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import PanicScreen from './src/screens/PanicScreen';
import BreathingScreen from './src/screens/BreathingScreen';
import JournalScreen from './src/screens/JournalScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ThemeContext } from './src/context/ThemeContext';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const [initialRoute, setInitialRoute] = useState<string>('SignIn');
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const profile = await AsyncStorage.getItem('userProfile');
        setInitialRoute(profile ? 'Home' : 'SignIn');
        const saved = await AsyncStorage.getItem('theme');
        if (saved === 'dark') setIsDark(true);
        else if (saved === 'light') setIsDark(false);
        else setIsDark(Appearance.getColorScheme() === 'dark');
      } catch {
        setInitialRoute('SignIn');
      }
    })();
  }, []);

  const themeContextValue = useMemo(() => ({
    isDark: !!isDark,
    toggle: async () => {
      setIsDark((prev) => {
        const next = !prev;
        AsyncStorage.setItem('theme', next ? 'dark' : 'light').catch(() => {});
        return next;
      });
    },
  }), [isDark]);

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={themeContextValue}>
        <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#7E57C2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="SignIn" 
            component={SignInScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'AnBuddy' }}
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen}
            options={{ title: 'Chat with AnBuddy' }}
          />
          <Stack.Screen 
            name="Panic" 
            component={PanicScreen}
            options={{ title: 'Emergency Help' }}
          />
          <Stack.Screen 
            name="Breathing" 
            component={BreathingScreen}
            options={{ title: 'Breathing Exercise' }}
          />
          <Stack.Screen 
            name="Journal" 
            component={JournalScreen}
            options={{ title: 'Daily Journal' }}
          />
        </Stack.Navigator>
        </NavigationContainer>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

export default App;

