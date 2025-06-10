export const formatMsToHHMMSS = (value: number) => {
    const padTwoDigits = (n: number) => ("00" + n).slice(-2);

    var ms = value % 1000;
    value = (value - ms) / 1000;
    var secs = value % 60;
    value = (value - secs) / 60;
    var mins = value % 60;
    var hrs = (value - mins) / 60;

    return padTwoDigits(hrs) + ":" + padTwoDigits(mins) + ":" + padTwoDigits(secs);
}