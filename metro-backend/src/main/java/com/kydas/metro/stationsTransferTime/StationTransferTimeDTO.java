package com.kydas.metro.stationsTransferTime;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class StationTransferTimeDTO {
    private Integer id;

    private Integer stationId1;

    private Integer stationId2;

    private Integer timeMinutes;
}

