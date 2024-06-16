package com.kydas.metro.core.utils;

public class StringUtils {
    public static String padLeft(String inputString, int length, String character) {
        if (inputString.length() >= length) {
            return inputString;
        }
        StringBuilder sb = new StringBuilder();
        while (sb.length() < length - inputString.length()) {
            sb.append(character);
        }
        sb.append(inputString);

        return sb.toString();
    }
}
