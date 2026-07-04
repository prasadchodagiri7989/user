/**
 * Browser device fingerprinting utility.
 * Collects hardware/software signals and generates a SHA-256 hash as a stable deviceId.
 * No external services used.
 */

interface DeviceInfo {
  deviceId: string;
  browser: string;
  os: string;
}

/** Extract browser name from user agent */
function getBrowser(ua: string): string {
  if (/Edg\//.test(ua))     return "Edge";
  if (/Chrome\//.test(ua))  return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua))  return "Safari";
  if (/OPR\//.test(ua))     return "Opera";
  return "Unknown";
}

/** Extract OS from user agent */
function getOS(ua: string, platform: string): string {
  if (/Windows/.test(ua))  return "Windows";
  if (/Android/.test(ua))  return "Android";
  if (/iPhone|iPad/.test(ua)) return "iOS";
  if (/Mac/.test(ua))      return "macOS";
  if (/Linux/.test(ua))    return "Linux";
  if (/CrOS/.test(ua))     return "ChromeOS";
  return platform || "Unknown";
}

/** Generate a canvas fingerprint (stable per browser/device) */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("Cwm fjordbank glyphs vext quiz 😂", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Cwm fjordbank glyphs vext quiz 😂", 4, 17);
    return canvas.toDataURL();
  } catch {
    return "";
  }
}

/** Get WebGL vendor + renderer */
function getWebGL(): { vendor: string; renderer: string } {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) return { vendor: "", renderer: "" };
    const dbgInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!dbgInfo) return { vendor: "", renderer: "" };
    return {
      vendor:   gl.getParameter(dbgInfo.UNMASKED_VENDOR_WEBGL) as string  ?? "",
      renderer: gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL) as string ?? "",
    };
  } catch {
    return { vendor: "", renderer: "" };
  }
}

/** SHA-256 hash using Web Crypto API */
async function sha256(input: string): Promise<string> {
  const data    = new TextEncoder().encode(input);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  const bytes   = Array.from(new Uint8Array(hashBuf));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Collect device signals and generate a stable deviceId */
export async function getDeviceInfo(): Promise<DeviceInfo> {
  const nav = window.navigator;
  const ua  = nav.userAgent;

  const webgl    = getWebGL();
  const canvas   = getCanvasFingerprint();

  const signals = [
    ua,
    nav.platform      ?? "",
    nav.language      ?? "",
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    `${screen.width}x${screen.height}`,
    String(screen.colorDepth),
    String((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? ""),
    String(nav.hardwareConcurrency ?? ""),
    String("ontouchstart" in window),
    canvas,
    webgl.vendor,
    webgl.renderer,
  ].join("|");

  const deviceId = await sha256(signals);

  return {
    deviceId,
    browser: getBrowser(ua),
    os:      getOS(ua, nav.platform),
  };
}
