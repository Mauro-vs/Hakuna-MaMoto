import { Stack, Redirect } from "expo-router";
import React from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Cliente } from "../../../data/Clientes";
import { PopUpCrear } from "../../../components/clientesPages/PopUpCrear";
import { ListaClienteItem } from "../../../components/clientesPages/ListaClientes"; // tu render
import { useThemeColors } from "../../../store/preferencesStore";
import { useUserStore } from "../../../store/userStore";
import { useClientesList, useCreateCliente } from "../../../hooks/useClientes";

export default function HomeClientes() {
  const [visible, setVisible] = React.useState(false);
  const colors = useThemeColors();
  const s = createStyles(colors);
  const user = useUserStore((state) => state.user);
  const { data, isLoading, isError } = useClientesList();
  const createCliente = useCreateCliente();
  const list: Cliente[] = data ?? [];

  // Protección: solo admin y empleado pueden ver esta página
  if (user?.rol === 'cliente') {
    return <Redirect href="/home" />;
  }

  if (isLoading) {
    return (
      <View style={[s.pantalla, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primaryButton} />
        <Text style={{ marginTop: 12, color: colors.grayLabelText }}>Cargando clientes...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[s.pantalla, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.errorText }}>Error cargando clientes</Text>
      </View>
    );
  }

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
          onSave={async (nuevoCliente) => {
            try {
              const creado = await createCliente.mutateAsync(nuevoCliente);
              return creado;
            } catch (error) {
              console.error(error);
              return null;
            }
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
