import { useEffect, useMemo } from "react";
import { ThemeOption, usePreferencesStore } from "../store/preferencesStore";

export const usePreferencesScreen = () => {
  const { tema, setTema, cargarTema } = usePreferencesStore();

  useEffect(() => {
    cargarTema();
  }, [cargarTema]);

  const themeOptions: {
    value: ThemeOption;
    label: string;
    icon: string;
    description: string;
  }[] = useMemo(
    () => [
      {
        value: "light",
        label: "Claro",
        icon: "○",
        description: "Modo claro para el día",
      },
      {
        value: "dark",
        label: "Oscuro",
        icon: "●",
        description: "Modo oscuro para la noche",
      },
    ],
    [],
  );

  return {
    tema,
    setTema,
    themeOptions,
  };
};
