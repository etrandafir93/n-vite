package tech.nvite.host;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tech.nvite.infra.storage.GoogleCloudStorage;

@RestController
@RequestMapping("api/upload")
@RequiredArgsConstructor
class ImageUploadV2 {

  private final GoogleCloudStorage storage;

  public record ImageUploadResponse(String url) {}

  @PostMapping("/image")
  public ImageUploadResponse uploadImage(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
      throw new IllegalArgumentException("File is empty");
    }

    // Validate file type - only allow PNG, JPG, JPEG, BMP
    String contentType = file.getContentType();
    if (contentType == null || !isValidImageType(contentType)) {
      throw new IllegalArgumentException("File must be a PNG, JPG, JPEG, or BMP image");
    }

    // Validate file size (max 10MB)
    long maxSize = 10 * 1024 * 1024; // 10MB
    if (file.getSize() > maxSize) {
      throw new IllegalArgumentException("File size must be less than 10MB");
    }

    String url = storage.uploadFile(file);
    return new ImageUploadResponse(url);
  }

  private boolean isValidImageType(String contentType) {
    return contentType.equals("image/png")
        || contentType.equals("image/jpeg")
        || contentType.equals("image/jpg")
        || contentType.equals("image/bmp");
  }
}
