package ro.bachelor.backend.task.dto;

public record GenericResponseDto(
        String variant,
        String title,
        String description
) {

    public enum Variant {
        DEFAULT,
        WARNING,
        DESTRUCTIVE
    }

    public static GenericResponseDto succes(String title, String description) {
        return new GenericResponseDto(Variant.DEFAULT.name().toLowerCase(), title, description);
    }

    public static GenericResponseDto succes(String title) {
        return new GenericResponseDto(Variant.DEFAULT.name().toLowerCase(), title, null);
    }

    public static GenericResponseDto error(String title, String description) {
        return new GenericResponseDto(Variant.DESTRUCTIVE.name().toLowerCase(), title, description);
    }

    public static GenericResponseDto error(String title) {
        return new GenericResponseDto(Variant.DESTRUCTIVE.name().toLowerCase(), title, null);
    }

    public static GenericResponseDto warning(String title, String description) {
        return new GenericResponseDto(Variant.WARNING.name().toLowerCase(), title, description);
    }

    public static GenericResponseDto warning(String title) {
        return new GenericResponseDto(Variant.WARNING.name().toLowerCase(), title, null);
    }
}
