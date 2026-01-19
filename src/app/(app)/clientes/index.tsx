import { Stack, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { Cliente } from "../../../data/Clientes";
import { clientesService } from "../../../services/clientesService";
import { PopUpCrear } from "../../../components/clientesPages/PopUpCrear";
import { listaClientes } from "../../../components/clientesPages/ListaClientes"; // tu render

export default function HomeClientes() {
  const [list, setList] = useState<Cliente[]>([]);
  const [visible, setVisible] = useState(false);

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

      <View style={{ height: 18 }} />

      {/* Lista de clientes */}
      <View style={s.pantalla}>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={listaClientes}
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
            // Actualizamos la lista y la UI
            setList((prev) => [...prev, nuevoCliente]);
          }}
        />
      </View>
    </>
  );
}

// ---- Tus estilos originales sin tocar ----
const s = StyleSheet.create({
  pantalla: {
    backgroundColor: "#f9fafb",
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contenido: {
    paddingBottom: 12,
  },
  texto: {
    fontSize: 12,
    color: "#6b7280",
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
    color: "#9ca3af",
  },
  sugerencia: {
    fontSize: 12,
    color: "#d1d5db",
  },
});
