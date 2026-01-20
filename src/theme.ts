import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const mainThemeColors = {
  // PRIMARIOS - Botones principales y elementos destacados
  primaryBlue: "#0d9488",        // Botones guardar, FAB, iconos principales (teal brillante)
  primaryNavy: "#0f766e",        // Header y tab bar (teal medio-claro)
  
  // SECUNDARIOS
  secondaryIndigo: "#06b6d4",    // Links y textos secundarios (cyan luminoso)
  
  // PELIGRO/ERROR - Acciones destructivas
  dangerRed: "#ff6b6b",          // Botón cancelar, delete button (rojo brillante)
  dangerRedDark: "#ff0000",      // Borde delete button (rojo más intenso)
  errorRed: "#ff7675",           // Textos de error (rojo claro)
  
  // FONDOS - Colores de fondo
  bgWhite: "#ffffff",            // Cards, inputs, popups
  bgLight: "#f0f9f8",            // Contenedor principal (blanco con tint teal más fuerte)
  bgLightGray: "#e0f2f1",        // Fondo inputs de login (muy claro y luminoso)
  bgInputsClientes: "#f0f9f8",   // Fondo inputs en PopUpCrear (teal muy claro para resaltar)
  
  // GRISES - Escala de grises para textos y elementos
  grayLabel: "#6b7280",          // Labels, textos secundarios, iconos (gris neutro)
  grayText: "#9ca3af",           // Placeholder, textos terciarios (gris claro)
  grayBorder: "#7eccc4",         // Bordes generales (teal más saturado y visible)
  grayBorderLight: "#a8d8d3",    // Bordes claros (teal claro pero distinguible)
  grayIcon: "#26a69a",           // Iconos (teal medio)
  
  // TEXTOS - Colores de texto principales
  textDarkMain: "#00453d",       // Nombres, títulos principales (teal muy oscuro)
  textDark: "#00453d",           // Textos normales (nombre cliente)
  textMedium: "#00897b",         // Valores, textos medianos (teal oscuro)
  textGray: "#4db8a8",           // Subtítulos login (teal claro)
  textLightGray: "#80cbc4",      // Separator text (teal muy claro)
  textInputDark: "#00453d",      // Texto input email
  textInputColor: "#00453d",     // Texto input editar modal
  
  // INPUTS - Específicos para campos de entrada
  inputBorderBlue: "#00897b",    // Borde inputs modal editar (teal más oscuro y visible)
  inputBgWhite: "#f0f9f8",       // Fondo inputs (teal muy claro para resaltar)
  inputPlaceholder: "#80cbc4",   // Placeholder inputs login
  
  // COMPONENTES - Elementos específicos
  avatarBg: "#b2ebf2",           // Fondo avatar clientes (cyan muy claro)
  avatarText: "#0d9488",         // Texto avatar (teal)
  cardBg: "#ffffff",             // Fondo cards clientes
  cardBorderLeft: "#0d9488",     // Borde izquierdo cards (teal)
  
  // NAVEGACIÓN - Tab bar y header
  headerBg: "#0f766e",           // Fondo header (teal medio-claro - LIGHT MODE)
  headerText: "#ffffff",         // Texto header
  tabBg: "#0f766e",              // Fondo tab bar (teal medio-claro)
  tabActive: "#87e4f0",          // Tab activo (cyan luminoso - muy visible y llamativo)
  tabInactive: "#b9bdc2",        // Tab inactivo (gris claro - visible pero discreto)
};

export const themeApp = {
  ...DefaultTheme,
  colors: mainThemeColors,
};