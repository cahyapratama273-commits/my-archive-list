/**
 * api-client.ts
 * Fetch wrapper yang otomatis menangani error HTTP dan memancarkan
 * custom event untuk ditampilkan oleh ApiAlert component.
 */

export interface ApiError {
  status: number;
  statusText: string;
  error?: string;
  detail?: string;
  code?: string;
}

/**
 * Emit custom event ke window agar ApiAlert bisa menangkap dan menampilkannya.
 */
export function emitApiAlert(payload: {
  type: "error" | "success" | "warning";
  status?: number;
  message: string;
  detail?: string;
}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("api-alert", { detail: payload })
  );
}

/**
 * apiFetch — wrapper fetch yang:
 * 1. Otomatis parse JSON response
 * 2. Throw ApiError dengan info status code jika response tidak ok
 * 3. Emit event ke ApiAlert component
 * 4. Menampilkan success alert jika diminta
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit & {
    /** Jika true, tampilkan success alert saat berhasil */
    showSuccess?: boolean;
    /** Pesan sukses kustom */
    successMessage?: string;
    /** Jika true, JANGAN tampilkan error alert (silent mode) */
    silent?: boolean;
  }
): Promise<T> {
  const { showSuccess, successMessage, silent, ...fetchOptions } = options ?? {};

  let res: Response;
  try {
    res = await fetch(url, fetchOptions);
  } catch (networkError: any) {
    if (!silent) {
      emitApiAlert({
        type: "error",
        message: "Tidak dapat terhubung ke server.",
        detail: networkError?.message,
      });
    }
    throw networkError;
  }

  // Parse body
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const apiError: ApiError = {
      status: res.status,
      statusText: res.statusText,
      error: data?.error ?? res.statusText,
      detail: data?.detail,
      code: data?.code,
    };

    if (!silent) {
      emitApiAlert({
        type: res.status >= 500 ? "error" : "warning",
        status: res.status,
        message: apiError.error || `HTTP ${res.status}`,
        detail: apiError.detail || apiError.code,
      });
    }

    throw apiError;
  }

  if (showSuccess) {
    emitApiAlert({
      type: "success",
      message: successMessage ?? "Berhasil disimpan.",
    });
  }

  return data as T;
}
