/**
 * Creates array with accent on the 1 and length passed by parameter
 * @param {number} beatsPerMeasure beats in the time signature
 */
export const createDefaultBeatTypesArray = (beatsPerMeasure: number) => {
    const auxArray = new Array(beatsPerMeasure).fill(1);
    auxArray[0] = 0;
    return auxArray;
}

/**
 * Receives beatTypesArray and adds new positions in case the new time signature is longer.
 * If it's not longer, it returns the same array passed as argument.
 * @param currentBeatTypes array of beat types
 * @param newBeatsPerMeasure beats in the new time signature
 * @returns 
 */
export const getUpdatedBeatTypesArray = (currentBeatTypes: number[], newBeatsPerMeasure: number): number[] => {
    // keey types for those beats that are not in the nre time signature
    if (currentBeatTypes.length >= newBeatsPerMeasure) return [...currentBeatTypes];

    const newBeatTypesSection = new Array(newBeatsPerMeasure - currentBeatTypes.length).fill(1);
    return [...currentBeatTypes, ...newBeatTypesSection];
}
