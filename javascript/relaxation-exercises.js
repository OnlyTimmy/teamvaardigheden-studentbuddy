export const relaxationExercises = [
    {
        id: 'breathing',
        title: 'Rustig ademen',
        description: 'Adem drie keer bewust in, houd even vast en adem langzaam uit.',
        phases: Array.from({ length: 3 }, () => [
            { duration: 4, label: 'Adem in', instruction: 'Adem rustig in door je neus.', visualState: 'inhale' },
            { duration: 2, label: 'Houd vast', instruction: 'Houd je adem ontspannen vast.', visualState: 'hold' },
            { duration: 6, label: 'Adem uit', instruction: 'Adem langzaam uit door je mond.', visualState: 'exhale' },
        ]).flat(),
    },
    {
        id: 'pause',
        title: 'Frisse blik',
        description: 'Een korte schermpauze om je ogen en bovenlichaam rust te geven.',
        phases: [
            { duration: 20, label: 'Kijk ver weg', instruction: 'Kijk naar een punt in de verte en laat je ogen ontspannen.', visualState: 'look' },
            { duration: 15, label: 'Laat los', instruction: 'Laat je schouders zakken en maak je kaken los.', visualState: 'release' },
            { duration: 15, label: 'Drink water', instruction: 'Neem rustig enkele slokken water als je dat bij de hand hebt.', visualState: 'water' },
            { duration: 10, label: 'Kies je focus', instruction: 'Bepaal één kleine taak waarmee je zo meteen verdergaat.', visualState: 'focus' },
        ],
    },
    {
        id: 'stretch',
        title: 'Studie-stretch',
        description: 'Vier eenvoudige bewegingen die je zittend of staand kunt uitvoeren.',
        phases: [
            { duration: 15, label: 'Nek', instruction: 'Breng je rechteroor rustig naar je rechterschouder. Wissel halverwege.', visualState: 'neck' },
            { duration: 15, label: 'Schouders', instruction: 'Rol je schouders langzaam naar achteren en daarna naar voren.', visualState: 'shoulders' },
            { duration: 15, label: 'Polsen', instruction: 'Strek je armen losjes uit en draai rustig met beide polsen.', visualState: 'wrists' },
            { duration: 15, label: 'Hele lichaam', instruction: 'Strek je armen omhoog, maak jezelf lang en laat weer los.', visualState: 'body' },
        ],
    },
];
