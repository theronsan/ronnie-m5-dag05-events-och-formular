// Dag 5: Filtrering av menyn.
import type { Ratt, Filter } from './typer'

// filter är "alla", "vegetarisk" eller en kategori ("bakverk", "dryck", "lunch").
//   "alla"        -> hela menyn
//   "vegetarisk"  -> bara vegetariska rätter
//   annat         -> rätter vars kategori är lika med filter
// Okänt filter ger en tom lista.
export function filtreraMeny(meny: Ratt[], filter: Filter): Ratt[] {
    // TODO
    if (filter === 'alla') {
        return [...meny]
    }

    if (filter === 'vegetarisk') {
        return meny.filter((ratt) => ratt.vegetarisk)
    }

    return meny.filter((ratt) => ratt.kategori === filter)
}
