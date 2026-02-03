package com.focuscenter.config;

import com.focuscenter.model.Facility;
import com.focuscenter.repository.FacilityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedFacilities(FacilityRepository facilityRepository) {
        return args -> {
            if (facilityRepository.count() > 0) {
                return;
            }

            Facility gym = new Facility();
            gym.setName("Main Gymnasium");
            gym.setType("Sports Hall");
            gym.setDescription("Full-size gymnasium with hardwood floor and bleacher seating.");
            gym.setCapacity(200);
            gym.setHourlyRate(75.0);
            gym.setIsAvailable(true);
            gym.setImageUrl("https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80");
            gym.setAddress(SiteInfo.FACILITY_ADDRESS);

            Facility studio = new Facility();
            studio.setName("Movement Studio");
            studio.setType("Studio");
            studio.setDescription("Mirrored studio ideal for yoga, dance, and group fitness classes.");
            studio.setCapacity(40);
            studio.setHourlyRate(45.0);
            studio.setIsAvailable(true);
            studio.setImageUrl("https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80");
            studio.setAddress(SiteInfo.FACILITY_ADDRESS);

            Facility meetingRoom = new Facility();
            meetingRoom.setName("Community Meeting Room");
            meetingRoom.setType("Meeting Room");
            meetingRoom.setDescription("Flexible meeting space with conference tables and AV setup.");
            meetingRoom.setCapacity(30);
            meetingRoom.setHourlyRate(30.0);
            meetingRoom.setIsAvailable(true);
            meetingRoom.setImageUrl("https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80");
            meetingRoom.setAddress(SiteInfo.FACILITY_ADDRESS);

            Facility kitchen = new Facility();
            kitchen.setName("Teaching Kitchen");
            kitchen.setType("Kitchen");
            kitchen.setDescription("Community kitchen with prep stations, ovens, and seating area.");
            kitchen.setCapacity(20);
            kitchen.setHourlyRate(55.0);
            kitchen.setIsAvailable(true);
            kitchen.setImageUrl("https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80");
            kitchen.setAddress(SiteInfo.FACILITY_ADDRESS);

            facilityRepository.saveAll(List.of(gym, studio, meetingRoom, kitchen));
        };
    }
}
