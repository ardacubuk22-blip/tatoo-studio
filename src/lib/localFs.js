/* ------------------------------------------------------------
   Thin wrapper around the File System Access API.

   The admin panel writes straight onto the project's own disk —
   no server, no upload endpoint. The site owner grants access to
   the project folder once per session; every save after that is
   a direct file write that Vite's dev server picks up like any
   other change on disk.

   Chromium only (Chrome/Edge). Not available in production
   browsers in general, which is fine — this tool is for the one
   person running it locally against their own checkout.
   ------------------------------------------------------------ */

export function isSupported() {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window
}

export async function pickProjectRoot() {
  const handle = await window.showDirectoryPicker({ id: 'tattoo-archive-admin' })
  // Sanity check: this should be the folder that contains package.json + src.
  try {
    await handle.getFileHandle('package.json')
    await handle.getDirectoryHandle('src')
  } catch {
    throw new Error(
      'Bu klasör proje ana klasörüne benzemiyor (package.json / src bulunamadı). ' +
        'Lütfen "tatoo" klasörünü seç.',
    )
  }
  return handle
}

/** Descend through nested directories, creating them if needed. */
async function getSubdir(rootHandle, parts, { create = false } = {}) {
  let dir = rootHandle
  for (const part of parts) {
    dir = await dir.getDirectoryHandle(part, { create })
  }
  return dir
}

/** Write a File/Blob into src/assets/<...parts>/<filename>. */
export async function writeAssetFile(rootHandle, parts, filename, fileOrBlob) {
  const dir = await getSubdir(rootHandle, ['src', 'assets', ...parts], { create: true })
  const fileHandle = await dir.getFileHandle(filename, { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(fileOrBlob)
  await writable.close()
}

/** Overwrite src/data/<name>.json with a JS value (pretty-printed). */
export async function writeDataJson(rootHandle, name, value) {
  const dir = await getSubdir(rootHandle, ['src', 'data'], { create: false })
  const fileHandle = await dir.getFileHandle(`${name}.json`, { create: false })
  const writable = await fileHandle.createWritable()
  await writable.write(JSON.stringify(value, null, 2) + '\n')
  await writable.close()
}
