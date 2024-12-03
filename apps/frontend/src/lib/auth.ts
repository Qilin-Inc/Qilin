// src/lib/auth.ts

// interface AuthData {
//   email: string;
//   role: "super_admin" | "staff_admin";
// }
//

export interface AuthData {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "staff_admin";
}

export const setAuth = (data: AuthData) => {
  localStorage.setItem("adminAuth", JSON.stringify(data));
};

export const getAuth = (): AuthData | null => {
  const auth = localStorage.getItem("adminAuth");
  return auth ? JSON.parse(auth) : null;
};

export const clearAuth = () => {
  localStorage.removeItem("adminAuth");
};

export const isAuthenticated = () => {
  return !!getAuth();
};
