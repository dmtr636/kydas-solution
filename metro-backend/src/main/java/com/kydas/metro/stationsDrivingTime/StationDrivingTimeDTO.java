package com.kydas.metro.stationsDrivingTime;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class StationDrivingTimeDTO {
    private Integer id;

    private Integer stationId1;

    private Integer stationId2;

    private Float timeMinutes;
}

