export function SplashScreen({ fadingOut }: { fadingOut: boolean }) {
  return (
    <div className={fadingOut ? "splash-screen splash-screen-fade" : "splash-screen"}>
      <img className="splash-logo" src="/app-icon.png" alt="Self JP App" />
      <div className="splash-title">Self JP App</div>
      <div className="splash-subtitle">Học tiếng Nhật mỗi ngày</div>
      <div className="splash-spinner" />
    </div>
  );
}
