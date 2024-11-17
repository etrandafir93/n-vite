package tech.nvite.infra.storage;

import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoogleCloudStorage {

    public static final String SAVED_IMAGE_URL = "https://storage.googleapis.com/n-vite/";
    private final Storage storage;

    @SneakyThrows
    public String uploadFile(MultipartFile file) {
        String fileName = "invitations/%s".formatted(UUID.randomUUID()
            .toString());
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId(fileName))
            .build();

        storage.create(blobInfo, file.getBytes());
        return SAVED_IMAGE_URL + fileName;
    }

    public void delete(String imageNameOrUrl) {
        String imgName = imageNameOrUrl.contains(SAVED_IMAGE_URL) ? imageNameOrUrl.split(SAVED_IMAGE_URL)[1] : imageNameOrUrl;

        boolean deleted = storage.delete(blobId(imgName));
        if (deleted) {
            log.info("deleted image from storage {}", imageNameOrUrl);
        } else {
            log.error("couldn't delete image from storage {}", imageNameOrUrl);
        }
    }

    private static BlobId blobId(String fileName) {
        return BlobId.of("n-vite", fileName);
    }

	@Configuration
	static class Config {
		@Bean
		Storage storage(){
			return StorageOptions.getDefaultInstance().getService();
		}
	}
}
