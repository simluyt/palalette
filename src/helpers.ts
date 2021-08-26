export function adjustColor(col: string, percent: number) {
    const num = parseInt(col.slice(1, 7), 16);
    
    const r = (num >> 16);
    const b = (num >> 8 & 0x00FF);
    const g = (num & 0x0000FF);
    
    const hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
    );

    let amt;
    if (hsp>127.5) {
        amt = -1 * Math.round(2.55 * percent);
    } 
    else {
        amt = Math.round(2.55 * percent);
    }

    const R = r + amt;
    const B = b + amt;
    const G = g + amt;

    return `#${(0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1)}`;
};
  