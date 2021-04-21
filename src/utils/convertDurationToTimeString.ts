export function ConvertDurationToTimeString(duration: number) {

    // Math.floor -> Rounds down
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    // Adds '0' if the characters are less than or equal to 1
    const timeString = [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2, '0'))
        .join(':');

    return timeString;
}