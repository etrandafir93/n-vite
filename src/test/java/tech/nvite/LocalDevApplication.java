package tech.nvite;

import org.springframework.boot.SpringApplication;

class LocalDevApplication {
	public static void main(String[] args) {
		SpringApplication.from(Application::main)
				.with(ServiceConnectionIntegrationTest.class)
				.run(args);
	}
}
