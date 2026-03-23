const CATBOX_API_URL = "https://catbox.moe/user/api.php";
const CATBOX_MAX_SIZE = 200 * 1024 * 1024; // 200MB

export interface UploadResult {
  success: true;
  url: string;
  filename: string;
}

export interface UploadError {
  success: false;
  error: string;
}

export async function uploadToCatbox(
  fileData: Buffer | ArrayBuffer,
  filename: string,
  mimeType: string
): Promise<UploadResult | UploadError> {
  try {
    const size = fileData instanceof Buffer ? fileData.length : fileData.byteLength;
    
    if (size > CATBOX_MAX_SIZE) {
      return {
        success: false,
        error: `File too large. Maximum size is ${CATBOX_MAX_SIZE / (1024 * 1024)}MB`,
      };
    }

    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    
    let uint8Array: Uint8Array;
    if (fileData instanceof Buffer) {
      uint8Array = new Uint8Array(fileData);
    } else {
      uint8Array = new Uint8Array(fileData);
    }
    const blob = new Blob([uint8Array as BlobPart], { type: mimeType });
    formData.append("fileToUpload", blob, filename);

    const response = await fetch(CATBOX_API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Upload failed with status ${response.status}`,
      };
    }

    const url = await response.text();

    if (!url.startsWith("https://")) {
      return {
        success: false,
        error: url || "Upload failed",
      };
    }

    return {
      success: true,
      url,
      filename,
    };
  } catch (error) {
    console.error("Catbox upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

export function isAudioFile(mimeType: string): boolean {
  return mimeType.startsWith("audio/");
}

export function getFileIcon(mimeType: string): string {
  if (isImageFile(mimeType)) return "image";
  if (isVideoFile(mimeType)) return "video";
  if (isAudioFile(mimeType)) return "music";
  return "file";
}
