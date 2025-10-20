import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import {
  Home,
  Users,
  Settings,
  Shield,
  AlertCircle,
  LogOut,
  User,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  BarChart3,
  Zap,
} from "lucide-react";
import { Badge } from "./ui/Badge";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Dark mode toggle handler
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Modern menu items
  const mainMenuItems = [
    {
      name: "Ana Sayfa",
      icon: Home,
      path: "/dashboard",
      badge: null as string | null,
    },
    { name: "Trafik", icon: Zap, path: "/trafik", badge: null },
    { name: "Kasko", icon: Shield, path: "/kasko", badge: null },
    { name: "Konut", icon: Home, path: "/konut", badge: null },
    { name: "Sağlık", icon: User, path: "/saglik", badge: null },
    { name: "Fiyatlar", icon: BarChart3, path: "/fiyatlar", badge: null },
  ];

  const adminMenuItems = [
    { name: "Kullanıcılar", icon: Users, path: "/admin/users", badge: "6" },
    { name: "Şirketler", icon: Shield, path: "/admin/companies", badge: "8" },
    { name: "Raporlar", icon: BarChart3, path: "/admin/reports", badge: null },
    { name: "Ayarlar", icon: Settings, path: "/admin/settings", badge: null },
    { name: "Loglar", icon: AlertCircle, path: "/admin/logs", badge: "New" },
  ];

  // Dinamik notifications - gerçek verilerden oluştur
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Bildirimleri gerçek verilerden oluştur
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Son poliçeleri çek
        const response = await fetch("/api/policies");
        if (response.ok) {
          const data = await response.json();
          const recentPolicies = data.policies?.slice(0, 5) || [];

          // Poliçelerden bildirimler oluştur
          const policyNotifications = recentPolicies.map(
            (policy: any, index: number) => ({
              id: `policy-${policy.id}`,
              title: "Yeni Poliçe Kesildi",
              message: `${policy.policyType.toUpperCase()} poliçesi ${
                policy.company
              } tarafından kesildi`,
              time: new Date(policy.createdAt).toLocaleString("tr-TR"),
              unread: index < 2, // İlk 2 tanesi okunmamış
              type: "policy",
              policyId: policy.id,
            })
          );

          // Sistem bildirimleri ekle
          const systemNotifications = [
            {
              id: "system-1",
              title: "Sistem Durumu",
              message: "Tüm sistemler normal çalışıyor",
              time: "5 dakika önce",
              unread: false,
              type: "system",
            },
            {
              id: "system-2",
              title: "Günlük Rapor",
              message: "Günlük rapor hazır",
              time: "1 saat önce",
              unread: true,
              type: "report",
            },
          ];

          const allNotifications = [
            ...policyNotifications,
            ...systemNotifications,
          ];
          setNotifications(allNotifications);
          setUnreadCount(allNotifications.filter((n) => n.unread).length);
        }
      } catch (error) {
        console.error("Bildirimler alınırken hata:", error);
        // Fallback notifications
        setNotifications([
          {
            id: "1",
            title: "Sistem Hazır",
            message: "Sigorta sistemi aktif",
            time: "Şimdi",
            unread: false,
          },
        ]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();

    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => logout();

  const getPageTitle = () => {
    const pathMap: Record<string, string> = {
      "/dashboard": "Ana Sayfa",
      "/admin/users": "Kullanıcı Yönetimi",
      "/admin/companies": "Şirket Yönetimi",
      "/admin/settings": "Sistem Ayarları",
      "/admin/logs": "Sistem Logları",
      "/admin/reports": "Raporlar",
      "/trafik": "Trafik Sigortası",
      "/kasko": "Kasko Sigortası",
      "/konut": "Konut Sigortası",
      "/saglik": "Sağlık Sigortası",
      "/tamamlayici": "Tamamlayıcı Sağlık",
      "/imm": "İMM Sigortası",
      "/fiyatlar": "Teklif Karşılaştırma",
    };
    return pathMap[router.pathname] || "EESİGORTA";
  };

  return (
    <div className={`flex min-h-screen bg-background`}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-modern-md">
              <Shield className="text-primary-foreground" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-card-foreground tracking-tight">
                EESİGORTA
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                v3.0 Pro
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-accent rounded-xl transition-all duration-200"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Mobile Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary shadow-modern-sm"
                    : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-semibold">{item.name}</span>
              </button>
            );
          })}

          {user?.role === "admin" && (
            <div className="mt-8">
              <p className="text-xs font-bold text-muted-foreground uppercase px-4 mb-3 tracking-wider">
                Yönetim
              </p>
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const active = router.pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary shadow-modern-sm"
                        : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-semibold">{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant={item.badge === "New" ? "success" : "info"}
                        className="ml-auto text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-72"
        } shadow-modern-lg`}
      >
        {/* Logo + Collapse */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-modern-md">
                <Shield className="text-primary-foreground" size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground tracking-tight">
                  EESİGORTA
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  v3.0 Pro
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-accent rounded-xl transition-all duration-200 hover:scale-105"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={20} className="text-muted-foreground" />
            ) : (
              <ChevronLeft size={20} className="text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Modern Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.path;
            return (
              <div key={item.name} className="relative">
                <button
                  onClick={() => router.push(item.path)}
                  className={`group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-primary/10 text-primary shadow-modern-sm"
                      : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`${
                      sidebarCollapsed
                        ? "transition-transform duration-200 group-hover:scale-110"
                        : ""
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-semibold">{item.name}</span>
                  )}
                </button>

                {/* Tooltip for collapsed sidebar */}
                {sidebarCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}

          {user?.role === "admin" && (
            <div className="mt-8">
              {!sidebarCollapsed && (
                <p className="text-xs font-bold text-muted-foreground uppercase px-4 mb-3 tracking-wider">
                  Yönetim
                </p>
              )}
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const active = router.pathname === item.path;
                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={() => router.push(item.path)}
                      className={`group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                        active
                          ? "bg-primary/10 text-primary shadow-modern-sm"
                          : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`${
                          sidebarCollapsed
                            ? "transition-transform duration-200 group-hover:scale-110"
                            : ""
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <>
                          <span className="text-sm font-semibold">
                            {item.name}
                          </span>
                          {item.badge && (
                            <Badge
                              variant={
                                item.badge === "New" ? "success" : "info"
                              }
                              className="ml-auto text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </button>

                    {/* Tooltip for collapsed sidebar */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                        {item.badge && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-500 text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Modern Top Navbar */}
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-8 md:px-10 shadow-modern-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-accent transition-all duration-200"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} className="text-card-foreground" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-card-foreground tracking-tight">
                {getPageTitle()}
              </h2>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {new Date().toLocaleDateString("tr-TR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-accent rounded-xl transition-all duration-200 hover:scale-105 relative group"
              >
                <Bell
                  size={20}
                  className="text-card-foreground group-hover:text-primary transition-colors duration-200"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50">
                  <div className="p-4 border-b border-border">
                    <h3 className="text-lg font-semibold text-card-foreground">
                      Bildirimler
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {unreadCount} okunmamış bildirim
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-border last:border-b-0 hover:bg-accent transition-colors duration-200 ${
                          notification.unread ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notification.unread
                                ? "bg-primary"
                                : "bg-muted-foreground"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-card-foreground">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border">
                    <button
                      onClick={() => router.push("/admin/user-operations")}
                      className="w-full text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      Tüm bildirimleri görüntüle
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-accent rounded-xl transition-all duration-200 hover:scale-105"
            >
              {darkMode ? (
                <Sun size={20} className="text-card-foreground" />
              ) : (
                <Moon size={20} className="text-card-foreground" />
              )}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-2 hover:bg-accent rounded-xl transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                  {user?.fullName ? (
                    <span className="text-primary-foreground text-sm font-bold">
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  ) : (
                    <User size={16} className="text-primary-foreground" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-card-foreground">
                    {user?.fullName || user?.username}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role}
                  </p>
                </div>
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-background px-6 md:px-8 lg:px-10 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
export const Layout = ProfessionalLayout;
