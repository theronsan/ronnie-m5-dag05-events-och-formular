// Dag 5: Funktioner som kopplar händelser (events). Gör testerna gröna på tests.html.
import type { Filter } from './typer'
// Båda använder EVENT DELEGATION: EN lyssnare på parent, inte en per knapp.

// 1. grupp är elementet som innehåller filterknapparna: <button data-filter="bakverk" aria-pressed="false">
//    Vid klick på en knapp (eller något inuti den):
//      - sätt aria-pressed="true" på knappen som klickades och "false" på alla andra knappar i gruppen
//      - anropa vidVal(knappens data-filter)
//    Klick på något annat i gruppen ska inte göra något.
//    Tips: handelse.target.closest('button[data-filter]')
export function kopplaFilter(
    grupp: HTMLElement,
    vidVal: (filter: Filter) => void
): void {
    // TODO

    grupp.addEventListener('click', (handelse) => {
        // Om det inte är ett html-element, gör ingenting
        if (!(handelse.target instanceof HTMLElement)) {
            return
        }
        // Hämtar knappen som vi klickade på
        const knapp = handelse.target.closest<HTMLButtonElement>(
            'button[data-filter]'
        )
        // Om knapp inte finns
        if (!knapp) {
            return
        }
        // Hämtar alla button[data-filter] i gruppen
        // Vi söker i grupp och inte i document så att vi bara får knapparna i denna grupp och inga andra eventuella knappar
        const allaKnappar = grupp.querySelectorAll<HTMLButtonElement>(
            'button[data-filter]'
        )
        // Loopar igenom NodeList
        allaKnappar.forEach((enKnapp) => {
            // Vi sätter aria-pressed false på alla button-element först
            enKnapp.setAttribute('aria-pressed', 'false')
        })
        // Nu sätter vi aria-pressed true på det button-elementet som vi klickade på
        knapp.setAttribute('aria-pressed', 'true')

        // Nu anropar vi callbacken
        vidVal(knapp.dataset.filter as Filter)
    })
}

// 2. container innehåller kort med knappar: <button class="lagg-i-order" data-id="3">
//    Vid klick på en sådan knapp: anropa vidLaggTill(id) där id är ett TAL (dataset ger text!).
//    Klick på något annat ska inte göra något.
export function kopplaLaggTill(
    container: HTMLElement,
    vidLaggTill: (id: number) => void
): void {
    // TODO
    container.addEventListener('click', (handelse) => {
        // Om det inte är ett html-element, gör ingenting
        if (!(handelse.target instanceof HTMLElement)) {
            return
        }
        // Hämtar knappen som vi klickade på
        const knapp = handelse.target.closest<HTMLButtonElement>(
            'button.lagg-i-order'
        )
        // Om knapp inte finns
        if (!knapp) {
            return
        }

        // Callback
        // Gör om string till number
        vidLaggTill(Number(knapp.dataset.id))
    })
}
