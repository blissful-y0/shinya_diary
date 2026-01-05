/* =============================================
   Utils 모듈 통합 export
   - 모든 유틸리티 함수를 한 곳에서 import 가능
   ============================================= */

// Date utilities
export {
  formatDateKorean,
  formatDateISO,
  formatDistanceToNow,
  isSameDay,
  isToday,
  getTodayKST,
  toKSTDateString,
} from "./date";

// Image utilities
export {
  convertToWebP,
  generateWebPFilename,
  isValidImageFile,
  formatFileSize,
  resizeAndConvertToWebP,
  type ConversionOptions,
} from "./image";

// Storage utilities
export {
  uploadImage,
  uploadDiaryImage,
  uploadAvatar,
  uploadGroupImage,
  type UploadResult,
  type UploadProgress,
} from "./storage";

// shadcn/ui utilities (re-export from parent)
export { cn } from "../utils";
