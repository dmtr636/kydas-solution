package com.kydas.metro.core.utils;

public class TimeUtils {
    public static String convertMinutesToHHMMSS(int totalMinutes) {
        int hours = totalMinutes / 60;
        int minutes = totalMinutes % 60;
        int seconds = 0;

        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }
}
