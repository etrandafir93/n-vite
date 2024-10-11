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
	private final Storage storage = StorageOptions.getDefaultInstance().getService();

	@SneakyThrows
	public String uploadFile(MultipartFile file) {
		String fileName = "invitations/" + file.getOriginalFilename();
		BlobId blobId = BlobId.of("n-vite", fileName);
		BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

		storage.create(blobInfo, file.getBytes());
		return String.format("https://storage.googleapis.com/n-vite/%s", fileName);
	}
}
