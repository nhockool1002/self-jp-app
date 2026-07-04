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

#[tauri::command]
pub async fn tts_speak(app: tauri::AppHandle, text: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        app.shell()
            .command("say")
            .args(["-v", "Kyoko", &text])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "windows")]
    {
        let escaped = text.replace('\'', "''");
        let ps_script = format!(
            "Add-Type -AssemblyName System.Speech; \
             $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; \
             $s.Speak('{}')",
            escaped
        );
        app.shell()
            .command("powershell")
            .args(["-NoProfile", "-Command", &ps_script])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
