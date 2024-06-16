package com.kydas.metro.core.filter;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class GetListByFilterDTO<F> {
    @NotNull
    private Integer limit;
    @NotNull
    private Integer offset;
    @NotNull
    private F filter;
}
