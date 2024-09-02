interface BackendDataItem {
    name: string;
    cry: string;
    class: string;
    sprite: string;
    pokedexNum: Number;
    types: string[];
    pokedexEntry: string;
}

enum State {
    MENU,
    GAME,
    OVER
}
function normalizeString(str: string) {
    return str
        .toLowerCase() // Convert to lower case
        .replace(/[-_\s]+/g, ''); // Remove hyphens, underscores, and spaces
}

function censorPortionOfString(text: string, censorRegex: string) {
    let regex = new RegExp(censorRegex, 'gi');

    return text.replace(regex, '[REDACTED]');
}

function capitalize(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

function convertMsToTime(milliseconds: GLfloat) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24; // Optional: to keep hours within a 24-hour format

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}

function padTo2Digits(num : GLfloat) {
    return num.toString().padStart(2, '0');
}

export type { BackendDataItem };
export { State, normalizeString, censorPortionOfString, capitalize, convertMsToTime };
