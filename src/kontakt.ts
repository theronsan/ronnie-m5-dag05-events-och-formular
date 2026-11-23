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

    // Kollar om felmeddelandet för fältet redan finns
    let p = document.getElementById(felID)
    // Om inte skapar vi denna
    if (p === null) {
        p = document.createElement('p')
        p.className = 'falt-fel'
        p.id = felID
        falt.insertAdjacentElement('afterend', p)
    }
    // Vi sätter paragraphens textinnehåll
    p.textContent = meddelande
    // Om det finns textinnehåll sätter vi aria
    if (meddelande !== '') {
        falt.setAttribute('aria-invalid', 'true')
        falt.setAttribute('aria-describedby', felID)
    } else {
        // Om textinnehållet är tomt tar vi bort aria
        falt.removeAttribute('aria-invalid')
        falt.removeAttribute('aria-describedby')
    }
}

// 2. Koppla varje fält i regler: validera när användaren LÄMNAR fältet ("blur"),
//    och validera på nytt vid "input" men bara om fältet redan är markerat som fel (aria-invalid="true").
// TODO

Object.keys(regler).forEach((namn) => {
    // Hämtar fält
    const falt = hittaFalt(namn)
    const validera = regler[namn]

    // Validera när användaren lämnar fältet
    falt.addEventListener('blur', () => {
        const meddelande = validera(falt.value)
        visaFel(falt, meddelande)
    })

    // Validera igen när användaren skriver,
    // men bara om fältet redan har ett fel
    falt.addEventListener('input', () => {
        if (falt.getAttribute('aria-invalid') === 'true') {
            const meddelande = validera(falt.value)
            visaFel(falt, meddelande)
        }
    })
})

// 3. Vid "submit": preventDefault(). Validera hela formuläret med valideraFormular.
//    - Finns fel: visa dem alla med visaFel, flytta fokus till första felaktiga fältet.
//    - Annars: skriv "Tack! Vi bekräftar din bokning inom ett dygn." i #bekraftelse och töm formuläret (form.reset()).
//    Tips: new FormData(form) ger fält av typen string | File. valideraFormular vill ha Record<string, string>,
//    så loopa och ta bara värden där typeof varde === "string".
//    Använd hittaFalt(namn) för att hämta ett fält med rätt typ.
// TODO
form.addEventListener('submit', (handelse) => {
    // Förhindrar att sidan laddas om
    handelse.preventDefault()

    // Hämtar alla värden från formuläret
    const formData = new FormData(form)

    // Skapar ett objekt med bara string-värden
    const varden: Record<string, string> = {}

    formData.forEach((varde, namn) => {
        if (typeof varde === 'string') {
            varden[namn] = varde
        }
    })

    // Validerar hela formuläret
    const fel = valideraFormular(varden, dagensDatum())
    const felNamn = Object.keys(fel)

    // Uppdatera ALLA fält: visa felet om det finns, annars töm det
    Object.keys(regler).forEach((namn) => {
        visaFel(hittaFalt(namn), fel[namn] ?? '')
    })

    // Om det finns fel
    if (felNamn.length > 0) {
        // Flytta fokus till det första fältet med fel.
        // Objekt behåller den ordning som nycklarna lades till i. valideraFormular kontrollerar
        // fälten i samma ordning som i formuläret (namn, epost, telefon, datum, antal),
        // så felNamn[0] blir det översta felaktiga fältet. Ändras ordningen där, ändras fokus här.
        const forstaFalt = hittaFalt(felNamn[0])
        forstaFalt.focus()

        // Nollställer bekräftelsetexten
        bekraftelse.textContent = ''

        return
    }

    // Om formuläret är giltigt
    bekraftelse.textContent = 'Tack! Vi bekräftar din bokning inom ett dygn.'

    // Töm formuläret
    form.reset()
})

// STEG 9: När jag testade med VoiceOver hör jag att rösten läser upp
// de felmeddelanden som visas när ett fält innehåller ett fel.
// Till exempel: "Namnet måste vara minst 2 tecken."
// och: "Ange en giltig e-postadress, till exempel namn@exempel.se."
