package tech.nvite;

import com.google.cloud.NoCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
class ServiceConnectionIntegrationTest {
	@Bean
	@ServiceConnection
	public MongoDBContainer mongoDBContainer() {
		return new MongoDBContainer(DockerImageName.parse("mongo:4.0.10"));
	}

	@Bean
	@Primary
	public Storage fakeGcpStorage() {
		String fakeGcsExternalUrl = "http://0.0.0.0:4443";
		return StorageOptions.newBuilder()
				.setHost(fakeGcsExternalUrl)
				.setProjectId("test-project")
				.setCredentials(NoCredentials.getInstance())
				.build()
				.getService();
	}
}
