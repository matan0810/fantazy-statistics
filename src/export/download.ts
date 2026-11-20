/** Saves a file through a temporary link: works on every browser, desktop and phone. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function fileName(title: string, extension: string): string {
  const base = title
    .replace(/[\\/:*?"<>|„”]+/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 80);
  return `${base}.${extension}`;
}

/** Whether this browser can hand a file to the system share sheet (phones). */
export function canShareFiles(): boolean {
  try {
    const probe = new File([''], 'x.png', { type: 'image/png' });
    return typeof navigator.canShare === 'function' && navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/** Opens the share sheet. False when sharing failed (not when the user cancelled it). */
export async function shareFile(blob: Blob, filename: string, title: string): Promise<boolean> {
  try {
    await navigator.share({ files: [new File([blob], filename, { type: blob.type })], title });
    return true;
  } catch (error) {
    return error instanceof DOMException && error.name === 'AbortError';
  }
}
