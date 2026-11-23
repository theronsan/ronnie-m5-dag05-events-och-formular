// Dag 5: Bokningsformuläret. Kopplas på kontakt.html.
import {
    valideraNamn,
    valideraEpost,
    valideraTelefon,
    valideraDatum,
    valideraAntal,
    valideraFormular,
    dagensDatum
} from './validering'

import { hamta } from './dom'

type Falt = HTMLInputElement | HTMLSelectElement

const form = hamta<HTMLFormElement>('#bokningsform')
const bekraftelse = hamta('#bekraftelse')

// elements.namedItem ger Element | RadioNodeList | null. Vi kollar att det är ett fält vi känner igen.
function hittaFalt(namn: string): Falt {
    const falt = form.elements.namedItem(namn)
    if (falt instanceof HTMLInputElement || falt instanceof HTMLSelectElement) {
        return falt
    }
    throw new Error(`Fältet ${namn} saknas i formuläret`)
}

// Vilken regel hör till vilket fält? Nyckeln är fältets name-attribut.
const regler: Record<string, (text: string) => string> = {
    namn: valideraNamn,
    epost: valideraEpost,
    telefon: valideraTelefon,
    datum: (text: string) => valideraDatum(text, dagensDatum()),
    antal: valideraAntal
}

// 1. visaFel(falt, meddelande): visa ett felmeddelande under fältet.
//    - Finns det inget <p class="falt-fel" id="NAMN-fel"> efter fältet? Skapa det (insertAdjacentElement("afterend", p)).
//    - p.textContent = meddelande
//    - Är meddelandet tomt: ta bort aria-invalid och aria-describedby från fältet.
//      Annars: falt.setAttribute("aria-invalid", "true") och aria-describedby = p:ts id.
function visaFel(falt: Falt, meddelande: string): void {
    // TODO

    // Skapar id:t
    const felID = falt.name + '-fel'

    let p = document.getElementById(felID)

    if (p === null) {
        p = document.createElement('p')
        p.className = 'falt-fel'
        p.id = felID
        falt.insertAdjacentElement('afterend', p)
    }

    p.textContent = meddelande

    if (meddelande !== '') {
        falt.setAttribute('aria-invalid', 'true')
        falt.setAttribute('aria-describedby', felID)
    } else {
        falt.removeAttribute('aria-invalid')
        falt.removeAttribute('aria-describedby')
    }
}
/*
// Testar visaFel
visaFel(hittaFalt('namn'), 'Första felet')
visaFel(hittaFalt('namn'), 'Andra felet')
visaFel(hittaFalt('epost'), 'Fel i e-post')
visaFel(hittaFalt('namn'), '')
 */

// 2. Koppla varje fält i regler: validera när användaren LÄMNAR fältet ("blur"),
//    och validera på nytt vid "input" men bara om fältet redan är markerat som fel (aria-invalid="true").
// TODO

// 3. Vid "submit": preventDefault(). Validera hela formuläret med valideraFormular.
//    - Finns fel: visa dem alla med visaFel, flytta fokus till första felaktiga fältet.
//    - Annars: skriv "Tack! Vi bekräftar din bokning inom ett dygn." i #bekraftelse och töm formuläret (form.reset()).
//    Tips: new FormData(form) ger fält av typen string | File. valideraFormular vill ha Record<string, string>,
//    så loopa och ta bara värden där typeof varde === "string".
//    Använd hittaFalt(namn) för att hämta ett fält med rätt typ.
// TODO
