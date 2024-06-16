package com.kydas.metro.routes;

import com.kydas.metro.stations.Station;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.kydas.metro.core.web.Endpoints.ROUTE_ENDPOINT;

@RestController
@RequestMapping(ROUTE_ENDPOINT)
@Tag(name="Сервис маршрутов")
public class RouteController {
    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    @Operation(
        summary = "Построение кратчайшего маршрута между двумя станциями"
    )
    public List<Station> getRoute(@RequestParam int startId, @RequestParam int endId, @RequestParam int extraTransferTime) {
        return routeService.findRoute(startId, endId, extraTransferTime);
    }
}
