package tech.nvite.infra.storage;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class GoogleCloudStorage {
	public static final String SAVED_IMAGE_URL = "https://storage.googleapis.com/n-vite/%s";
	private final Storage storage = StorageOptions.getDefaultInstance().getService();

	@SneakyThrows
	public String uploadFile(MultipartFile file) {
		String fileName = "invitations/%s".formatted(file.getOriginalFilename());
		BlobInfo blobInfo = BlobInfo.newBuilder(BlobId.of("n-vite", fileName)).build();

		storage.create(blobInfo, file.getBytes());
		return SAVED_IMAGE_URL.formatted(fileName);
	}
}
