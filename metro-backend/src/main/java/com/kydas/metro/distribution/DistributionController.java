package com.kydas.metro.distribution;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.kydas.metro.core.web.Endpoints.DISTRIBUTION_ENDPOINT;

@RestController
@RequestMapping(DISTRIBUTION_ENDPOINT)
@Tag(name = "Сервис распределения")
public class DistributionController {
    @Autowired
    private DistributionService distributionService;

    @PostMapping("/planned")
    @Operation(
        summary = "Плановое распределение заявок"
    )
    public void plannedDistribution(@RequestParam String tripDate) {
        distributionService.plannedDistribution(tripDate);
    }

    @PostMapping("/adaptive")
    @Operation(
        summary = "Адаптивное распределение заявок"
    )
    public void adaptiveDistribution() {
        distributionService.adaptiveDistribution();
    }
}
