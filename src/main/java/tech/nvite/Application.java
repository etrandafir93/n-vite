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
	static class TestVars implements CommandLineRunner {

		@Value("${nvite.test}")
		String mongo;

		@EventListener(ApplicationReadyEvent.class)
		public void x() {
			log.error("!!!!mongo url ready:" + mongo);
		}

		@Override
		public void run(String... args) throws Exception {
			log.error("!!!!mongo url:" + mongo);
		}
	}

}
