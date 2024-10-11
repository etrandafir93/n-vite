package tech.nvite.infra.storage;

import com.google.cloud.storage.*;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GoogleCloudStorageService {
    private final Storage storage = StorageOptions.getDefaultInstance().getService();

	@SneakyThrows
    public String uploadFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        BlobId blobId = BlobId.of("n-vite", "invitations/" + fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
		Blob blob = storage.create(blobInfo, file.getBytes());

        return String.format("https://storage.googleapis.com/n-vite/invitations/%s", fileName);
    }
}
