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

/**
 * A file name from a title: no path separators, no characters a system forbids, no control
 * or direction marks (which can disguise an extension), not starting with a dot.
 */
export function fileName(title: string, extension: string): string {
  const base = title
    // eslint-disable-next-line no-control-regex
    .replace(/[\\/:*?"<>|„”\u0000-\u001f\u007f\u200e\u200f\u202a-\u202e\u2066-\u2069]+/g, '')
    .replace(/\s+/g, '_')
    .replace(/^[._]+/, '')
    .slice(0, 80);
  return `${base || 'file'}.${extension}`;
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
