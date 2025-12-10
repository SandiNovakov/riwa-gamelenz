# Pravila za rad s Git-om.

## TL:DR
1. kloniranje repo-a: `git clone https://github.com/SandiNovakov/riwa-gamelenz.git`.
2. pull-ajte zadnje promjene s main: `git checkout main`, `git pull origin main`.
3. kreirajte svoj branch da vas drugi ne smetaju: `git checkout -b feature/login-page`.
4. za commit koristite: `git add .`, `git commit -m "poruka"`, NE radite `git ush`.
5. kad ste gotovi pošaljite promjene na github: `git push origin feature/login-page`.
6. javite meni.
7. kad sam mergao vaše promjene u main, ja vama javljam i onda vi radite: `git checkout main`, `git pull origin main`, `git branch -d feature/login-page`.

## Osnovna pravila
- **NE** radite na main branch-u. Ako vam u terminalu piše `(main)` znači da ste u main branch-u.
- Svaki developer mora raditi na drugom branch-u.
- Main diram samo ja.

## 1. Kloniranje repozitorija
- Nemojte da vas vidim da ste skinuli .zip i da radite u tome.
- Klonirajte repozitorij, po mogućnosti negdje gdje ćete zapamtit gdje je, koristeći: `git clone https://github.com/SandiNovakov/riwa-gamelenz.git`.

## 2. Kreirajte novi branch
- Na novom branch-u vi možete raditi i commit-ati bez da vas drugi smetaju.
- **MEĐUTIM**, ni slučajno nemojte dirati i mjenjati datoteke koje se ne tiču vašeg branch-a jer ću onda ja morat to rješavat, a meni se to ne da.
- Novi branch radite kada na primjer radite novu stranicu.
- Komanda: `git checkout -b feature/login-page` će odmah napraviti novi branch po imenu koje zadate i prebaciti vas u njega. Standardno je koristiti "feature/ime-stvari-na-kojoj-radite".

## 3. Rad na branch-u
- kada radite na branch-u nemojte raditi `git push`, samo `git add . && git commit -m "poruka"`.

## 4. Kad ste gotovi
- Kada ste napravili vašu stranicu možete od jednom sve vaše commit-e poslati na github koristeći `git push origin feature/login-page`.
- Potom javite meni, pa ću dodati vaše promjene u main branch, i onda idemo dalje.

## 5. Sinkronizacija s main-om
- kad sam mergao vaše promjene u main, ja vama javljam i onda vi radite: `git checkout main`, `git pull origin main`, `git branch -d feature/login-page`. Nakon ovih komandi vi ste obrisali vašu granu lokalnu, povukli sve zadnje promjene s main grane, uključujući i vaše, te ste sinkronizirani s najzadnjim promjenama.

## 6. Zašto komplikujem
- Prošli semestar smo se dugo gubili zbog pull-anja i push-anja jer se main mjenjao svakih 15 sekundi, pa bi onda pri commit-anju svojih promjena prvo morali pull-ati, a to je znalo sjebat cijeli sistem. Nadam se da će ovim načinom rada to biti izbjegnuto.
