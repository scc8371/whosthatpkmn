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

export type { BackendDataItem };
export { State };
