package com.kydas.metro.stations;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Station {
    @Id
    private Integer id;

    private String name;

    private String nameFull;

    private Integer lineId;

    private String lineNameShort;
}
