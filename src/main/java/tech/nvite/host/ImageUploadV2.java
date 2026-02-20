package tech.nvite.host;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tech.nvite.infra.storage.GoogleCloudStorage;

@Slf4j
@RestController
@RequestMapping("api/v2/upload")
@RequiredArgsConstructor
class ImageUploadV2 {

  private final GoogleCloudStorage storage;

  public record ImageUploadResponse(String url) {}

  @PostMapping("/image")
  @ResponseStatus(HttpStatus.OK)
  public ImageUploadResponse uploadImage(@RequestParam("file") MultipartFile file) {
    log.info("Uploading image: {} (size: {} bytes)", file.getOriginalFilename(), file.getSize());

    if (file.isEmpty()) {
      throw new IllegalArgumentException("File is empty");
    }

    // Validate file type
    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new IllegalArgumentException("File must be an image");
    }

    // Validate file size (max 10MB)
    long maxSize = 10 * 1024 * 1024; // 10MB
    if (file.getSize() > maxSize) {
      throw new IllegalArgumentException("File size must be less than 10MB");
    }

    String url = storage.uploadFile(file);
    log.info("Image uploaded successfully: {}", url);

    return new ImageUploadResponse(url);
  }
}
