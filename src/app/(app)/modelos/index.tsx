import React, { useMemo } from "react";
import { View, FlatList, Text, ActivityIndicator, Modal, TextInput, TouchableOpacity, Pressable, ScrollView, KeyboardAvoidingView, Image } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../../store/preferencesStore";
import { ModeloCard } from "../../../components/modelosPages/ModeloCard";
import { createModelosStyles } from "../../../style/modelos.styles";
import { useModelosScreen } from "../../../useControllers/useModelosScreen";

export default function ModelosScreen() {
  const colors = useThemeColors();
  const s = useMemo(() => createModelosStyles(colors), [colors]);
  const {
    list,
    filteredList,
    isLoading,
    isError,
    isAdmin,
    modalVisible,
    editingModelo,
    isSaving,
    isUploadingImage,
    form,
    setForm,
    search,
    setSearch,
    ccFilter,
    setCcFilter,
    openCreate,
    openEdit,
    handleSave,
    openImageOptions,
    handleDelete,
    buildImagePreviewUrl,
    setModalVisible,
  } = useModelosScreen();

  if (isLoading) {
    return (
      <View style={[s.screen, s.center]}>
        <ActivityIndicator size="large" color={colors.primaryButton} />
        <Text style={s.statusText}>Cargando modelos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.errorText}>Error cargando modelos</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Modelos" }} />
      <View style={s.screen}>
        <View style={s.searchSection}>
          <View style={s.searchInputWrapper}>
            <Ionicons
              name="search-outline"
              size={18}
              color={colors.grayPlaceholder}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por modelo, marca, cc..."
              placeholderTextColor={colors.grayPlaceholder}
              style={s.searchInput}
            />
          </View>

          <View style={s.filtersRow}>
            {([
              { id: "ALL", label: "Todos" },
              { id: "LOW", label: "< 300cc" },
              { id: "MID", label: "300-600cc" },
              { id: "HIGH", label: "> 600cc" },
            ] as const).map((f) => {
              const isActive = ccFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    s.filterChip,
                    isActive && s.filterChipActive,
                  ]}
                  onPress={() => setCcFilter(f.id)}
                >
                  <Text
                    style={[
                      s.filterChipText,
                      isActive && s.filterChipTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ModeloCard item={item} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />
          )}
          contentContainerStyle={
            filteredList.length === 0 ? s.listEmpty : s.listContent
          }
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Text style={s.emptyTitle}>No hay modelos disponibles</Text>
              <Text style={s.emptyDesc}>
                {isAdmin
                  ? "Agrega modelos para que los clientes puedan reservar"
                  : "Contacta con un administrador para agregar modelos"}
              </Text>
            </View>
          }
        />

        {isAdmin ? (
          <TouchableOpacity style={s.fab} onPress={openCreate}>
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        ) : null}
      </View>

      <Modal transparent animationType="fade" visible={modalVisible}>
        <KeyboardAvoidingView behavior="padding" style={s.modalWrapper}>
          <Pressable
            style={s.modalBackdrop}
            onPress={() => {
              if (!isSaving && !isUploadingImage) {
                setModalVisible(false);
              }
            }}
          />

          <View style={s.modalCard}>
            <Text style={s.modalTitle}>
              {editingModelo ? "Editar modelo" : "Nuevo modelo"}
            </Text>

            <ScrollView
              style={{ maxHeight: 420 }}
              contentContainerStyle={s.modalContent}
              keyboardShouldPersistTaps="handled"
            >
              <View>
                <Text style={s.label}>Marca y modelo</Text>
                <TextInput
                  value={form.marcaModelo}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, marcaModelo: text }))
                  }
                  placeholder="Honda CB500X"
                  style={s.input}
                />
              </View>

              <View>
                <Text style={s.label}>Descripción</Text>
                <TextInput
                  value={form.descripcion}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, descripcion: text }))
                  }
                  placeholder="Detalles del modelo, tipo de uso, etc."
                  style={[s.input, s.inputMultiline]}
                  multiline
                />
              </View>

              <View>
                <Text style={s.label}>Cilindrada (cc)</Text>
                <TextInput
                  value={form.cilindrada}
                  onChangeText={(text) => {
                    const numeric = text.replace(/[^0-9]/g, "");
                    setForm((prev) => ({ ...prev, cilindrada: numeric }));
                  }}
                  placeholder="500"
                  keyboardType="numeric"
                  style={s.input}
                />
              </View>

              <View>
                <Text style={s.label}>Precio por día (€)</Text>
                <TextInput
                  value={form.precioDia}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, precioDia: text }))
                  }
                  placeholder="50"
                  keyboardType="numeric"
                  style={s.input}
                />
              </View>

              <View>
                <Text style={s.label}>Imagen</Text>

                {form.imagenUrl ? (
                  <View style={s.imagePreviewWrap}>
                    <Image
                      source={{ uri: buildImagePreviewUrl(form.imagenUrl) }}
                      style={s.imagePreview}
                    />
                  </View>
                ) : null}

                <View style={s.imageActionsRow}>
                  <Pressable
                    style={[
                      s.imageButton,
                      (isUploadingImage || isSaving) && s.imageButtonDisabled,
                    ]}
                    onPress={openImageOptions}
                    disabled={isUploadingImage || isSaving}
                  >
                    <Text style={s.imageButtonText}>
                      {isUploadingImage ? "Subiendo imagen..." : "Elegir imagen"}
                    </Text>
                  </Pressable>

                  {form.imagenUrl ? (
                    <Pressable
                      style={s.imageClearButton}
                      onPress={() =>
                        setForm((prev) => ({ ...prev, imagenUrl: "" }))
                      }
                    >
                      <Text style={s.imageClearText}>Quitar</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </ScrollView>

            <View style={s.modalActions}>
              <Pressable
                style={s.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={isSaving}
              >
                <Text style={s.cancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[
                  s.saveButton,
                  (isSaving || isUploadingImage) && s.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={isSaving || isUploadingImage}
              >
                <Text style={s.saveText}>
                  {isSaving
                    ? "Guardando..."
                    : editingModelo
                      ? "Guardar cambios"
                      : "Crear modelo"}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
