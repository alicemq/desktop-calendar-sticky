#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dirs_next::config_dir;
use serde::{Deserialize, Serialize};
use std::fs;
use std::str::FromStr;
use std::string::ToString;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize, WindowEvent};

// Structure to store window state
#[derive(Serialize, Deserialize, Clone, Default, Debug)]
struct WindowState {
    position: Option<(i32, i32)>,
    size: Option<(u32, u32)>,
    zoom: Option<f64>,
}

// Function to get the user-writable config path
fn get_config_path() -> PathBuf {
    let base_dir = config_dir().expect("Failed to get config directory");
    base_dir
        .join("com.desktop-calendar-sticky.app")
        .join("window_state.json") // Change this to your app's name
}

// Function to load the saved window state (including zoom)
fn get_saved_state() -> WindowState {
    let path = get_config_path();
    if let Ok(contents) = fs::read_to_string(&path) {
        if let Ok(state) = serde_json::from_str::<WindowState>(&contents) {
            return state;
        }
    }
    WindowState::default()
}

// Function to save window state (position, size, zoom level)
fn save_window_state(state: &WindowState) {
    let path = get_config_path();

    // Ensure the directory exists
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }

    if let Err(e) = fs::write(&path, serde_json::to_string(state).unwrap()) {
        eprintln!("Error saving window state: {}", e);
    }
}

fn main() {
    let state = Arc::new(Mutex::new(get_saved_state()));
    tauri::Builder::default()
        .setup(|app| {
            let app_handle: AppHandle = app.handle().clone();

            // Restore window state
            if let Some(window) = app_handle.get_webview_window("main") {
                let state = get_saved_state();

                if let Some((x, y)) = state.position {
                    let _ = window.set_position(PhysicalPosition::new(x, y));
                }

                if let Some((width, height)) = state.size {
                    let _ = window.set_size(PhysicalSize::new(width, height));
                }

                if let Some(zoom) = state.zoom {
                    // Log to check if zoom is correctly being applied
                    eprintln!("Restoring zoom: {}", zoom);
                    // Set the zoom on the window
                    let _ = window.eval(&format!("document.body.style.zoom = '{}%'", zoom));
                }
            } else {
                eprintln!("Main window not found.");
            }

            Ok(())
        })
        .on_window_event({
            let state = state.clone();
            move |app_handle, event| {
                let mut state = state.lock().unwrap();

                match event {
                    WindowEvent::Moved(position) => {
                        state.position = Some((position.x as i32, position.y as i32));
                    }
                    WindowEvent::Resized(size) => {
                        state.size = Some((size.width, size.height));
                    }
                    _ => {}
                }

                // Get the current zoom level from the frontend
                if let Some(window) = app_handle.get_webview_window("main") {
                    let _ = window.eval(r#"
                        window.__TAURI__.invoke('get_zoom').then(zoom => {
                            window.__TAURI__.invoke('set_zoom', { zoom: parseFloat(zoom) });
                        });
                    "#);
                }

                // Save the updated state
                save_window_state(&state);
            }
        })
        .invoke_handler(tauri::generate_handler![set_zoom, get_zoom]) // Register the zoom getter handler
        .plugin(prevent_default())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Tauri command to save the zoom level
#[tauri::command]
fn set_zoom(zoom: f64) {
    let mut state = get_saved_state();
    eprintln!("{:?}", state); // Debug log
    state.zoom = Some(zoom);
    eprintln!("Setting zoom level: {}", state.zoom.unwrap()); // Debug log
    save_window_state(&state); // Save the zoom level
    if let Some(saved_zoom) = get_saved_state().zoom {
        eprintln!("Saved state zoom level: {}", saved_zoom); // Debug log
    } else {
        eprintln!("Zoom level not found in saved state."); // Debug log
    }
}

// Tauri command to get the zoom level
#[tauri::command]
fn get_zoom() -> f64 {
    let state = get_saved_state();
    // eprintln!("{:?}", state); // Debug log
    let zoom_level = state.zoom.unwrap_or(100.0); // Default to 100 if not set
    eprintln!("Retrieved zoom level: {}", zoom_level); // Debug log
    zoom_level // Return the saved zoom level or default to 100
}

// Prevent default plugin (unchanged)
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
