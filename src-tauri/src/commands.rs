use tauri::LogicalSize;
use tauri_plugin_shell::ShellExt;

const NORMAL_SIZE: (f64, f64) = (900.0, 650.0);
const COMPACT_SIZE: (f64, f64) = (300.0, 180.0);

#[tauri::command]
pub fn toggle_compact_window(window: tauri::Window, compact: bool) -> Result<(), String> {
    let (w, h) = if compact { COMPACT_SIZE } else { NORMAL_SIZE };
    window
        .set_size(LogicalSize::new(w, h))
        .map_err(|e| e.to_string())?;
    window
        .set_resizable(!compact)
        .map_err(|e| e.to_string())?;

    // These window chrome APIs only exist on desktop targets — iOS/Android
    // windows are always fullscreen/undecorated, so there's nothing to toggle.
    #[cfg(desktop)]
    {
        window
            .set_always_on_top(compact)
            .map_err(|e| e.to_string())?;
        window
            .set_decorations(!compact)
            .map_err(|e| e.to_string())?;
        window
            .set_skip_taskbar(compact)
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

// Default macOS `say` rate in words-per-minute (its own default when `-r` is
// omitted); used as the baseline that the `rate` speed multiplier scales.
const BASE_MACOS_WPM: f64 = 180.0;

// `tts_speak` awaits the OS process to exit (rather than fire-and-forget
// spawning) so callers — notably the Audio mode's auto-advance loop — can
// know exactly when speech finished and start their post-speech pause timer.
#[tauri::command]
pub async fn tts_speak(app: tauri::AppHandle, text: String, rate: Option<f64>) -> Result<(), String> {
    let speed = rate.unwrap_or(1.0);

    #[cfg(target_os = "macos")]
    {
        let wpm = ((BASE_MACOS_WPM * speed).round() as i64).clamp(80, 400);
        app.shell()
            .command("say")
            .args(["-v", "Kyoko", "-r", &wpm.to_string(), &text])
            .output()
            .await
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "windows")]
    {
        let escaped = text.replace('\'', "''");
        // System.Speech's Rate property runs -10 (slowest) to 10 (fastest);
        // 0 is its default, matching a 1.0x speed multiplier.
        let ps_rate = (((speed - 1.0) * 10.0).round() as i64).clamp(-10, 10);
        let ps_script = format!(
            "Add-Type -AssemblyName System.Speech; \
             $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; \
             $s.Rate = {}; \
             $s.Speak('{}')",
            ps_rate, escaped
        );
        app.shell()
            .command("powershell")
            .args(["-NoProfile", "-Command", &ps_script])
            .output()
            .await
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
