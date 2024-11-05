package tech.nvite;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

	@Service @Slf4j
	static class TestVars {
		@EventListener(ApplicationReadyEvent.class)
		public void x() {
			System.getenv().forEach((key, value) -> System.out.println(key + "=" + value));
		}
	}
}
