package tech.nvite;

import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.WaitStrategy;
import org.testcontainers.containers.wait.strategy.WaitStrategyTarget;
import org.testcontainers.utility.DockerImageName;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class GoogleCloudStorageEmulatorContainer extends GenericContainer<GoogleCloudStorageEmulatorContainer> {

	public static final DockerImageName DEFAULT_IMAGE = new DockerImageName("fsouza/fake-gcs-server");
	public static final int EMULATOR_PORT = 4443;

	public GoogleCloudStorageEmulatorContainer() {
		this(DEFAULT_IMAGE);
	}

	public GoogleCloudStorageEmulatorContainer(DockerImageName dockerImageName) {
		super(dockerImageName);
		dockerImageName.assertCompatibleWith(DEFAULT_IMAGE);
		withCreateContainerCmdModifier(cmd -> cmd.withEntrypoint("/bin/fake-gcs-server", "-scheme", "http"));
		withExposedPorts(EMULATOR_PORT);
		waitingFor(new WaitStrategy() {
			@Override
			public void waitUntilReady(WaitStrategyTarget target) {
				String fakeGcsUrl = "http://%s:%s".formatted(
						target.getHost(), target.getFirstMappedPort());
				updateFakeGcsExternalUrl(fakeGcsUrl);
			}

			@Override
			public WaitStrategy withStartupTimeout(Duration startupTimeout) {
				return getWaitStrategy().withStartupTimeout(startupTimeout);
			}
		});
	}

	public String getUrl() {
		return "http://%s:%s".formatted(getHost(), getFirstMappedPort());
	}

	private static void updateFakeGcsExternalUrl(String gcsUrl) {
		String json = """
				{
					"externalUrl": "%s"
				}
				""".formatted(gcsUrl);

		HttpRequest req = HttpRequest.newBuilder()
				.uri(URI.create(gcsUrl + "/_internal/config"))
				.header("Content-Type", "application/json")
				.PUT(HttpRequest.BodyPublishers.ofString(json))
				.build();

		try {
			HttpResponse<Void> response = HttpClient.newBuilder().build()
					.send(req, HttpResponse.BodyHandlers.discarding());

			if (response.statusCode() != 200) {
				throw new RuntimeException(
						"error updating fake-gcs-server with external url, response status code " + response.statusCode() + " != 200");
			}
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
	}
}
