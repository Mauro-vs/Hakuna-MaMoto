import { Stack, useFocusEffect, Redirect } from "expo-router";
import React, { useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { Cliente } from "../../../data/Clientes";
import { clientesService } from "../../../services/clientesService";
import { PopUpCrear } from "../../../components/clientesPages/PopUpCrear";
import { ListaClienteItem } from "../../../components/clientesPages/ListaClientes"; // tu render
import { useThemeColors } from "../../../store/preferencesStore";
import { useUserStore } from "../../../store/userStore";

export default function HomeClientes() {
  const [list, setList] = useState<Cliente[]>([]);
  const [visible, setVisible] = useState(false);
  const colors = useThemeColors();
  const s = createStyles(colors);
  const user = useUserStore((state) => state.user);

  // Protección: solo admin y empleado pueden ver esta página
  if (user?.rol === 'cliente') {
    return <Redirect href="/home" />;
  }

  // Carga inicial de clientes
  // const cargar = useCallback(() => {
  //   const data = clientesService.getAllClientes();
  //   setList(data);
  // }, []);

    useFocusEffect(
        useCallback(() => {
           let isActive = true;
           const data = clientesService.getAllClientes();
           setList(data);
            return () => {
                isActive = false;
            };
        }, [])
    );

  // React.useEffect(() => {
  //   cargar();
  // }, [cargar]);

  return (
    <>
      <Stack.Screen options={{ title: "Clientes" }} />

      <View style={{ height: 18, backgroundColor: colors.backgroundMain}} />

      {/* Lista de clientes */}
      <View style={s.pantalla}>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ListaClienteItem item={item} />}
          contentContainerStyle={list.length === 0 ? s.listaVacia : s.contenido}
          ListEmptyComponent={
            <View style={s.estadoVacio}>
              <Text style={s.textoVacio}>No hay clientes aún</Text>
              <Text style={s.sugerencia}>Agrega tus primeros clientes</Text>
            </View>
          }
        />

        {/* Popup para crear nuevo cliente */}
        <PopUpCrear
          existingClientes={list}
          visible={visible}
          setVisible={setVisible}
          onSave={(nuevoCliente) => {
            // Guardamos en el servicio para que la pantalla [id] pueda encontrarlo
            clientesService.addCliente(nuevoCliente);
            // Actualizamos la lista y la UI
            setList((prev) => [...prev, nuevoCliente]);
          }}
        />
      </View>
    </>
  );
}

// ---- Tus estilos originales sin tocar ----
const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    pantalla: {
      backgroundColor: colors.backgroundMain,
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    contenido: {
      paddingBottom: 12,
    },
    texto: {
      fontSize: 12,
      color: colors.grayLabelText,
    },
    listaVacia: {
      flexGrow: 1,
    },
    estadoVacio: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    },
    textoVacio: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.grayLabelText,
    },
    sugerencia: {
      fontSize: 12,
      color: colors.grayPlaceholder,
    },
});
