export const defaultStyleVars = {
    '--text-normal': 'rgba(102,102,102,1)',
    '--text-title': 'rgba(187,187,187,1)',
    '--text-icon': 'rgba(255,255,255,1)',
    '--bg-content': 'rgba(255,255,255,1)',
    '--bg-title': 'rgba(102,102,102,1)',
    '--bg-total': 'rgba(238,238,238,1)',
    '--bg-item-hover': 'rgba(221,221,221,0.2)',
    '--bg-select-focus': 'rgba(221,221,221,1)'
};

export const darkStyleVars = {
    '--text-normal': 'rgba(255,255,255,0.88)',
    '--text-title': 'rgba(187,187,187,1)',
    '--text-icon': 'rgba(255,255,255,1)',
    '--bg-content': 'rgba(40,44,53,1)',
    '--bg-title': 'rgba(34,34,34,1)',
    '--bg-total': 'rgba(17,17,17,1)',
    '--bg-item-hover': 'rgba(221,221,221, 0.2)',
    '--bg-select-focus': 'rgba(51,51,51,1)'
};

export const styleVarsList = [
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