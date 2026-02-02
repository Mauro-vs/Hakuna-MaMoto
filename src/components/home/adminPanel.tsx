import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../store/preferencesStore";
import { UserRole } from "../../types/types";

interface AdminPanelProps {
	rol?: UserRole | null;
}

export function AdminPanel({ rol }: AdminPanelProps) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	if (!rol) return null;

	const config: Record<UserRole, { title: string; icon: any; desc: string }> = {
		ADMIN: {
			title: "Panel de administración",
			icon: "shield-checkmark",
			desc: "Tienes acceso a todas las funciones del sistema, incluyendo gestión de usuarios y configuración avanzada.",
		},
		MECANICO: {
			title: "Área de trabajo",
			icon: "briefcase",
			desc: "Puedes ver y gestionar clientes, pedidos y realizar seguimiento de operaciones.",
		},
		NORMAL: {
			title: "Tu espacio",
			icon: "heart",
			desc: "Accede a tu perfil y personaliza tus preferencias de aplicación.",
		},
	};

	const current = config[rol];
	if (!current) return null;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{current.title}</Text>
			<View style={styles.infoCard}>
				<Ionicons
					name={current.icon}
					size={32}
					color={colors.primaryButton}
					style={{ marginBottom: 12 }}
				/>
				<Text style={styles.infoCardTitle}>{current.title}</Text>
				<Text style={styles.infoCardDesc}>{current.desc}</Text>
			</View>
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
		infoCard: {
			backgroundColor: colors.backgroundCard,
			borderRadius: 14,
			padding: 18,
			alignItems: "center",
			borderWidth: 1,
			borderColor: colors.borderMain,
		},
		infoCardTitle: {
			fontSize: 16,
			fontWeight: "700",
			color: colors.textTitle,
			marginBottom: 8,
		},
		infoCardDesc: {
			fontSize: 13,
			color: colors.textBody,
			textAlign: "center",
			lineHeight: 19,
		},
	});
