package com.kydas.metro.core.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;

import java.io.IOException;

public class JsonUtils {
    public static <T> T readJson(Resource file, Class<T> valueType) throws IOException {
        return new ObjectMapper().readValue(file.getInputStream(), valueType);
    }
}
