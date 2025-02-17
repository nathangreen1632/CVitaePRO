export function formatResponse<T>(data: T, message = "Success") {
  return { success: true, message, data };
}
