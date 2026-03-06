import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { AuthProvider, useAuth } from "../context/AuthContext";
import DrawerContent from "../components/Sidebar/DrawerContent";

// ── Route Guard ──────────────────────────────────────────────────────────────
// Sits inside AuthProvider so it can safely call useAuth()
function RouteGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // wait for session restore

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Not logged in — redirect to login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Already logged in — go to main app
      router.replace("/(tabs)/");
    }
  }, [isAuthenticated, isLoading, segments]);

  return null;
}

// ── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard />
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: "slide",
          drawerStyle: { width: "78%" },
          overlayColor: "rgba(0,0,0,0.5)",
          swipeEdgeWidth: 80,
        }}
      >
        {/* Hide the drawer entry for these route groups */}
        <Drawer.Screen
          name="(tabs)"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="(auth)"
          options={{
            drawerItemStyle: { display: "none" },
            swipeEnabled: false,
          }}
        />
        <Drawer.Screen
          name="(main)"
          options={{ drawerItemStyle: { display: "none" } }}
        />
      </Drawer>
    </AuthProvider>
  );
}
