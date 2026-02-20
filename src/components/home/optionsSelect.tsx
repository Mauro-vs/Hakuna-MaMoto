import React, { useMemo } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColors } from "../../store/preferencesStore";
import { useAuth } from "../../context/AuthContext";

export function OptionsSelect() {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);
	const router = useRouter();
	const { logout } = useAuth();

	const actions = [
		{
			key: "edit-profile",
			icon: "create-outline" as const,
			title: "Editar perfil",
			desc: "Actualiza tus datos y avatar",
			onPress: () => router.push("/profile/edit-profile"),
			iconBg: colors.primaryButton,
		},
		{
			key: "preferences",
			icon: "options-outline" as const,
			title: "Preferencias",
			desc: "Tema, idioma y configuración",
			onPress: () => router.push("/preferences"),
			iconBg: "#8B5CF6",
		},
		{
			key: "logout",
			icon: "log-out-outline" as const,
			title: "Cerrar sesión",
			desc: "Salir de la cuenta actual",
			onPress: async () => {
				try {
					await logout();
					router.replace("/(login)/Login");
				} catch (error) {
					console.error(error);
					Alert.alert("Error", "No se pudo cerrar sesión");
				}
			},
			iconBg: "#EF4444",
		},
	];

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Opciones principales</Text>

			{actions.map((action) => (
				<Pressable
					key={action.key}
					style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
					onPress={action.onPress}
				>
					<View style={[styles.menuItemIcon, { backgroundColor: action.iconBg }]}>
						<Ionicons name={action.icon} size={24} color="#fff" />
					</View>
					<View style={styles.menuItemContent}>
						<Text style={styles.menuItemTitle}>{action.title}</Text>
						<Text style={styles.menuItemDesc}>{action.desc}</Text>
					</View>
					<Ionicons name="chevron-forward" size={20} color={colors.grayPlaceholder} />
				</Pressable>
			))}
		</View>
	);
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
	StyleSheet.create({
		section: {
			marginBottom: 24,
		},
		sectionTitle: {
			fontSize: 14,
			fontWeight: "700",
			color: colors.grayPlaceholder,
			marginBottom: 12,
			textTransform: "uppercase",
			letterSpacing: 0.5,
		},
		menuItem: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: colors.backgroundCard,
			borderRadius: 12,
			paddingHorizontal: 14,
			paddingVertical: 14,
			marginBottom: 10,
			borderWidth: 1,
			borderColor: colors.borderMain,
			shadowColor: "#000",
			shadowOpacity: 0.05,
			shadowOffset: { width: 0, height: 1 },
			shadowRadius: 3,
			elevation: 1,
		},
		menuItemPressed: {
			backgroundColor: colors.tabBackground,
			opacity: 0.9,
		},
		menuItemIcon: {
			width: 48,
			height: 48,
			borderRadius: 12,
			justifyContent: "center",
			alignItems: "center",
			marginRight: 12,
		},
		menuItemContent: {
			flex: 1,
		},
		menuItemTitle: {
			fontSize: 16,
			fontWeight: "700",
			color: colors.textTitle,
			marginBottom: 2,
		},
		menuItemDesc: {
			fontSize: 12,
			color: colors.textBody,
		},
	});
