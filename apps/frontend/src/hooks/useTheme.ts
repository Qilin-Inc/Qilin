// // src/hooks/useTheme.ts

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleTheme, setTheme } from "@/redux/features/themeSlice";
import { lightTheme, darkTheme } from "@/styles/theme";

export const useTheme = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      dispatch(setTheme(savedTheme === "dark"));
    }
  }, [dispatch]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    // Save theme preference to localStorage
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  return { isDark, theme, toggleTheme: handleToggleTheme };
};
//
//
//
//
//
//

// src/hooks/useTheme.ts

// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { toggleTheme } from "@/redux/features/themeSlice";
// import { lightTheme, darkTheme } from "@/styles/theme";

// export const useTheme = () => {
//   const dispatch = useDispatch();
//   const isDark = useSelector((state: RootState) => state.theme.isDark);
//   const theme = isDark ? darkTheme : lightTheme;

//   const handleToggleTheme = () => {
//     dispatch(toggleTheme());
//   };

//   return { isDark, theme, toggleTheme: handleToggleTheme };
// };
//
//
//
//
//
//
