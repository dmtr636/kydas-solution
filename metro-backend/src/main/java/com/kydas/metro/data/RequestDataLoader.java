package com.kydas.metro.data;

import com.github.javafaker.Faker;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.utils.JsonUtils;
import com.kydas.metro.passenger.PassengerDTO;
import com.kydas.metro.passenger.PassengerService;
import com.kydas.metro.request.Request;
import com.kydas.metro.request.RequestDTO;
import com.kydas.metro.request.RequestInfoDTO;
import com.kydas.metro.request.RequestServiceInternal;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.util.*;

@Component
@RequiredArgsConstructor
public class RequestDataLoader {
    private final RequestServiceInternal service;
    private final PassengerService passengerService;

    SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
    SimpleDateFormat isoDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

    @Value("classpath:data/requests.json")
    private Resource resource;

    private int getGroupId(String code) {
        return switch (code) {
            case "ИЗТ" -> 1;
            case "ИЗ" -> 2;
            case "ИС" -> 3;
            case "ИК" -> 4;
            case "ИО" -> 5;
            case "ДИ" -> 6;
            case "ПЛ" -> 7;
            case "РД" -> 8;
            case "РДК" -> 9;
            case "ОГД" -> 10;
            case "ОВ" -> 11;
            case "ИУ" -> 12;
            default -> throw new IllegalArgumentException("Неправильный код: " + code);
        };
    }

    private RequestInfoDTO getRequestInfoDTO(
        String fullName, Faker faker, Random random, String sex, Date tripDate,
        Date tripDateEnd, RequestImportDTO importDTO, Boolean hasBaggage
    ) {
        return new RequestInfoDTO()
            .setFullName(fullName)
            .setPhone(faker.phoneNumber().phoneNumber().replace("(", "").replace(")", "").replace("-", ""))
            .setPhoneDescription("Примерное описание основного номера")
            .setPhoneSecondary(faker.phoneNumber().phoneNumber().replace("(", "").replace(")", "").replace("-", ""))
            .setPhoneSecondaryDescription("Примерное описание дополнительного номера")
            .setAge(random.nextInt(70) + 20)
            .setSex(fullName.split(" ")[0].endsWith("а") ? "female" : sex)
            .setTripDate(isoDateFormat.format(tripDate))
            .setTripDateEnd(isoDateFormat.format(tripDateEnd))
            .setDepartureStationId(Integer.parseInt(importDTO.id_st1))
            .setArrivalStationId(Integer.parseInt(importDTO.id_st2))
            .setMeetingPoint("У входных дверей")
            .setGroupId(getGroupId(Objects.equals(importDTO.cat_pas, "ОГД") ? "РД" : importDTO.cat_pas))
            .setWheelchairRequired(faker.bool().bool())
            .setHasBaggage(hasBaggage)
            .setLightBaggage(hasBaggage && faker.bool().bool())
            .setMediumBaggage(hasBaggage && faker.bool().bool())
            .setBaggageDescription(hasBaggage ? "Примерное описание багажа" : null)
            .setBaggageWeight(hasBaggage ? "10 кг." : null)
            .setComment("Комментарий для примера")
            .setStrollerDescription("Примерное описание коляски")
            .setPacemaker(faker.bool().bool())
            .setBaggageHelpRequired(hasBaggage && faker.bool().bool());
    }

    public void createRequests() throws IOException, ApiException, ParseException {
        TimeZone.setDefault(TimeZone.getTimeZone(ZoneId.of("Europe/Moscow")));
        dateFormat.setTimeZone(TimeZone.getTimeZone("Europe/Moscow"));
        isoDateFormat.setTimeZone(TimeZone.getTimeZone("Europe/Moscow"));

        Random random = new Random(1);
        Faker faker = new Faker(new Locale("ru"), random);

        var requestImportDTOS = JsonUtils.readJson(resource, RequestImportDTO[].class);
        var requestInfoDTOS = new ArrayList<RequestInfoDTO>();

        for (var importDTO : requestImportDTOS) {
            InitData initData = getInitData(importDTO, 0, faker, random);
            var requestInfoDTO = getRequestInfoDTO(
                initData.fullName(), faker, random, initData.sex(),
                initData.tripDate(), initData.tripDateEnd(), importDTO, initData.hasBaggage()
            );
            requestInfoDTOS.add(requestInfoDTO);
            passengerService.createByRoot(new PassengerDTO()
                .setFullName(requestInfoDTO.getFullName())
                .setPhone(requestInfoDTO.getPhone())
                .setPhoneDescription(requestInfoDTO.getPhoneDescription())
                .setPhoneSecondary(requestInfoDTO.getPhoneSecondary())
                .setPhoneSecondaryDescription(requestInfoDTO.getPhoneSecondaryDescription())
                .setSex(requestInfoDTO.getSex())
                .setAge(requestInfoDTO.getAge())
                .setGroupId(requestInfoDTO.getGroupId())
                .setPacemaker(requestInfoDTO.getPacemaker())
                .setComment(requestInfoDTO.getComment())
            );
        }

        for (int dayIndex = 0; dayIndex <= 20; dayIndex++) {
            var dtoIndex = 1L;
            for (var importDTO : requestImportDTOS) {
                InitData initData = getInitData(importDTO, dayIndex, faker, random);
                var requestInfoDTO = requestInfoDTOS.get((int) (dtoIndex - 1));
                var generatedRequestInfoDTO = getRequestInfoDTO(
                    initData.fullName(), faker, random, initData.sex(),
                    initData.tripDate(), initData.tripDateEnd(), importDTO, initData.hasBaggage()
                );
                generatedRequestInfoDTO
                    .setFullName(requestInfoDTO.getFullName())
                    .setPhone(requestInfoDTO.getPhone())
                    .setPhoneDescription(requestInfoDTO.getPhoneDescription())
                    .setPhoneSecondary(requestInfoDTO.getPhoneSecondary())
                    .setPhoneSecondaryDescription(requestInfoDTO.getPhoneSecondaryDescription())
                    .setSex(requestInfoDTO.getSex())
                    .setAge(requestInfoDTO.getAge())
                    .setGroupId(requestInfoDTO.getGroupId())
                    .setPacemaker(requestInfoDTO.getPacemaker())
                    .setComment(requestInfoDTO.getComment());

                var requestDTO = new RequestDTO()
                    .setInfo(generatedRequestInfoDTO)
                    .setStatus(Request.Status.CONFIRMED)
                    .setInspectorMaleCount(Integer.parseInt(importDTO.insp_sex_m))
                    .setInspectorFemaleCount(Integer.parseInt(importDTO.insp_sex_f))
                    .setTripDuration(importDTO.time_over)
                    .setPassengerId(dtoIndex);

                service.create(requestDTO);
                dtoIndex++;
            }

            var i = 0;
            for (var importDTO : Arrays.stream(requestImportDTOS).toList().subList(0, 3)) {
                InitData initData = getInitData(importDTO, dayIndex, faker, random);
                var requestInfoDTO = requestInfoDTOS.get(i);
                var generatedRequestInfoDTO = getRequestInfoDTO(
                    initData.fullName(), faker, random, initData.sex(),
                    initData.tripDate(), initData.tripDateEnd(), importDTO, initData.hasBaggage()
                );
                generatedRequestInfoDTO
                    .setFullName(requestInfoDTO.getFullName())
                    .setPhone(requestInfoDTO.getPhone())
                    .setPhoneDescription(requestInfoDTO.getPhoneDescription())
                    .setPhoneSecondary(requestInfoDTO.getPhoneSecondary())
                    .setPhoneSecondaryDescription(requestInfoDTO.getPhoneSecondaryDescription())
                    .setSex(requestInfoDTO.getSex())
                    .setGroupId(requestInfoDTO.getGroupId())
                    .setPacemaker(requestInfoDTO.getPacemaker())
                    .setComment(requestInfoDTO.getComment());

                var requestDTO = new RequestDTO()
                    .setInfo(generatedRequestInfoDTO)
                    .setStatus(i == 1 ? Request.Status.CANCELED : Request.Status.NEW)
                    .setInspectorMaleCount(Integer.parseInt(importDTO.insp_sex_m))
                    .setInspectorFemaleCount(Integer.parseInt(importDTO.insp_sex_f))
                    .setTripDuration(importDTO.time_over)
                    .setAssignedEmployees(List.of())
                    .setPassengerId((long) (i + 1));
                i++;
                service.create(requestDTO);
            }
        }
    }

    private InitData getInitData(RequestImportDTO importDTO, int dayIndex, Faker faker, Random random) throws ParseException {
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(ZoneId.of("Europe/Moscow")));
        calendar.setTime(dateFormat.parse(importDTO.datetime));
        calendar.set(Calendar.MONTH, Calendar.JUNE);
        calendar.set(Calendar.DAY_OF_MONTH, 10 + dayIndex);
        Date tripDate = calendar.getTime();

        String[] timeParts = importDTO.time_over.split(":");
        int hoursToAdd = Integer.parseInt(timeParts[0]);
        int minutesToAdd = Integer.parseInt(timeParts[1]);
        int secondsToAdd = Integer.parseInt(timeParts[2]);
        calendar.add(Calendar.HOUR_OF_DAY, hoursToAdd);
        calendar.add(Calendar.MINUTE, minutesToAdd);
        calendar.add(Calendar.SECOND, secondsToAdd);
        Date tripDateEnd = calendar.getTime();

        var isMale = faker.bool().bool();
        var fullName = generateRandomFIO(isMale, random);
        var hasBaggage = faker.bool().bool();
        return new InitData(tripDate, tripDateEnd, isMale ? "male" : "female", fullName, hasBaggage);
    }

    private record InitData(Date tripDate, Date tripDateEnd, String sex, String fullName, boolean hasBaggage) {
    }

    private static final String[] maleSurnames = {
        "Иванов", "Смирнов", "Кузнецов", "Попов", "Васильев",
        "Петров", "Соколов", "Михайлов", "Новиков", "Фёдоров"
    };

    private static final String[] femaleSurnames = {
        "Иванова", "Смирнова", "Кузнецова", "Попова", "Васильева",
        "Петрова", "Соколова", "Михайлова", "Новикова", "Фёдорова"
    };

    private static final String[] maleNames = {
        "Александр", "Максим", "Дмитрий", "Сергей", "Андрей",
        "Алексей", "Иван", "Михаил", "Николай", "Павел"
    };

    private static final String[] femaleNames = {
        "Анна", "Мария", "Елена", "Ольга", "Татьяна",
        "Наталья", "Светлана", "Юлия", "Ирина", "Анастасия"
    };

    private static final String[] malePatronymics = {
        "Александрович", "Максимович", "Дмитриевич", "Сергеевич", "Андреевич",
        "Алексеевич", "Иванович", "Михайлович", "Николаевич", "Павлович"
    };

    private static final String[] femalePatronymics = {
        "Александровна", "Максимовна", "Дмитриевна", "Сергеевна", "Андреевна",
        "Алексеевна", "Ивановна", "Михайловна", "Николаевна", "Павловна"
    };

    public static String generateRandomFIO(boolean isMale, Random random) {
        String surname = isMale ? maleSurnames[random.nextInt(maleSurnames.length)]
            : femaleSurnames[random.nextInt(femaleSurnames.length)];
        String name = isMale ? maleNames[random.nextInt(maleNames.length)]
            : femaleNames[random.nextInt(femaleNames.length)];
        String patronymic = isMale ? malePatronymics[random.nextInt(malePatronymics.length)]
            : femalePatronymics[random.nextInt(femalePatronymics.length)];

        return String.format("%s %s %s", surname, name, patronymic);
    }

    public static String generateRandomName(boolean isMale, Random random) {
        return isMale ? maleNames[random.nextInt(maleNames.length)]
            : femaleNames[random.nextInt(femaleNames.length)];
    }

    public static String generateRandomPatronymic(boolean isMale, Random random) {
        return isMale ? malePatronymics[random.nextInt(malePatronymics.length)]
            : femalePatronymics[random.nextInt(femalePatronymics.length)];
    }

    @Data
    static class RequestImportDTO {
        String id;
        String id_pas;
        String time3;
        String time4;
        String status;
        String tpz;
        String datetime;
        String cat_pas;
        String insp_sex_m;
        String insp_sex_f;
        String time_over;
        String id_st1;
        String id_st2;
    }
}
