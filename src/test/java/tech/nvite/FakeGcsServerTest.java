package tech.nvite;

import com.google.cloud.NoCredentials;
import com.google.cloud.storage.*;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;

@Testcontainers
class FakeGcsServerTest {
	private static Storage storageClient;

	@Container
	static final GoogleCloudStorageEmulatorContainer gcs = new GoogleCloudStorageEmulatorContainer();

	@BeforeAll
	static void setUpFakeGcs() throws Exception {
		CompletableFuture.completedFuture(null);
		storageClient = StorageOptions.newBuilder()
				.setHost(gcs.getUrl())
				.setProjectId("test-project")
				.setCredentials(NoCredentials.getInstance())
				.build()
				.getService();
	}

	@Test
	void shouldUploadFileByWriterChannel() throws IOException {
		storageClient.create(BucketInfo.of("test-bucket"));

		BlobInfo blobInfo = BlobInfo.newBuilder("test-bucket", "test-file.txt")
				.build();

		storageClient.create(blobInfo, Files.readAllBytes(Paths.get("src/test/resources/test.txt")));

		Blob blob = storageClient.get("test-bucket", "test-file.txt");
		System.err.println(new String(blob.getContent()));
	}

}
