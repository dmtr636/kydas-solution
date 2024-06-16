package com.kydas.metro.stations;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@Embeddable
public class StationDTO {
    private Integer id;

    private String name;

    private String nameFull;

    private Integer lineId;

    private String lineNameShort;
}

