export const formatMsToHHMMSS = (value: number) => {
    const padTwoDigits = (n: number) => ("00" + n).slice(-2);

    let auxValue = value;
    const ms = auxValue % 1000;
    auxValue = (auxValue - ms) / 1000;
    const secs = auxValue % 60;
    auxValue = (auxValue - secs) / 60;
    const mins = auxValue % 60;
    const hrs = (auxValue - mins) / 60;

    return padTwoDigits(hrs) + ":" + padTwoDigits(mins) + ":" + padTwoDigits(secs);
}