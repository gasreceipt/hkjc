export interface Horse {
    name: string;
    number: string;
    jockey: string;
    trainer: string;
    draw: string;
    odds: string;
    place: string;
    prevOdds?: string;
}

export interface Race {
    race_id: string;
    date: string;
    venue: string;
    race_no: string;
    course: string;
    going: string;
    distance: string;
    horses: Horse[];
}
