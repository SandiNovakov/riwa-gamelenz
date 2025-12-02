ALTER TABLE Igrica ADD PRIMARY KEY (ID_igrice);
ALTER TABLE Izdavac ADD PRIMARY KEY (ID_izdavaca);
ALTER TABLE Developer ADD PRIMARY KEY (ID_developera);
ALTER TABLE Korisnik ADD PRIMARY KEY (ID_korisnika);
ALTER TABLE Zanr ADD PRIMARY KEY (ID_zanra);
ALTER TABLE Igrica_Na_Listi ADD PRIMARY KEY (ID_korisnika, ID_igrice);
