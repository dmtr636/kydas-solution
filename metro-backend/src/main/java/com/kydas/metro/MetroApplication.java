package com.kydas.metro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class MetroApplication {
	public static void main(String[] args) {
		SpringApplication.run(MetroApplication.class, args);
	}
}
