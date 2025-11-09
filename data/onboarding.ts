export type FeelingOption = 'overwhelmed' | 'curious' | 'optimistic' | 'insecure';

export const feelings = [
    { id: 'overwhelmed' as FeelingOption, label: 'Abrumado/a', icon: 'overwhelmed' },
    { id: 'curious' as FeelingOption, label: 'Curioso/a', icon: 'curious' },
    { id: 'optimistic' as FeelingOption, label: 'Optimista', icon: 'optimistic' },
    { id: 'insecure' as FeelingOption, label: 'Inseguro/a', icon: 'insecure' },
];

export type GoalOption = 'understand' | 'emergency' | 'save' | 'organize';

export const goals = [
    { id: 'understand' as GoalOption, label: 'Entender a dónde va mi dinero', icon: 'understand' },
    { id: 'emergency' as GoalOption, label: 'Crear un fondo de tranquilidad', icon: 'emergency' },
    { id: 'save' as GoalOption, label: 'Ahorrar para algo especial', icon: 'save' },
    { id: 'organize' as GoalOption, label: 'Simplemente organizarme', icon: 'organize' },
];
