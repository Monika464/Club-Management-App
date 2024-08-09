export interface IInstruction{

}

const Instruction: React.FunctionComponent<IInstruction> =() => {


    return(
        <div>
           <p className="title">Instrukcja używania panelu użytkownika</p>

           <ol>
             <li>W centrum widoczne są kolejne treningi.Zielone opłacone, czerwone nieopłacone.
Przycisk 'Edytuj Szczegóły' pokazuje termin należnej płatności.</li>
             <li>Ikona maila to skrzynka pocztowa. Kliknięcie na bordowe kółko oznacza wiadomość jako przeczytaną,
szary kwadrat oznacza wiadomość do usunięcia.</li>
             <li>Zgłoszenie kontuzji lub choroby wymaga wejścia do zakładki: Kontuzja i wypełnieniu oraz wysłaniu formularza.
Powrót zgłasza się w tym samym miejscu.
Zgłoszenie kontuzji powoduje że opłaty za treningi nie są naliczane.</li>
             <li>Uwaga ! 
Po zakończeniu opłaconego okresu, należność zaczyna się naliczać automatycznie.
Zeby zatrzymac to naliczanie należy zawiesić członkostwo w zakładce: "Członkostwo".
Odwiesza się je w tym samym miejscu.</li>
             <li>W zakładce 'Aktualności' znajdują się bieżące wydarzenia.
Po kliknieciu na dane wydarzenie mozna je komentować.
Własny komentarz można usunąc klikając na kropke.</li>
             <li>Przycisk 'Edytuj' profil do edycji imienia, awatara, zmiany maila oraz  hasła</li>
             <li>Jeśli cos wyswietla sie nieprawidłowo odśwież strone, albo się przeloguj.
jeśli  nadal się powtarza napisz wiadomość do trenera.</li>

           </ol>














       </div>


    )
}

export default Instruction