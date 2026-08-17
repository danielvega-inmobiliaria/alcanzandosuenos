import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoalWizardProvider } from '../state/GoalWizardContext';
import { colors } from '../theme/tokens';

import Step1Categoria from '../screens/CrearMeta/Step1Categoria';
import Step2Numeros from '../screens/CrearMeta/Step2Numeros';
import Step3Partida from '../screens/CrearMeta/Step3Partida';
import Step4Resultado from '../screens/CrearMeta/Step4Resultado';
import PhotoUpsell from '../screens/CrearMeta/PhotoUpsell';
import TableroMetas from '../screens/Tablero/TableroMetas';
import DetalleMeta from '../screens/Tablero/DetalleMeta';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg },
};

export default function RootNavigator() {
  return (
    <GoalWizardProvider>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="TableroMetas">
          <Stack.Screen name="TableroMetas" component={TableroMetas} />
          <Stack.Screen name="DetalleMeta" component={DetalleMeta} />
          <Stack.Screen name="Step1Categoria" component={Step1Categoria} />
          <Stack.Screen name="Step2Numeros" component={Step2Numeros} />
          <Stack.Screen name="Step3Partida" component={Step3Partida} />
          <Stack.Screen name="Step4Resultado" component={Step4Resultado} />
          <Stack.Screen name="PhotoUpsell" component={PhotoUpsell} />
        </Stack.Navigator>
      </NavigationContainer>
    </GoalWizardProvider>
  );
}
