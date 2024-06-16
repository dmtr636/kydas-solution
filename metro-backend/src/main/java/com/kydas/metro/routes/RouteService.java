package com.kydas.metro.routes;

import com.kydas.metro.data.StationsDataLoader;
import com.kydas.metro.stations.Station;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class RouteService {
    private static Map<Integer, List<Integer>> graph;
    private static final ReentrantLock lock = new ReentrantLock();

    // Нахождение кратчайшего пути между двумя станциями
    public List<Station> findRoute(int startId, int endId, Integer extraTransferTime) {
        List<Station> stations = StationsDataLoader.getStations();
        ensureGraphInitialized(stations);
        return dijkstra(startId, endId, graph, stations, extraTransferTime);
    }

    // В целях оптимизации граф инициализируется только один раз
    private void ensureGraphInitialized(List<Station> stations) {
        if (graph == null) {
            lock.lock();
            try {
                if (graph == null) {
                    graph = buildGraph(stations);
                }
            } finally {
                lock.unlock();
            }
        }
    }

    // Построение графа
    private Map<Integer, List<Integer>> buildGraph(List<Station> stations) {
        Map<Integer, List<Integer>> graph = new HashMap<>();

        // Добавление путей между станциями
        for (int i = 0; i < stations.size(); i++) {
            Station currentStation = stations.get(i);
            int currentId = currentStation.getId();
            graph.putIfAbsent(currentId, new ArrayList<>());

            if (i > 0) {
                Station prevStation = stations.get(i - 1);
                if (Objects.equals(prevStation.getLineNameShort(), currentStation.getLineNameShort())) {
                    int prevId = prevStation.getId();
                    graph.get(currentId).add(prevId);
                    graph.putIfAbsent(prevId, new ArrayList<>());
                    graph.get(prevId).add(currentId);
                }
            }

            if (i < stations.size() - 1) {
                Station nextStation = stations.get(i + 1);
                if (Objects.equals(nextStation.getLineNameShort(), currentStation.getLineNameShort())) {
                    int nextId = nextStation.getId();
                    graph.get(currentId).add(nextId);
                    graph.putIfAbsent(nextId, new ArrayList<>());
                    graph.get(nextId).add(currentId);
                }
            }
        }

        // Добавлений пересадок
        for (Station station : stations) {
            int currentId = station.getId();
            for (Station s : stations) {
                if (!Objects.equals(s.getLineNameShort(), station.getLineNameShort()) &&
                    StationsDataLoader.getStationTransferTimes().stream().anyMatch(
                        d -> (Objects.equals(d.getStationId1(), s.getId()) && d.getStationId2() == currentId) ||
                            (Objects.equals(d.getStationId2(), s.getId()) && d.getStationId1() == currentId)
                    )) {
                    graph.get(currentId).add(s.getId());
                }
            }
        }
        return graph;
    }

    // Алгоритм Дейкстры
    // В качестве весов используется время в пути между станциями
    private List<Station> dijkstra(
        int startId, int endId, Map<Integer, List<Integer>> graph, List<Station> stations, Integer extraTransferTime
    ) {
        Map<Integer, Integer> distances = new HashMap<>();
        Map<Integer, Integer> previous = new HashMap<>();
        PriorityQueue<Integer> queue = new PriorityQueue<>(Comparator.comparingInt(distances::get));

        for (Station station : stations) {
            distances.put(station.getId(), Integer.MAX_VALUE);
            previous.put(station.getId(), -1);
        }

        distances.put(startId, 0);
        queue.add(startId);

        while (!queue.isEmpty()) {
            int current = queue.poll();

            if (current == endId) {
                break;
            }

            for (int neighbor : graph.get(current)) {
                int weight = Math.round(getTimeBetweenStations(current, neighbor, extraTransferTime + 5));
                int alt = distances.get(current) + weight;

                if (alt < distances.get(neighbor)) {
                    distances.put(neighbor, alt);
                    previous.put(neighbor, current);
                    queue.add(neighbor);
                }
            }
        }

        List<Station> path = new ArrayList<>();
        for (int at = endId; at != -1; at = previous.get(at)) {
            int finalAt = at;
            path.add(stations.stream().filter(s -> s.getId() == finalAt).findFirst().orElse(null));
        }
        Collections.reverse(path);
        return path;
    }

    // Нахождение времени в пути между двумя станциями
    public Float getTimeBetweenStations(Integer stationId1, Integer stationId2, Integer extraTransferTime) {
        var time = 0F;
        var timeDriving = StationsDataLoader.getStationDrivingTimes().stream().filter(s ->
                Objects.equals(s.getStationId1(), stationId1) && Objects.equals(s.getStationId2(), stationId2)
        ).findFirst();
        if (timeDriving.isPresent()) {
            time = timeDriving.get().getTimeMinutes();
        } else {
            var timeTransfer = StationsDataLoader.getStationTransferTimes().stream().filter(s ->
                Objects.equals(s.getStationId1(), stationId1) && Objects.equals(s.getStationId2(), stationId2)
            ).findFirst();
            if (timeTransfer.isPresent()) {
                time = timeTransfer.get().getTimeMinutes() + extraTransferTime;
            }
        }
        return time;
    }

    // Нахождение суммарного времени в пути
    public Integer getTripDuration(List<Station> route, Integer extraTransferTime) {
        var time = 0F;
        var index = 0;
        for (var station: route) {
            if (index > 0) {
                time += getTimeBetweenStations(station.getId(), route.get(index - 1).getId(), extraTransferTime);
            }
            index++;
        }
        return Math.round(time) + 20;
    }

    public List<Station> getShortRoute(List<Station> route) {
        var shortRoute = new ArrayList<Station>();
        var index = 0;
        for (var station: route) {
            if (index == 0) {
                shortRoute.add(station);
            } else if (index == route.size() - 1) {
                shortRoute.add(station);
            } else {
                if (!Objects.equals(station.getLineNameShort(), route.get(index - 1).getLineNameShort())) {
                    shortRoute.add(station);
                }
            }
            index++;
        }
        return shortRoute;
    }

    public List<Integer> getRouteTransferTime(List<Station> route, Integer extraTransferTime) {
        var time = new ArrayList<Integer>();
        var index = 0;
        for (var station: route) {
            if (index > 0 && !Objects.equals(station.getLineNameShort(), route.get(index - 1).getLineNameShort())) {
                time.add(Math.round(getTimeBetweenStations(station.getId(), route.get(index - 1).getId(), extraTransferTime)));
            }
            index++;
        }
        return time;
    }
}
