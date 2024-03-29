export type StyleVars = {
    ['--text-normal']: string,
    ['--text-icon']: string
    ['--bg-content']: string
    ['--bg-total']: string
    ['--bg-item-hover']: string
    ['--bg-select-focus']: string
};

export type StyleVarsList = {
    name: string,
    styleVars: StyleVars,
    editable: boolean
}[];

export const defaultStyleVars: StyleVars = {
    '--text-normal': 'rgba(102,102,102,1)',
    '--text-icon': 'rgba(51,51,51,1)',
    '--bg-content': 'rgba(255,255,255,1)',
    '--bg-total': 'rgba(238,238,238,1)',
    '--bg-item-hover': 'rgba(221,221,221,0.2)',
    '--bg-select-focus': 'rgba(221,221,221,1)'
};

export const darkStyleVars: StyleVars = {
    '--text-normal': 'rgba(255,255,255,0.88)',
    '--text-icon': 'rgba(255,255,255,1)',
    '--bg-content': 'rgba(40,44,53,1)',
    '--bg-total': 'rgba(17,17,17,1)',
    '--bg-item-hover': 'rgba(221,221,221,0.2)',
    '--bg-select-focus': 'rgba(51,51,51,1)'
};

export const styleVarsList: StyleVarsList = [
    {
        name: 'Light',
        styleVars: defaultStyleVars,
        editable: false
    },
    {
        name: 'Dark',
        styleVars: darkStyleVars,
        editable: true
    }
];