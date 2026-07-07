const APP_VERSION = "0.1.4";

export function AboutMode({ compact }: { compact: boolean }) {
  if (compact) {
    return <div className="mode-compact">Self JP App v{APP_VERSION}</div>;
  }

  return (
    <div className="mode-page">
      <div className="mode-stage">
        <div className="about-card">
          <div className="about-title">Self JP App</div>
          <div className="about-version">Phiên bản {APP_VERSION}</div>
          <p className="about-desc">
            Ứng dụng học tiếng Nhật hằng ngày dành cho người Việt: luyện Hiragana/Katakana, học Kanji theo
            cấp độ N5–N1, từ vựng và ngữ pháp theo giáo trình Minna no Nihongo.
          </p>

          <div className="about-row">
            <strong>Tác giả:</strong> Nhut Nguyen
          </div>
          <div className="about-row">
            <strong>Công nghệ:</strong> Tauri v2, React, TypeScript
          </div>
          <div className="about-row">
            <strong>Bản quyền:</strong> © 2026 NhutNguyen
          </div>

          <p className="about-note">
            Dữ liệu học tập được tổng hợp và biên dịch từ nhiều nguồn mở (KanjiVG, kanji-data, MinnaNoDS,
            KanjiDictVN...) — xem chi tiết trong README của dự án.
          </p>
        </div>
      </div>
    </div>
  );
}
