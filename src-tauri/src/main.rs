// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// fn main() {
//     desktop_calendar_sticky_lib::run()
// }

fn main() {
    tauri::Builder::default()
      .plugin(prevent_default())
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
  }
  
  #[cfg(debug_assertions)]
  fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    use tauri_plugin_prevent_default::Flags;
  
    tauri_plugin_prevent_default::Builder::new()
      .with_flags(Flags::all().difference(Flags::DEV_TOOLS | Flags::RELOAD))
      .build()
  }
  
  #[cfg(not(debug_assertions))]
  fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    tauri_plugin_prevent_default::Builder::new().build()
  }