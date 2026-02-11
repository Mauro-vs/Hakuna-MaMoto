import { User } from "@supabase/supabase-js";
import { AuthUser, UserRole } from "../types/types";
import { supabase } from "./supabaseClient";

const mapRoleNameToUserRole = (roleName?: string): UserRole => {
  switch (roleName?.toUpperCase()) {
    case "ADMIN":
      return "ADMIN";
    case "MECANICO":
      return "MECANICO";
    case "NORMAL":
      return "NORMAL";
    default:
      return "NORMAL";
  }
};

const mapSupabaseUser = (user: User): AuthUser => {
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const nombre =
    (metadata.nombre as string | undefined) ||
    (metadata.full_name as string | undefined) ||
    (metadata.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Usuario";
  const rol = (metadata.rol as UserRole | undefined) ?? "NORMAL";
  const avatarUrl =
    (metadata.avatar_url as string | undefined) ||
    (metadata.avatarUrl as string | undefined);

  return {
    id: user.id,
    email: user.email ?? "",
    nombre,
    rol,
    avatarUrl,
  };
};

const enrichWithAppUser = async (authUser: AuthUser): Promise<AuthUser> => {
  if (!authUser.email) return authUser;

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("nombre, email, rol, avatar_url")
      .ilike("email", authUser.email)
      .maybeSingle();

    if (error || !data) return authUser;

    const roleName = data.rol as string | undefined;

    return {
      ...authUser,
      nombre: data.nombre ?? authUser.nombre,
      rol: roleName ? mapRoleNameToUserRole(roleName) : authUser.rol,
      avatarUrl: data.avatar_url ?? authUser.avatarUrl,
    };
  } catch {
    return authUser;
  }
};

export async function loginService(
  email: string,
  password: string,
): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message || "Email o contraseña incorrectos");
  }

  const baseUser = mapSupabaseUser(data.user);
  return enrichWithAppUser(baseUser);
}

export interface RegisterResult {
  user: AuthUser;
  needsEmailConfirmation: boolean;
}

export async function registerService(
  email: string,
  password: string,
  nombre: string,
): Promise<RegisterResult> {
  const trimmedNombre = nombre.trim();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre: trimmedNombre,
        name: trimmedNombre,
        full_name: trimmedNombre,
        rol: "NORMAL",
      },
    },
  });

  if (error || !data.user) {
    throw new Error(error?.message || "No se ha podido completar el registro");
  }

  const baseUser = mapSupabaseUser(data.user);
  const enrichedUser = await enrichWithAppUser(baseUser);

  return {
    user: enrichedUser,
    needsEmailConfirmation: !data.session,
  };
}

export async function logoutService(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const baseUser = mapSupabaseUser(data.user);
  return enrichWithAppUser(baseUser);
}

export function onAuthStateChange(handler: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      const baseUser = mapSupabaseUser(session.user);
      void enrichWithAppUser(baseUser)
        .then(handler)
        .catch(() => handler(baseUser));
      return;
    }
    handler(null);
  });
}
