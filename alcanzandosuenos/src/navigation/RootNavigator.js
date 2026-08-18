import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '../state/AuthContext';
import { GoalWizardProvider } from '../state/GoalWizardContext';
import { colors } from '../theme/tokens';

import AuthScreen from '../screens/Auth/AuthScreen';
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

// Stack de la app "de verdad", solo se monta con sesión activa — por eso
// GoalWizardProvider (que asume que hay un usuarioId) vive acá adentro y no
// más arriba envolviendo todo.
function AppStack() {
  return (
    <GoalWizardProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="TableroMetas">
        <Stack.Screen name="TableroMetas" component={TableroMetas} />
        <Stack.Screen name="DetalleMeta" component={DetalleMeta} />
        <Stack.Screen name="Step1Categoria" component={Step1Categoria} />
        <Stack.Screen name="Step2Numeros" component={Step2Numeros} />
        <Stack.Screen name="Step3Partida" component={Step3Partida} />
        <Stack.Screen name="Step4Resultado" component={Step4Resultado} />
        <Stack.Screen name="PhotoUpsell" component={PhotoUpsell} />
      </Stack.Navigator>
    </GoalWizardProvider>
  );
}

function Enrutador() {
  const { cargandoSesion, autenticado } = useAuth();

  if (cargandoSesion) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.purple2} />
      </View>
    );
  }

  return autenticado ? <AppStack /> : <AuthScreen />;
}

export default function RootNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer theme={navTheme}>
        <Enrutador />
      </NavigationContainer>
    </AuthProvider>
  );
}
