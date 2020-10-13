/***************************************************
* JavaScript-Framework für interaktive Lernaufgaben
****************************************************
*
* V 2.6 (2017/03/11)
*
* Dieses Script wandelt Teile einer Website
* in interaktive Quiz-Aufgaben um. Dazu orientiert
* es sich an CSS-Klassen einzelner HTML-Elemente.
* Dadurch können interaktive Aufgaben auf Websiten
* in einem einfachen WYSIWYG-Editor erstellt
* werden. Die Interaktion geschieht dann mittels
* dieses nachgeladenen Javascripts.
*
* SOFTWARE LICENSE: LGPL
* (C) 2007 Felix Riesterer
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 2.1 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
*
* Felix Riesterer (Felix.Riesterer@gmx.net)
*/

window.Quiz = {

	triggerClass : "-quiz",	/* Variable, in der das Suffix der CSS-Klasse steht,
		auf die das Script reagiert, um eine Übung als solche zu erkennen und umzuwandeln.
		Es gibt derzeit folgende Übungen, deren Klassennamen wie folgt lauten:
		* Zuordnungsspiel
			-> class="zuordnungs-quiz"
		* Lückentext-Aufgabe
			-> class="lueckentext-quiz"
		* Memo
			-> class="memo-quiz"
		* Multiple Choice - Quiz
			-> class="multiplechoice-quiz"
		* Schüttelrätsel
			-> class="schuettel-quiz"
		* Kreuzworträtsel
			-> class="kreuzwort-quiz"
		*/

	poolClass : "daten-pool", // CSS-Klasse für das Element, in welchem die zu ziehenden Felder liegen
	feldClass : "feld", // CSS-Klasse für Datenfelder
	fertigClass : "geloest", // CSS-Klasse für gelöstes Quiz
	bewertungsClass : "quiz-bewertung", // CSS-Klasse für den Textabsatz mit den Bewertungsergebnissen
	highlightClass : "anvisiert", // CSS-Klasse für das Ziel-Highlighting
	highlightElm : null, // hier steht später eine Referenz auf das HTML-Element, welches gerade als potenzielles Ziel anvisiert wird
	codeTabelle : false, // wird später durch ein nachgeladenes Script mit einem Objekt befüllt
	draggableClass : "quiz-beweglich", // CSS-Klasse, die ein Element für Drag&Drop freigibt, damit es beweglich wird.
	draggedClass : "quiz-gezogen", // CSS-Klasse, wenn ein Element gerade bewegt wird.
	dragMode : false, // entscheidet, ob ein Element bei onmousedown gezogen werden soll, oder nicht
	dragElm : null, // hier steht später eine Referenz auf das HTML-Element in dem der mousedown stattfand
	dragElmOldVisibility : "", // hier steht später der originale Wert des gezogenen Elements (wird für's Highlighten verändert)

	lastCoords : {
		// wird später mit den Mauskoordinaten überschrieben werden
		left : 0,
		top : 0
	},

	codeTabelle : codeTabelle = {
		A : new Array(
			'\u0041', // a
			'\u0061', // A
			'\u00c0', // À
			'\u00c1', // Á
			'\u00c2', // Â
			'\u00c3', // Ã
			'\u00c5', // Å
			'\u00e0', // à
			'\u00e1', // á
			'\u00e2', // â
			'\u00e3', // ã
			'\u00e5' // å
		),
		AE : new Array(
			'\u00c4', // Ä
			'\u00c6', // Æ
			'\u00e4', // ä
			'\u00e6' // æ
		),
		B : new Array(
			'\u0042', // B
			'\u0062' // b
		),
		C : new Array(
			'\u0043', // C
			'\u0063', // c
			'\u00c7', // Ç
			'\u00e7' // ç
		),
		D : new Array(
			'\u0044', // D
			'\u0064' // d
		),
		E : new Array(
			'\u0045', // E
			'\u0065', // e
			'\u00c8', // È
			'\u00c9', // É
			'\u00ca', // Ê
			'\u00cb', // Ë
			'\u00e8', // è
			'\u00e9', // é
			'\u00ea', // ê
			'\u00eb' // ë
		),
		F : new Array(
			'\u0046', // F
			'\u0066' // f
		),
		G : new Array(
			'\u0047', // G
			'\u0067' // g
		),
		H : new Array(
			'\u0048', // H
			'\u0068' // h
		),
		I : new Array(
			'\u0049', // I
			'\u0069', // i
			'\u00cc', // Ì
			'\u00cd', // Í
			'\u00ce', // Î
			'\u00cf', // Ï
			'\u00ec', // ì
			'\u00ed', // í
			'\u00ee', // î
			'\u00ef' // ï
		),
		J : new Array(
			'\u004a', // J
			'\u006a' // j
		),
		K : new Array(
			'\u004b', // K
			'\u006b' // k
		),
		L : new Array(
			'\u004c', // L
			'\u006c' // l
		),
		M : new Array(
			'\u004d', // M
			'\u006d' // m
		),
		N : new Array(
			'\u004e', // N
			'\u006e', // n
			'\u00d1', // Ñ
			'\u00f1' // ñ
		),
		O : new Array(
			'\u004f', // O
			'\u006f', // o
			'\u00d2', // Ò
			'\u00d3', // Ó
			'\u00d4', // Ô
			'\u00d5', // Õ
			'\u00f2', // ò
			'\u00f3', // ó
			'\u00f4', // ô
			'\u00f5' // õ
		),
		OE : new Array(
			'\u00d6', // Ö
			'\u00f6' // ö
		),
		P : new Array(
			'\u0050', // P
			'\u0070' // p
		),
		Q : new Array(
			'\u0051', // Q
			'\u0071' // q
		),
		R : new Array(
			'\u0052', // R
			'\u0072' // r
		),
		S : new Array(
			'\u0053', // S
			'\u0073' // s
		),
		SS : new Array(
			'\u00df' // ß
		),
		T : new Array(
			'\u0054', // T
			'\u0074' // t
		),
		U : new Array(
			'\u0055', // U
			'\u0075', // u
			'\u00d9', // Ù
			'\u00da', // Ú
			'\u00db', // Û
			'\u00f9', // ù
			'\u00fa', // ú
			'\u00fb' // û
		),
		UE : new Array(
			'\u00dc', // Ü
			'\u00fc' // ü
		),
		V : new Array(
			'\u0056', // V
			'\u0076' // v
		),
		W : new Array(
			'\u0057', // W
			'\u0077' // w
		),
		X : new Array(
			'\u0058', // X
			'\u0078' // x
		),
		Y : new Array(
			'\u0059', // Y
			'\u0079', // y
			'\u00dd', // Ý
			'\u00fd' // ý
		),
		Z : new Array(
			'\u005a', // Z
			'\u007a' // z
		)
	},

	meldungen : {
		// deutsche Meldungen (Voreinstellung)
		de : {
			pruefen : 'pr\u00fcfen!',
			lob1 : 'Ausgezeichnet!',
			lob2 : 'Gut gemacht!',
			lob3 : 'Das war nicht schlecht!',
			ergebnis1 : 'Die Aufgabe wurde gleich beim ersten Versuch erfolgreich gel\u00f6st!',
			ergebnis2 : 'Die Aufgabe wurde nach nur zwei Versuchen erfolgreich gel\u00f6st!',
			ergebnis3 : 'Die Aufgabe wurde nach %n Versuchen erfolgreich gel\u00f6st!',
			// memo-quiz - Es können auch Triplets, Quartette und mehr gefunden werden müssen
			alleGefunden : 'Alle Sets gefunden!',
			erneut : 'Wie w\u00e4r\'s mit einer neuen Runde?',
			// Multiple-Choice-Quiz
			ergebnisProzent : 'Die Antworten sind zu %n% richtig.',
			// Kreuzworträtsel
			senkrecht : 'Senkrecht',
			waagrecht : 'Waagrecht',
			eintragen : 'eintragen',
			eingabehinweis : 'Benutzen Sie zur Eingabe die Tastatur. Eventuell m\u00fcssen sie zuerst ein Eingabefeld durch Anklicken aktivieren.',
			// Buchstabenraten-Quiz
			eingabehinweis_buchstabenraten : 'Benutzen Sie die Tastatur zur Eingabe! Eventuell m\u00fcssen Sie erst in das Quiz klicken, um es zu aktivieren.',
			quizStarten : 'Quiz starten.',
			gerateneBuchstaben : 'Bereits geratene Buchstaben',
			erkannteWoerter : 'Erkannte W\u00f6rter',
			quizEnde : 'Quiz ist zuende.'
		},

		// englische Meldungen
		en : {
			pruefen : 'check it!',
			lob1 : 'Brilliant!',
			lob2 : 'Well done!',
			lob3 : 'That was nice!',
			ergebnis1 : 'You solved everything on your first try!',
			ergebnis2 : 'You solved everything with only two tries!',
			ergebnis3 : 'You solved everything after trying %n times!',
			// memo-quiz - Es können auch Triplets, Quartette und mehr gefunden werden müssen
			alleGefunden : 'You\'ve found all sets!',
			erneut : 'How about another round?',
			// Multiple-Choice-Quiz
			ergebnisProzent : 'The answers are %n% correct.',
			// Kreuzworträtsel
			senkrecht : 'Vertical',
			waagrecht : 'Horizontal',
			eintragen : 'fill in',
			eingabehinweis : 'Use the keyboard to enter letters. You may need to first activate a box by clicking it.',
			// Buchstabenraten-Quiz
			eingabehinweis_buchstabenraten : 'Use the keyboard to enter letters. You may need to first click somewhere into this quiz in oder to activate it.',
			quizStarten : 'Start quiz.',
			gerateneBuchstaben : 'Already Guessed Characters',
			erkannteWoerter : 'Found Words',
			quizEnde : 'Quiz is over.'
		},

		// spanische Meldungen; mit dankenswerter Unterstützung von Frau Ulrike Weinmann
		es : {
			pruefen : '\u00a1Chequear!',
			lob1 : '\u00a1Muy bien hecho!',
			lob2 : '\u00a1Bien hecho!',
			lob3 : '\u00a1Correcto!',
			ergebnis1 : '\u00a1Resolviste el ejercicio al primer intento!',
			ergebnis2 : '\u00a1Resolviste el ejercicio al segundo intento!',
			ergebnis3 : 'Intentaste resolver el ejercicio %n veces y \u00a1lo lograste!',
			// memo-quiz - Es können auch Triplets, Quartette und mehr gefunden werden müssen
			alleGefunden : '\u00a1Encontraste todos los juegos!',
			erneut : '\u00bfOtra vez?',
			// Multiple-Choice-Quiz
			ergebnisProzent : 'Porcentaje de respuestas correctas: %n%.',
			// Kreuzworträtsel
			senkrecht : 'Vertical',
			waagrecht : 'Horizontal',
			eintragen : 'llenar',
			eingabehinweis : 'Usa el teclado para entrar letras. Quiz\u00e1s tienes que hacer clic en una caja primero para activ\u00e1rla.',
			// Buchstabenraten-Quiz
			eingabehinweis_buchstabenraten : 'Usa el teclado para entrar letras. Quiz\u00e1s tienes que hacer clic en el quiz primero para activ\u00e1rla.',
			quizStarten : 'Empezar quiz.',
			gerateneBuchstaben : 'Letras ya probadas',
			erkannteWoerter : 'Palabras encontradas',
			quizEnde : 'Fin de juego'
		},

		// französische Meldungen; mit dankenswerter Unterstützung von Herrn Otto Ebert
		fr : {
			pruefen : 'verifier!',
			lob1 : 'Excellent! Super!',
			lob2 : 'Bien fait!',
			lob3 : 'Ce n\'\u00e9tait pas mal',
			ergebnis1 : 'Ton essai \u00e9tait tout de suite un succ\u00e8s.',
			ergebnis2 : 'Tu as r\u00e9soulu le devoir apr\u00e8s deux tentatives seulement!',
			ergebnis3 : 'Tu as r\u00e9soulu le devoir apr\u00e8s %n tentatives.',
			// memo-quiz - Es können auch Triplets, Quartette und mehr gefunden werden müssen
			alleGefunden : 'Tu as trouv\u00e9 tous les "sets".',
			erneut : 'Alors tu veux recommencer?',
			// Multiple-Choice-Quiz
			ergebnisProzent : 'Les r\u00e9ponses sont %n% correctes.',
			// Kreuzworträtsel
			senkrecht : 'V\u00e9rtical',
			waagrecht : 'Horizontal',
			eintragen : 'inscrire',
			eingabehinweis : 'Utilisez le clavier pour inscrire des lettres. Vous devez probablement d\'abord activer une bo\u00eete en le claquant.',
			// Buchstabenraten-Quiz
			eingabehinweis_buchstabenraten : 'Utilisez le clavier pour inscrire des lettres. Vous devez probablement d\'abord activer le quiz en le claquant.',
			quizStarten : 'Commencer le quiz.',
			gerateneBuchstaben : 'Lettres d\u00e9j\u00e0 essay\u00e9es',
			erkannteWoerter : 'Mots trouv\u00e9s',
			quizEnde : 'Quiz est finis.'
		},

		// lateinische Meldungen; mit dankenswerter Unterstützung von Herrn Ralf Altgeld und Frau Ulrike Weinmann
		la : {
			pruefen : 'probare',
			lob1 : 'optime!',
			lob2 : 'bene!',
			lob3 : 'Id non male fecisti.',
			ergebnis1 : 'Pensum statim in primo conatu feliciter absolutum est!',
			ergebnis2 : 'Pensum cam post duos conatus feliciter absolutum est.',
			ergebnis3 : 'Pensum cam post %n conatus feliciter absolutum est.',
			// memo-quiz - Es können auch Triplets, Quartette und mehr gefunden werden müssen
			alleGefunden : 'Omnes partes repperisti.',
			erneut : 'Ludum novum vis?',
			// Multiple-Choice-Quiz
			ergebnisProzent : '%n% centesimae responsorum rectae sunt.',
			// Kreuzworträtsel
			senkrecht : 'perpendiculariter',
			waagrecht : 'directe',
			eintragen : 'complere',
			eingabehinweis : 'Utere clavibus ad verba scribenda. Fortasse tibi capsa eligenda est.',
			// Buchstabenraten-Quiz
			eingabehinweis_buchstabenraten : 'Utere clavibus ad verba scribenda. Fortasse tibi aenigma eligendum est.',
			quizStarten : 'Incipere aenigma.',
			gerateneBuchstaben : 'Litterae iam temptatae',
			erkannteWoerter : 'Verba iam reperta',
			quizEnde : 'Factum est.'
		},

		// italienische Meldungen; mit dankenswerter Unterstützung von Herrn Ihor Bilaniuk
		it : {
			pruefen : 'controllare!',
			lob1 : 'Ottimo!',
			lob2 : 'Benissimo!',
			lob3 : 'Bene!',
			ergebnis1 : 'Il compito \u00e8 stato risolto al primo passo!',
			ergebnis2 : 'Il compito \u00e8 stato risolto dopo la seconda prova!',
			ergebnis3 : 'Il compito \u00e8 stato risolto dopo %n prove.',
			// memo-quiz - Es können auch Triplets, Quartette und mehr gefunden werden müssen
			alleGefunden : 'Tutti i sets sono stati risolti!',
			erneut : 'Ancora una volta?',
			// Multiple-Choice-Quiz
			ergebnisProzent : 'Le tue risposte sono il %n per cento giuste.',
			// Kreuzworträtsel
			senkrecht : 'Verticale',
			waagrecht : 'Orizontale',
			eintragen : 'inserire',
			eingabehinweis : 'Utilizzi la tastiera per entrare nelle lettere. Potete avere bisogno di in primo luogo di attivare una scatola scattandola.',
			// Buchstabenraten-Quiz
			eingabehinweis_buchstabenraten : 'Utilizzi la tastiera per entrare nelle lettere. Potete avere bisogno di in primo luogo di scattarti in qualche luogo in questo quiz per attivarlo.',
			quizStarten : 'Inizi il quiz.',
			gerateneBuchstaben : 'Lettere gi\u00e0 indovinate',
			erkannteWoerter : 'Parole trovate ',
			quizEnde : 'Il quiz \u00e8 sopra .'
		},

		// polnische Meldungen von Pitr Wójs www.merula.pl
		pl : {
			pruefen : 'Sprawdź!',
			lob1 : 'Celująco!',
			lob2 : 'Bardzo dobrze!',
			lob3 : 'Nieźle!',
			ergebnis1 : 'Zadanie rozwiązałaś/łeś poprawnie za pierwszym razem!',
			ergebnis2 : 'Zadanie rozwiązałaś/łeś poprawnie za drugim razem!',
			ergebnis3 : 'Zadanie zostało rozwiązane poprawnie po %n próbach !',
			// memo-quiz - Es können auch Triplets, Quartette und mehr gefunden werden müssen
			alleGefunden : 'Znalazłaś/łeś wszystkie pary!',
			erneut : 'Co powiesz na drugą rundę? Spróbuj jeszcze raz!',
			// Multiple-Choice-Quiz
			ergebnisProzent : 'Odpowiedzi są poprawne w %n procentach.',
			// Kreuzworträtsel
			senkrecht : 'Pionowo',
			waagrecht : 'Poziomo',
			eintragen : 'Wpisz',
			eingabehinweis : 'Aby wpisać rozwiązanie użyj klawiatury. Kliknij pole, aby wprowadzić text!',
			// Buchstabenraten-Quiz
			eingabehinweis_buchstabenraten : 'Aby wpisać rozwiązanie użyj klawiatury. Kliknij pole, aby wprowadzić text!',
			quizStarten : 'Start quizu.',
			gerateneBuchstaben : 'Odgadnięte litery',
			erkannteWoerter : 'Rozpoznane słówka',
			quizEnde : 'Koniec quizu.'
		}
	},

	// Anzahl mouseover-Events, nach denen das Drag-Element unsichtbar geschaltet wird (reduziert das Flimmern beim Draggen)
	visibilityCountDefault : 5,

	// Hier findet später der Countdown statt, um das Drag-Element nicht bei jedem mouseover-Event unsichtbar zu schalten
	visibilityCount : 0,

	// Platzhalter für Eventhandler
	oldDocOnMouseMove : "leer",
	oldDocOnMouseOver : "leer",
	oldDocOnMouseUp : "leer",
	oldDocOnKeyUp : "leer",

	// Alle Quizze auf einer Seite werden hier beim Initialisieren abgespeichert
	alleQuizze : new Object(),

	// Das gerade benutze Quiz
	aktivesQuiz : null,

	domCreate : function (params) {
		var el, p;
		/* "params" ist ein Objekt mit folgender Struktur:
			{ 	tagName : "p", // z.B. für <p>
				text : "einfach ein Text" // als Kind-Textknoten des Elements
				... // weitere (native) Eigenschaften (wie id, className etc.)
			} */
		if (params.tagName && params.tagName.match(/[a-z]/)) {
			el = document.createElement(params.tagName);

			for (p in params) {
				if (p.match(/^text/i)) {
					el.appendChild(document.createTextNode(params[p]));
				} else {
					if (!p.match(/^tagname$/i)) {
						el[p] = params[p];
					}
				}
			}
		}

		return el;
	},

	domSelect : null, // Hier steht später eine Referenz auf die Sizzle-Engine

	each : function(o, cb, s) {
		// Die each-Methode wurde aus dem TinyMCE-Projekt (von Moxiecode.com) entnommen.
		var n, l;

		if (!o)
			return 0;

		s = s || o;

		if (o.length !== undefined) {
			// Indexed arrays, needed for Safari
			for (n=0, l = o.length; n < l; n++) {
				if (cb.call(s, o[n], n, o) === false)
					return 0;
			}
		} else {
			// Hashtables
			for (n in o) {
				if (o.hasOwnProperty(n)) {
					if (cb.call(s, o[n], n, o) === false)
						return 0;
				}
			}
		}

		return 1;
	},

	init : function () {
		// baseURL herausfinden
		var q = this;

		document.addEventListener("DOMContentLoaded", function () { q.initQuizze(); });

		q.each(document.getElementsByTagName("script"), function (s) {

			if (s.src && s.src.match(/\/quiz.js$/)) {
				q.baseURL = s.src.substr(0, s.src.lastIndexOf("/") + 1);
			}
		});

		/* Die Initialisierung könnte mehrfach benötigt werden, die folgenden Umleitungen
			dürfen aber nur einmal gemacht werden! */
		if (q.oldDocOnMouseMove == "leer") {
			q.oldDocOnMouseMove = document.onmousemove;

			document.onmousemove = function (e) {
				if (typeof(q.oldDocOnMouseMove) == "function") {
					q.oldDocOnMouseMove(e);
				}

				q.whileMove(e);
			}
            document.addEventListener("touchstart",function(e){q.touchStart(e)});
            document.addEventListener("touchmove",function(e){q.whileMove(e)});
		}

		// OnMouseOver-Handler nur einmal eintragen
		if (q.oldDocOnMouseOver == "leer") {
			q.oldDocOnMouseOver = document.onmouseover;

			document.onmouseover = function (e) {
				if (typeof(q.oldDocOnMouseOver) == "function") {
					q.oldDocOnMouseOver(e);
				}

				q.einBlender(e);
			}
		}

		// OnMouseUp-Handler nur einmal eintragen
		if (q.oldDocOnMouseUp == "leer") {
			q.oldDocOnMouseUp = document.onmouseup;

			document.onmouseup = function (e) {
				if (typeof(q.oldDocOnMouseUp) == "function") {
					q.oldDocOnMouseUp(e);
				}

				q.each(q.alleQuizze, function (a) {
					if (a.element.onmouseup) {
						a.element.onmouseup(e);
					}
				});
			}
		}

		// OnKeyUp-Handler nur einmal eintragen
		if (q.oldDocOnKeyUp == "leer") {
			q.oldDocOnKeyUp = document.onkeyup;

			document.onkeyup = function (e) {
				if (typeof(q.oldDocOnKeyUp) == "function") {
					q.oldDocOnKeyUp(e);
				}

				q.each(q.alleQuizze, function (a) {
					if (a.element.onkeyup) {
						a.element.onkeyup(e);
					}
				});
			}
		}

		// Erweiterung für das native String-Objekt in JavaScript: trim()-Methode (wie in PHP verfügbar)
		if (typeof(new String().quizTrim) != "function") {
			String.prototype.quizTrim = function () {
				var l = new RegExp(
					"^[" + String.fromCharCode(32) + String.fromCharCode(160) + "\t\r\n]+",
					"g"
				);
				var r = new RegExp(
					"[" + String.fromCharCode(32) + String.fromCharCode(160) + "\t\r\n]+$",
					"g"
				);

				return this.replace(l, "").replace(r, "");
			};
		}

		// Erweiterung für das native Array-Objekt: contains()-Methode
		if (![].contains) {
			Array.prototype.contains = function (el, strict) {
				var i;

				for (i = 0; i < this.length; i++) {
					if (this[i] === el) {
						return true;
					}
				}

				return false;
			};
		}

		// Erweiterung für das native Array-Objekt: shuffle()-Methode
		if (typeof(new Array().shuffle) != "function") {
			Array.prototype.shuffle = function () {
				var ar = [], zufall, i;

				while (this.length > 0) {
					zufall = Math.floor(Math.random() * this.length);

					ar.push(this[zufall]);

					this.splice(zufall, 1); // Element entfernen
				}

				for (i = 0; i < ar.length; i++) {
					this[i] = ar[i];
				}

				return this;
			};
		}
	},
    removeAllListeners : function(t) {
        // Eventhandler entfernen
        t.element.removeEventListener("mousedown", this.startDrag);
        t.element.removeEventListener("mouseup", this.stopDrag);
        // touch devices
        t.element.removeEventListener("touchstart", this.startDrag);
        t.element.removeEventListener("touchend", this.stopDrag);
        t.element.removeEventListener("touchcancel", this.stopDrag);
    },
    addAllListeners : function(t) {
        // Eventhandler für bewegliche Felder einrichten
        t.element.addEventListener("mousedown", this.startDrag);
        t.element.addEventListener("mouseup", this.stopDrag);
        // touch devices
        t.element.addEventListener("touchstart", this.startDrag);
        t.element.addEventListener("touchend", this.stopDrag);
        t.element.addEventListener("touchcancel", this.stopDrag);
    },

/*
=================
 Quiz - Funktionen
=================
 */


	/* Diese Funktion erzeugt ein Zuordnungs-Quiz. Dazu braucht sie eine Tabelle innerhalb eines
	Elternelements mit dem CSS-Klassen-Präfix "matching", z.B. "matching-quiz", wenn "-quiz"
	das Suffix der Quiz.triggerClass ist.
	Die Tabelle mit den Daten enthält Spalten (ohne <th>!), in denen die Werte stehen. */

	zuordnungsQuiz : function (div) {
		var q = this,
			i, tabelle;

		var quiz = {
			// Objekt-Gestalt eines Zuordnungs-Quizzes
			name : "Quiz-x", // Platzhalter - hier steht später etwas anderes.
			typ : "Zuordnungs-Quiz",
			spielModus : "paarweise", // entweder paarweise oder gruppenweise Zuordnungen
			loesungsClass : "loesungs-paar",
			element : div, // Referenz auf das DIV-Element, in welchem sich das Quiz befindet
			daten : new Array(), // Hier stehen später Wertegruppen (in Arrays).
			felder : new Array(), // Hier stehen später Referenzen auf SPAN-Elemente
			pool : q.domCreate({
				tagName : "p",
				className : q.poolClass
			}),
			auswertungsButton : null, // Hier steht später das HTML-Element des Auswertungs-Buttons.
			versuche : 0, // Speichert die Anzahl Versuche, die für die Lösung gebraucht wurden.
			sprache : (div.lang && div.lang != "") ? div.lang : "de", // deutsche Meldungen als Voreinstellung

			// Funktion zum Auswerten der Drag&Drop-Aktionen des Benutzers
			dragNDropAuswerten : function (element, ziel) {
				var t = this,
					vorgaenger, test;

				// Element einpflanzen
				element.parentNode.removeChild(element);
				ziel.appendChild(element);
				test = q.domSelect("."+q.draggableClass, ziel);

				// bei paarweise: War bereits ein Element hier eingefügt? -> Zurück in den Pool damit!
				if (t.spielModus == "paarweise" && test.length > 1) {
					vorgaenger = ziel.removeChild(test[0]);
					t.pool.appendChild(vorgaenger);
				}

				// Auswertungsbutton entfernen, falls vorhanden
				if (t.auswertungsButton.parentNode) {
					t.auswertungsButton.parentNode.removeChild(t.auswertungsButton);
				}

				// letztes Element verwendet -> Auswertungs-Button anbieten
				if (q.domSelect("."+q.draggableClass, t.pool).length < 1) {
					t.pool.appendChild(t.auswertungsButton);
				}
			},

			// Funktion zum Auswerten der Zuordnungen
			auswerten : function () {
				var t = this,
					loesungen = q.domSelect("."+t.loesungsClass, t.element),
					test;

				// Anzahl Lösungsversuche um eins erhöhen
				t.versuche++;

				// Zuordnungen einzeln überprüfen
				q.each(loesungen, function (l) {
					var gruppe = l.getElementsByTagName("span"),
						test = new RegExp(
							"^" + gruppe[0].id.substring(0, gruppe[0].id.lastIndexOf("_"))
						);

					// Stimmen die IDs bis auf ihre letzte Zahl überein?
					q.each(gruppe, function (g) {
						if (g && !g.id.match(test)) {
							// Nein! Element zurück in den Pool!
							t.pool.appendChild(g);
						}
					});
				});

				// Auswertungsbutton entfernen, falls vorhanden
				if (t.auswertungsButton.parentNode) {
					t.auswertungsButton.parentNode.removeChild(t.auswertungsButton);
				}

				// Sind keine Felder mehr im Pool? -> Quiz erfolgreich gelöst!
				if (q.domSelect("span", t.pool).length < 1) {
					q.removeAllListeners(t);

					t.solved = true;
					t.element.className += " "+q.fertigClass;
					t.pool.parentNode.removeChild(t.pool);

					// Bewegungscursor entfernen
					loesungen = q.domSelect("."+q.draggableClass, t.element);
					test = new RegExp(" ?" + q.draggableClass);

					q.each(loesungen, function (l) {
						l.className = l.className.replace(test, "");
						l.style.cursor = "";
					});

					// Erfolgsmeldung ausgeben
					t.element.appendChild(q.domCreate({
						tagName : "p",
						className : q.bewertungsClass,
						text : q.meldungen[t.sprache]["lob" + (t.versuche > 2 ? 3 : t.versuche)]
							+ " "
							+ q.meldungen[t.sprache][
								"ergebnis" + (t.versuche > 2 ? 3 : t.versuche)
							].replace(/%n/i, t.versuche)
					}));
				}
			},
			// Funktion zum Mischen und Austeilen der Wörter
			init : function () {
				var t = this,
					loesung, feld, i, j, gruppe, benutzte, zufall, gemischte;

				// Spracheinstellungen auf deutsch zurück korrigieren, falls entsprechende Sprachdaten fehlen
				if (!q.meldungen[t.sprache]) {
					t.sprache = "de";
				}

				/* Jeder Wert aus den Werten der Daten wird zu einem SPAN-Element ("Feld") und erhält eine ID.
				Die ID eines solchen Feldes enthält den Namen des Quizes, die laufende Nummer der Wertegruppe, der er entstammt
				und anschließend die laufende Nummer innerhalb der Wertegruppe. Dadurch kann später die Zuordnung ausgewertet werden,
				da die ID bis auf die letzte Nummer übereinstimmen muss, wenn die Zuordnung stimmen soll. */

				t.element.appendChild(t.pool); // ins Dokument einfügen

				// Wertegruppen durchgehen, Felder erzeugen
				for (i = 0; i < t.daten.length; i++) {
					// Jedes Datum besteht aus einem Array, das mindestens zwei Felder besitzt.
					if (t.daten[i].length > 2) {
						t.spielModus = "gruppenweise";
					}

					for (j = 0; j < t.daten[i].length; j++) {
						t.felder.push(q.domCreate({
							tagName : "span",
							id : t.name + "_" + i + "_" + j,
							className : q.feldClass,
							innerHTML : t.daten[i][j]
						}));
					}
				}

				// Felder mischen und verteilen!
				benutzte = new Array(); // Hier werden bereits benutzte Gruppen markiert
				gemischte = new Array(); // Felder einer Gruppe die in den Pool sollen, hier eintragen

				for (j = 0; j < t.daten.length; j++) {
					// Lösungs-Absatz erzeugen
					loesung = q.domCreate({
						tagName: "p",
						className : t.loesungsClass
					});

					// Gruppe auswählen
					gruppe = true; // Wertegruppe schon verwendet?
					while (gruppe) {
						zufall = Math.floor(Math.random() * t.daten.length);
						gruppe = benutzte[zufall]; // prüfen auf "bereits verwendet"
					}

					benutzte[zufall] = true; // Gruppe jetzt als verwendet eintragen.

					/*
						Je nach Spiel-Modus ("paarweise" oder "gruppenweise") darf die inhaltliche Vorbelegung des
						Lösungsabsatzes nicht zufällig belegt werden. Bei paarweisen Zuordnungen ist immer "logisch",
						welches Feld aus dem Pool dem bereits im Lösungsabsatz stehenden zugeordnet werden muss. Bei
						gruppenweisen Zuordnungen muss dort aber eine Art Oberbegriff stehen, der dann der ersten
						Tabellenzelle der Vorgaben entspricht!
					*/

					feld = 0; // erstes Feld einer Gruppe
					if (t.spielModus == "paarweise") {
						// Feld im Lösungsabsatz zufällig auswählen.
						feld = Math.floor(Math.random() * 2);
					}

					/* Feld aus der Liste der erstellten Felder ermitteln und in Lösungsabsatz schreiben.
						Restliche Felder der Gruppe in den Pool schreiben. */
					for (i = 0; i < t.felder.length; i++) {
						if (t.felder[i].id.match(new RegExp(t.name + "_" + zufall + "_"))) {
							// Feld aus dieser Gruppe ermittelt!
							if (t.felder[i].id.match(new RegExp(t.name + "_" + zufall + "_" + feld))) {
								// Feld in den Lösungsabsatz eintragen
								t.felder[i].style.cursor = "";
								loesung.appendChild(t.felder[i]);
								t.pool.parentNode.insertBefore(loesung, t.pool);

							} else {
								// Feld zu den gemischten einordnen
								gemischte.push(t.felder[i]);
							}
						}
					}
				}

				// zuzuordnende Felder vermischt ausgeben
				gemischte.shuffle();
				q.each(gemischte, function (f) {
					t.pool.appendChild(f);
					f.className += " "+q.draggableClass;
					f.style.cursor = "move";
				});

				// ID für das umgebende DIV-Element vergeben
				t.element.id = t.name;

				q.addAllListeners(t);
				// Auswertungs-Button erzeugen
				t.auswertungsButton = q.domCreate({
					tagName : "span",
					className : "auswertungs-button",
					text : q.meldungen[t.sprache].pruefen,
					onclick : function (e) {
						t.auswerten();
					}
				});
			}
		};

		// Laufende Nummer ermitteln -> Quiz-Name wird "quiz" + laufende Nummer
		i = 0;
		q.each(q.alleQuizze, function() {
			i++;
		});
		quiz.name = "quiz" + i;

		// Gibt es Quiz-Daten?
		tabelle = q.domSelect("table", div);

		if (tabelle.length < 1) {
			return false;
		}

		// Daten sind also vorhanden? -> Auswerten
		q.each(tabelle[0].getElementsByTagName("tr"), function (tr) {
			var gefunden = new Array(); // Eine Wertegruppe anlegen

			// Tabellenzeilen nach Daten durchforsten
			q.each(tr.getElementsByTagName("td"), function (td) {
				// Tabellenzellen nach Daten durchforsten
				var k = false; // normalisierter Zelleninhalt

				if (td.innerHTML && td.innerHTML != "") {
					k = td.innerHTML.replace(/&nbsp;/, " ").quizTrim();
				}

				if (k && k != "") {
					gefunden.push(k);
				}
			});

			// Falls Wertegruppe mindestens ein Wertepaar enthält, dieses den Daten hinzufügen.
			if (gefunden.length > 1) {
				quiz.daten.push(gefunden);
			}
		});

		// Keine brauchbare Daten? -> Verwerfen!
		if (quiz.daten.length < 1) {
			return false;
		}

		// Quiz in die Liste aufnehmen und initialisieren
		q.alleQuizze[quiz.name] = quiz;
		tabelle[0].parentNode.removeChild(tabelle[0]);
		quiz.element.quiz = quiz;
		quiz.init();

		return true;
	},


	/* Diese Funktion erzeugt ein Lückentext-Quiz. Dazu braucht sie ein Elternelement mit dem
	CSS-Klassen-Präfix "lueckentext", z.B. "lueckentext-quiz", wenn "-quiz" das Suffix der Quiz.triggerClass ist.
	Die mit <strong>, <em>, <b> oder <i> ausgezeichneten Textstellen werden durch Drag&Drop-Felder ersetzt. Sollten
	Lösungshinweise in Klammern stehen, so werden die Textstellen durch Eingabefelder ersetzt. */

	lueckentextQuiz : function (div) {
		var q = this,
			ids = 0,
			i, daten;

		var quiz = {
			// Objekt-Gestalt eines Lückentext-Quizzes
			name : "Quiz-x", // Platzhalter - hier steht später etwas anderes.
			typ : "Lückentext-Quiz",
			loesungsClass : "luecke", // Für die manuellen Texteingaben kommt noch "_i" hinzu!
			lueckenPlatzhalter : "", // Leerzeichen als Platzhalter für Lücken
			element : div, // Referenz auf das DIV-Element, in welchem sich das Quiz befindet
			felder : new Array(), // Hier stehen später Referenzen auf SPAN-Elemente
			pool : q.domCreate({
				tagName : "p",
				className: q.poolClass
			}),
			inputs : new Array(), // Hier stehen später Referenzen auf die Text-Eingabefelder und ihre Lösungen
			auswertungsButton : null, // Hier steht später das HTML-Element des Auswertungs-Buttons.
			versuche : 0, // Speichert die Anzahl Versuche, die für die Lösung gebraucht wurden.
			sprache : (div.lang && div.lang != "") ? div.lang : "de", // deutsche Meldungen als Voreinstellung

			// Funktion zum Auswerten der Drag&Drop-Aktionen des Benutzers
			dragNDropAuswerten : function (element, ziel) {
				var t = this,
					vorgaenger, test, ok, i;

				if (element && ziel) {
					// Element bewegen
					test = new RegExp(t.loesungsClass, "");

					// Zuerst überflüssige Leerzeichen im Ziel-Element entfernen?
					if (ziel.className.match(test)
						&& q.domSelect("."+q.draggableClass, ziel).length < 1
					) {
						ziel.innerHTML = ""; // Leerzeichen in einer Lücke zuvor entfernen
					}

					// Bewegliches Element einpflanzen
					vorgaenger = element.parentNode;
					ziel.appendChild(element);

					// Entleertes Element mit Leerzeichen auffüllen?
					if (vorgaenger.className.match(test)
						&& q.domSelect("."+q.draggableClass, vorgaenger).length < 1
					) {
						// Leerzeichen in einer Lücke als Platzhalter einfügen
						vorgaenger.innerHTML = t.lueckenPlatzhalter;
					}

					// War bereits ein Element hier eingefügt? -> Zurück in den Pool damit!
					test = q.domSelect("."+q.draggableClass, ziel);

					if (test.length > 1) {
						t.pool.appendChild(test[0]);
					}
				}

				// Auswertungsbutton entfernen, falls vorhanden
				if (t.auswertungsButton.parentNode) {
					t.auswertungsButton.parentNode.removeChild(t.auswertungsButton);
				}

				// Auswertungs-Button anbieten?
				if (q.domSelect("."+q.draggableClass, t.pool).length < 1) {
					// letztes Element verwendet -> Alle Eingabefelder ausgefüllt?
					ok = true; // Wir gehen jetzt einmal davon aus...

					q.each(t.element.getElementsByTagName("input"), function (i) {
						if (i.value == "") {
							ok = false; // Aha, ein Eingabefeld war leer!
						}
					});

					if (ok) {
						t.pool.appendChild(t.auswertungsButton);
					}
				}
			},

			// Funktion zum Auswerten der Lösungen
			auswerten : function () {
				var t = this,
					loesungen = new Array(),
					ok;

				// Anzahl Lösungsversuche um eins erhöhen
				t.versuche++;

				// Drag&Drop-Felder überprüfen
				loesungen = q.domSelect("."+t.loesungsClass, t.element);

				if (loesungen.length > 0) {
					// Es gibt Drag&Drop-Felder zu überprüfen...
					q.each(loesungen, function (l) {
						var test = new RegExp("^" + l.id.replace(/^([^_]+_\d+)\w+.*$/, "$1"), ""),
							element = q.domSelect("."+q.draggableClass, l)[0];

						if (!element.id.match(test)) {
							// Falsche Zuordnung! Zurück in den Pool damit!
							t.pool.appendChild(element);
							l.innerHTML = t.lueckenPlatzhalter;
						}
					});
				}

				// Eingabefelder überprüfen
				loesungen = q.domSelect("."+t.loesungsClass + "_i", t.element);
				ok = true; // Wir gehen einmal davon aus, dass alles richtig ist...

				q.each(loesungen, function (l) {
					q.each(t.inputs, function (i) {
						var element = q.domSelect("#"+l.id + "i")[0],
							richtig, test;

						if (element.id == q.domSelect("input", i.element)[0].id) {
							// Inhalt prüfen
							test = i.loesung.split("|");
							element.value = element.value.quizTrim();

							q.each(test, function (t) {
								if (element.value == t.quizTrim()) {
									richtig = true;
								}
							});

							if (!richtig) {
								ok = false; // Falsche Eingabe!
								element.value = "";
							}
						}
					});
				});

				// Auswertungsbutton entfernen
				t.auswertungsButton.parentNode.removeChild(t.auswertungsButton);

				// Sind alle Eingaben richtig und keine Felder mehr im Pool? -> Quiz erfolgreich gelöst!
				if (ok && q.domSelect("span", t.pool).length < 1) {
					// Eventhandler entfernen
					t.element.onmousedown = null;
					t.element.onmousemove = null;
					t.element.onmouseup = null;
					t.solved = true;
					t.element.className += " "+q.fertigClass;
					t.pool.parentNode.removeChild(t.pool);

					// Elementen die Beweglichkeit nehmen
					loesungen = q.domSelect("."+q.draggableClass, t.element);
					test = new RegExp(" ?" + q.draggableClass, "");

					q.each(loesungen, function (l) {
						l.className = l.className.replace(test);
						l.style.cursor = "";
					});

					// Eingabefelder durch gelöste Felder ersetzen
					loesungen = q.domSelect("."+t.loesungsClass + "_i", t.element);

					q.each(loesungen, function (l) {
						l.parentNode.insertBefore(q.domCreate({
							tagName : "span",
							className : t.loesungsClass,
							text : q.domSelect("#"+l.id+"i")[0].value
						}), l);
						l.parentNode.removeChild(l);
					});

					// Erfolgsmeldung ausgeben
					t.element.appendChild(q.domCreate({
						tagName : "p",
						className : q.bewertungsClass,
						text : q.meldungen[t.sprache]["lob" + (t.versuche > 2 ? 3 : t.versuche)]
							+ " "
							+ q.meldungen[t.sprache][
								"ergebnis" + (t.versuche > 2 ? 3 : t.versuche)
							].replace(/%n/i, t.versuche)
					}));
				}
			},

			// Funktion zum Erstellen der Lücken, Mischen und Austeilen der beweglichen Wörter, bzw Umwandeln der Wörter zu Engabefeldern
			init : function () {
				var t = this,
					input, felder, benutzte, zufall, luecke, test, i;

				// Spracheinstellungen auf deutsch zurück korrigieren, falls entsprechende Sprachdaten fehlen
				if (!q.meldungen[t.sprache]) {
					t.sprache = "de";
				}

				/* Jeder markierte Textabschnitt (zum Markieren dienen die Elemente <i>, <b>, <em> und <strong>) wird zu entweder
				einem beweglichen SPAN-Element ("Feld"), oder (wenn eine öffnende Klammer für Hilfsangaben enthalten sind)
				einem Input-Feld. Das markierende Element (also das <i>, <b> etc.) wird ersetzt durch ein <span>-Element mit der
				CSS_Klasse, die in quiz.loesungsClass definiert wurde.

				Beispiel1: <p>Eine Henne legt ein <i>Ei</i>.</p>
				wird zu
				<p>Eine Henne legt ein <span class="luecke" id="......"> nbsp; nbsp; nbsp; </span>.</p>
				->"Ei" wird zu <span id="quiz0_xb" class="beweglich">Ei</span> und landet im Pool.

				Beispiel2: <p>Eine Henne <b>legt (legen)</b> ein Ei.</p>
				wird zu
				<p>Eine Henne <span class="luecke"><input type="text" id="......" /></span> (legen) ein Ei.</p>

				Die ID eines solchen Feldes enthält den Namen des Quizes, die laufende Nummer des Wertepaares, dem er entstammt
				und entweder ein "a" oder ein "b". Dadurch kann später die Zuordnung ausgewertet werden, da die ID bis auf den
				letzten Buchstaben übereinstimmen muss, wenn die Zuordnung stimmen soll. */

				// Wenn es Drag&Drop-Felder gibt, dann wird ein Pool benötigt
				if (t.felder.length > 0 || t.inputs.length >0) {
					// Behälter für die beweglichen Teile ins Dokument einfügen
					t.element.appendChild(t.pool);

					// Felder vermischt im Pool ablegen und Lücken erzeugen
					t.felder.shuffle();

					q.each(t.felder, function (f) {
						t.pool.appendChild(f.element);

						luecke = q.domCreate({
							tagName: "span",
							text : t.lueckenPlatzhalter,
							id : f.element.id + "_" + t.loesungsClass,
							className : t.loesungsClass
						});

						// Lücke ins Dokument schreiben
						f.original.parentNode.insertBefore(luecke, f.original);
						f.original.parentNode.removeChild(f.original);
					});

					// Eventhandler für bewegliche Felder einrichten
					t.element.onmousedown = q.startDrag;
					t.element.onmouseover = q.highlight;
					t.element.onmouseup = q.stopDrag;

					q.each(q.domSelect("."+q.feldClass, t.pool), function (f) {
						f.className += " " + q.draggableClass;
						f.style.cursor = "move";
					});
				}

				// falls Eingabefelder vorhanden -> einbinden
				if (t.inputs.length > 0) {
					q.each(t.inputs, function (i) {
						if (typeof i != "function") {
							i.original.parentNode.insertBefore(i.element, i.original);
							i.original.parentNode.removeChild(i.original);
						}
					})
				}

				// ID für das umgebende DIV-Element vergeben
				t.element.id = t.name;


                q.addAllListeners(t);

				// Auswertungs-Button erzeugen
				t.auswertungsButton = q.domCreate({
					tagName : "span",
					className : "auswertungs-button",
					text : q.meldungen[t.sprache].pruefen,
					onclick : function (e) {
						t.auswerten();
					}
				});
			}
		};

		// Laufende Nummer ermitteln -> Quiz-Name wird "quiz" + laufende Nummer
		i = 0;
		q.each(q.alleQuizze, function () {
			i++;
		});

		quiz.name = "quiz" + i;

		// Gibt es Quiz-Daten?
		daten = {
			bolds : q.domSelect("b", div),
			italics : q.domSelect("i", div),
			strongs : q.domSelect("strong", div),
			ems : q.domSelect("em", div)
		}

		// keine potentiellen Daten gefunden? -> abbrechen!
		if (daten.bolds.length < 1
			&& daten.italics.length < 1
			&& daten.strongs.length < 1
			&& daten.ems.length < 1
		) {
			return false;
		}

		// Daten sind also vorhanden? -> Auswerten
		q.each(daten, function (tagType) {
			q.each(tagType, function (d) {
				var test = d.innerHTML.replace(/<\/a>/i, "").replace(/<a[^>]*>/i, "");

				if (test.match(/\(/)) {
					// Eingabefeld!
					test = q.domCreate({
						tagName : "span",
						className : quiz.loesungsClass + "_i",
						id : quiz.name + "_" + ids
					});

					test.innerHTML += d.innerHTML.replace(/^[^(]*(\(.*) *$/, "$1").replace(/ ?\(\)$/, "");

					test.insertBefore(q.domCreate({
						tagName : "input",
						type : "text",
						id : test.id + "i",
						onkeyup : function (e) { quiz.dragNDropAuswerten(); }
					}), test.firstChild);

					quiz.inputs.push({
						element : test,
						original : d,
						// Lösungsinhalt "säubern"
						loesung : d.innerHTML.replace(
								/[\t\r\n]/g, " "
							).replace(
								/^([^(]+).*$/, "$1"
							).replace(
								/(&nbsp; | &nbsp;)/, " "
							).replace(
								/ +/, " "
							).quizTrim()
					});

					ids++; // verwendete ID eintragen, damit keine doppelten IDs entstehen

				} else {
					// Drag&Drop-Feld!
					if (d.innerHTML != "") {
						// Feld ist nicht leer
						test = q.domCreate({
							tagName : "span",
							className : q.feldClass
						});

						test.innerHTML = d.innerHTML.replace(/^ *([^ ](.*[^ ])?) *$/, "$1");


						/* Gibt es bereits Felder mit identischem Inhalt?
							Deren IDs müssen bis auf die Buchstaben am Ende übereinstimmen! */
						q.each(quiz.felder, function (f) {
							if (typeof(f.element) != "undefined"
								&& f.element.innerHTML == test.innerHTML
							) {
								// ID übernehmen!
								test.id = f.element.id;
							}
						});

						if (test.id == "") {
							test.id = quiz.name + "_" + ids + "a";
							ids++;

						} else {
							// übernommene ID eines bereits existierenden Feldes ändern
							test.id = test.id.substr(0, test.id.length - 1)
								+ String.fromCharCode(test.id.charCodeAt(test.id.length - 1));
						}

						quiz.felder.push({
							element : test,
							original : d
						});
					}
				}
			});
		});

		// Keine brauchbare Daten? -> Verwerfen!
		i = 0;
		q.each(quiz.felder, function () {
			i++;
		});

		q.each(quiz.inputs, function () {
			i++;
		});

		if (i < 1) {
			return false;
		}

		// Quiz in die Liste aufnehmen und initialisieren
		q.alleQuizze[quiz.name] = quiz;
		quiz.element.quiz = quiz;
		quiz.init();

		return true;
	},


	/* Diese Funktion erzeugt ein memo-quiz. Dazu braucht sie eine Tabelle innerhalb eines Elternelementes
	mit dem CSS-Klassen-Präfix "memo", z.B. "memo-quiz", wenn "-quiz" das Suffix der Quiz.triggerClass ist.
	In der Tabelle stehen die Set-Daten: Die Anzahl an Spalten steht für die Anzahl der Felder pro Set, die Anzahl
	der Zeilen ist die Anzahl der Sets. */

	memoQuiz : function (div) {
		var q = this,
			i, j, test, daten, tabelle;

		var quiz = {
			// Objekt-Gestalt eines memo-quizzes
			name : "Quiz-x", // Platzhalter - hier steht später etwas anderes.
			typ : "memo-quiz",
			inhaltsClass : "feld-inhalt", // CSS-Klasse für den Inhalt eines Feldes
			aktivClass : "aktiv", // CSS-Klasse für ein aktiviertes Feld
			fertigClass : "fertig", // CSS-Klasse für ein Feld, das aussortiert wurde
			element : div, // Referenz auf das DIV-Element, in welchem sich das Quiz befindet
			angeklickt : null, // Referenz auf das angeklickte Element innerhalb des DIVs
			felder : new Array(), // Hier stehen später Referenzen auf SPAN-Elemente.
			pool : q.domCreate({
				tagName : "p",
				className : q.poolClass
			}),
			setGroesse : 2, // Anzahl der zu einem Set gehörenden Felder
			versuche : 0, // Speichert die Anzahl Versuche, die für die Lösung gebraucht wurden.
			sprache : (div.lang && div.lang != "") ? div.lang : "de", // deutsche Meldungen als Voreinstellung

			// Funktion zum Aufdecken eines Feldes (kommt über Eventhandler onclick)
			aufdecken : function (e) {
				var t = this;

				e = e || window.event;
				t.angeklickt = e.target || e.srcElement; // W3C DOM <-> IE

				// Nur bei Klick auf ein Feld (oder eines seiner Nachfahren-Elemente) reagieren!
				test = t.angeklickt;

				while (!test.className
					|| !test.className.match(new RegExp("(^|\\s)" + q.feldClass + "(\\s|$)"))
				) {
					test = test.parentNode;

					if (test == document.body) {
						return false;
					}
				}

				q.aktivesQuiz = t;
				t.angeklickt = test; // das angeklickte Feld abspeichern

				// Feld wurde angeklickt -> aufdecken?
				test = q.domSelect("."+t.aktivClass, t.element);

				if (test.length >= t.setGroesse) {
					// Nein, denn es sind schon alle Felder für ein Set aufgedeckt!
					return false;

				} else {
					// Das aktuelle Set ist noch nicht vollständig aufgedeckt...
					if (!t.angeklickt.className.match(new RegExp(
						"(^|\\s)" + t.aktivClass + "(\\s|$)", ""
					))) {
						// OK, Feld wurde noch nicht aufgedeckt. -> aufdecken
						t.angeklickt.className += " " + t.aktivClass;

						// eventuelle Markierungen aufheben (stört bei Bildern)
						try { window.getSelection().collapse(t.angeklickt, 0); }
						catch (e) { };

						try { document.selection.clear(); }
						catch (e) { };

						if (q.domSelect("."+t.aktivClass, t.element).length >= t.setGroesse) {
							// Alle Felder für ein Feld wurden aufgedeckt! -> auswerten
							window.setTimeout(function () { t.auswerten(); }, 1500);
						}
					}
				}
			},

			// Funktion zum Auswerten eines aufgedeckten Sets
			auswerten : function () {
				var t = this,
					i, ok, muster;

				// Anzahl Lösungsversuche um eins erhöhen
				t.versuche++;

				// aufgedeckte Felder ermitteln
				test = q.domSelect("."+t.aktivClass, t.element);

				// IDs der Felder vergleichen
				muster = new RegExp(test[0].id.replace(/^([^_]+_\d+).*$/, "$1"), ""); // ID des ersten Feldes ohne letzten Buchstaben
				ok = true; // Wir gehen von einer Übereinstimmung aus...
				q.each(test, function (i) {
					if (!i.id.match(muster)) {
						ok = false;
					}
				});

				// IDs haben übereingestimmt?
				muster = new RegExp(" ?" + t.aktivClass, "");
				q.each(test, function (i) {
					if (ok) {
						// Ja. -> aufgedekte Felder "entfernen"
						i.className = t.fertigClass;
					} else {
						// Nein! -> Felder wieder umdrehen!
						i.className = i.className.replace(muster, "");
					}
				});

				// Alle Felder abgeräumt?
				test = q.domSelect("."+Quiz.feldClass, this.element);
				if (test.length < 1) {

					// Gratulieren und nachfragen
					var nachfrage = q.meldungen[t.sprache]["lob" + (t.versuche > 2 ? 3 : t.versuche)]
						+ " "
						+ q.meldungen[t.sprache].alleGefunden
						+ "\n"
						+ q.meldungen[t.sprache]["ergebnis" + (t.versuche > 2 ? 3 : t.versuche)].replace(/%n/i, t.versuche)
						+ "\n"
						+ q.meldungen[t.sprache].erneut;

					if (confirm(
							q.meldungen[t.sprache]["lob" + (t.versuche > 2 ? 3 : t.versuche)]
							+ " "
							+ q.meldungen[t.sprache].alleGefunden
							+ "\n"
							+ q.meldungen[t.sprache][
								"ergebnis" + (t.versuche > 2 ? 3 : t.versuche)
							].replace(/%n/i, t.versuche)
							+ "\n"
							+ q.meldungen[t.sprache].erneut
					)) {
						test = q.domSelect("."+Quiz.poolClass, this.element);

						if (test.length > 0)
							test[0].parentNode.removeChild(test[0]);

						t.init(); // Quiz erneut starten

					} else {
						t.element.onmousedown = null;
						t.element.onmousemove = null;
						t.element.onmouseup = null;
						t.solved = true;
						t.element.className += " "+q.fertigClass;
					}
				}
			},

			// Funktion zum Mischen und Austeilen der Wörter
			init : function () {
				var t = this,
					sets = new Array(),
					i, zufall;

				// Spracheinstellungen auf deutsch zurück korrigieren, falls entsprechende Sprachdaten fehlen
				if (!q.meldungen[t.sprache]) {
					t.sprache = "de";
				}

				/* Jeder Wert aus den Set-Daten wird zu einem SPAN-Element ("Feld") und erhält eine ID.
				Die ID eines solchen Feldes enthält den Namen des Quizes, die laufende Nummer des Sets, dem das Feld entstammt
				und einen "laufenden Buchstaben". Dadurch kann später die Zuordnung ausgewertet werden, da die ID bis auf den
				letzten Buchstaben übereinstimmen muss, wenn die Zuordnung stimmen soll. */

				t.element.appendChild(t.pool); // ins Dokument einfügen

				// Felder vermischt in den Pool schreiben
				t.felder.shuffle();

				q.each(t.felder, function (f) {
					t.pool.appendChild(f.cloneNode(true));
				});

				// Elternelement vorbereiten
				t.element.onclick = function (e) { t.aufdecken(e); }; // Eventhandler vergeben
				t.element.id = t.name; // ID vergeben
				t.versuche = 0; // Anzahl Versuche zurücksetzen
			}
		}


		// Laufende Nummer ermitteln -> Quiz-Name wird "quiz" + laufende Nummer
		i = 0;
		q.each(q.alleQuizze, function () {
			i++;
		});
		quiz.name = "quiz" + i;

		// Gibt es Quiz-Daten?
		tabelle = q.domSelect("table", div);

		if (tabelle.length < 1) {
			// Keine Tabelle für Quiz-Daten gefunden! -> abbrechen
			return false;
		}

		// Daten sind also vorhanden? -> Auswerten
		test = q.domSelect("tr", tabelle[0]);

		// Tabellenzeilen nach Daten durchforsten
		for (i = 0; i < test.length; i++) {
			daten = q.domSelect("td", test[i]);

			if (daten.length > 1) {
				quiz.setGroesse = daten.length;

				for (j = 0; j < daten.length; j++) {
					// Feld abspeichern
					quiz.felder.push(q.domCreate({
						tagName : "span",
						className : q.feldClass,
						id : quiz.name + "_" + i + String.fromCharCode(j + 97)
					}));

					quiz.felder[quiz.felder.length -1].appendChild(q.domCreate({
						tagName : "span",
						className : quiz.inhaltsClass
					}));

					quiz.felder[quiz.felder.length -1].lastChild.innerHTML = daten[j].innerHTML;
				}
			}
		}

		// Keine brauchbare Daten? -> Verwerfen!
		i = 0;
		q.each(quiz.felder, function() {
			i++;
		});

		if (i < 1) {
			return false;
		}

		// Quiz in die Liste aufnehmen und initialisieren
		q.alleQuizze[quiz.name] = quiz;
		tabelle[0].parentNode.removeChild(tabelle[0]);
		quiz.element.quiz = quiz;
		quiz.init();

		return true;
	},


	/* Diese Funktion erzeugt ein Multiple Choice - Quiz. Dazu braucht sie Textabsätze innerhalb eines Elternelementes
	mit dem CSS-Klassen-Präfix "multiplechoice", z.B. "multiplechoice-quiz", wenn "-quiz" das Suffix der Quiz.triggerClass ist.
	In den Textabsätzen stehen die jeweiligen Quiz-Fragen, die Antworten stehen am Ende der Absätze in runden Klammern. Falsche
	Antworten haben innerhalb der Klammer gleich als erstes Zeichen ein Ausrufezeichen, richtige Antworten nicht.
	Textabsätze ohne Klammernpaar am Ende werden nicht als Quiz-Fragen interpretiert. */

	multiplechoiceQuiz : function (div) {
		var q = this,
			fragen, i;

		var quiz = {
			// Objekt-Gestalt eines Multiple Choice - Quizzes
			name : "Quiz-x", // Platzhalter - hier steht später etwas anderes.
			typ : "Multiple Choice - Quiz",
			loesungsClass : "quiz-antworten", // CSS-Klasse für das Elternelement mit den Antworten
			element : div, // Referenz auf das DIV-Element, in welchem sich das Quiz befindet
			fragen : new Array(), // Hier stehen später die Fragen zusammen mit ihren Antworten
			sprache : (div.lang && div.lang != "") ? div.lang : "de", // deutsche Meldungen als Voreinstellung

			// Funktion zum Auswerten eines aufgedeckten Sets
			auswerten : function () {
				var t = this,
					anzahl, test, richtigkeit;

				// Antwort-Blöcke ermitteln
				richtigkeit = 0; // Anzahl der gezählten Treffer
				anzahl = 0; // Anzahl der möglichen richtigen Antworten

				q.each(q.domSelect("."+t.loesungsClass, t.element), function(a) {
					// Jeden Antwortblock einzeln durchgehen
					var ok = 0; // Anzahl Treffer abzüglich falscher Treffer

					q.each(q.domSelect("input", a), function(i) {
						// <li>-Element ermitteln, um es später einzufärben
						var li = i.parentNode;

						while (!li.tagName || !li.tagName.match(/^li$/i)) {
							li = li.parentNode;
						}

						// Checkbox unveränderlich machen
						i.disabled = "disabled";

						if (i.id.match(/_f$/)) {
							// Aha, eine Falschantwort...
							if (i.checked) {
								// ... wurde fälschlicherweise angewählt!
								li.className = "falsch";
								ok--;
							}

						} else {
							// Aha, eine richtige Antwort...
							li.className = "richtig";
							anzahl++; // Anzahl der möglichen richtigen Antworten erhöhen

							if (i.checked) {
								// ...wurde korrekt angewählt
								ok++;
							}
						}
					});

					// keine negative Wertung für eine Antwort
					ok = ok < 0 ? 0 : ok;

					richtigkeit += ok; // richtige Treffer merken
				});

				richtigkeit = (anzahl > 0) ?
					Math.floor(richtigkeit / anzahl * 1000) / 10 // auf eine Zehntelstelle genau
					: 0;

				// Auswertung ins Dokument schreiben
				t.element.appendChild(q.domCreate({
					tagName : "p",
					className : q.bewertungsClass,
					text : q.meldungen[t.sprache].ergebnisProzent.replace(/%n/i, richtigkeit)
				}));

				t.solved = true;
				t.element.className += " " + q.fertigClass;

				// Auswertungs-Button entfernen
				test = q.domSelect(".auswertungs-button", t.element);

				if (test.length > 0) {
					t.element.removeChild(test[0]);
				}
			},

			// Funktion zum Anzeigen der Fragen und der vermischten möglichen Antworten
			init : function () {
				var t = this,
					frage, antworten, i, j, html, ID;

				// Spracheinstellungen auf deutsch zurück korrigieren, falls entsprechende Sprachdaten fehlen
				if (!q.meldungen[t.sprache]) {
					t.sprache = "de";
				}

				/* Jede Antwort wird zu einem Listen-Element innerhalb einer geordneten Liste.
					Die Liste erhält die CSS-Klasse quiz.loesungsClass.
					Die Listenelemente erhalten eine ID, die sich nur am letzten Buchstaben unterscheidet.
					Die ID einer Falschantwort erhält zusätzlich ein "_f". */

				for (i = 0; i < t.fragen.length; i++) {
					// Frage in das Dokument schreiben
					frage = q.domCreate({
						tagName: "p"
					});

					frage.innerHTML = t.fragen[i].frage;
					t.element.insertBefore(frage, t.fragen[i].original);

					// Antworten zusammenstellen und vermischt ausgeben
					antworten = q.domCreate({
						tagName : "ol",
						className : t.loesungsClass
					});

					html = "";
					t.fragen[i].antworten.shuffle();

					for (j = 0; j < this.fragen[i].antworten.length; j++) {
						ID = this.name + "_" + i + String.fromCharCode(j + 97);

						if (this.fragen[i].antworten[j].match(/^\!/))
							ID += "_f"; // Falschantwort markieren

						html += '<li><input type="checkbox" id="' + ID + '">'
							+ '<label for="' + ID + '"> '
							+ t.fragen[i].antworten[j].replace(/^\!/, "")
							+ "</label></li>";
					}

					antworten.innerHTML += html;

					t.element.insertBefore(frage, t.fragen[i].original);
					t.element.insertBefore(antworten, t.fragen[i].original);
					t.element.removeChild(t.fragen[i].original);
				}

				// Auswertungsbutton anzeigen
				t.element.appendChild(q.domCreate({
					tagName : "p",
					className : "auswertungs-button",
					text : q.meldungen[t.sprache].pruefen,
					onclick : function () { t.auswerten(); }
				}));

				// ID für das umgebende DIV-Element vergeben
				t.element.id = t.name;
			}
		}


		// Laufende Nummer ermitteln -> Quiz-Name wird "quiz" + laufende Nummer
		i = 0;
		q.each(q.alleQuizze, function() {
			i++;
		});
		quiz.name = "quiz" + i;

		// Gibt es Quiz-Daten?
		fragen = q.domSelect("p", div);

		if (fragen.length < 1) {
			// Keine Textabsätze für Quiz-Daten gefunden! -> abbrechen
			return false;
		}

		// Daten sind also vorhanden? -> Auswerten
		q.each(fragen, function (f) {
			// Textabsatz durchforsten
			var test = f.innerHTML.replace(/[\t\r\n]/g, " "),
				daten = {
					frage : "",
					antworten : new Array(),
					original : null // Referenz auf den originalen Textabsatz, um ihn später zu entfernen
				};

			// Zeilenumbrüche und überflüssige Leerzeichen entfernen
			test = test.replace(/(<br>|<br\/>|<br \/>|&bnsp;| )*$/ig, "");

			while (test.match(/\)$/)) {
				daten.antworten.push(test.replace(/^.*\(([^\(\)]*)\)$/, "$1"));

				// extrahierte Antwort aus dem String entfernen
				test = test.replace(/^(.*)\([^\(\)]*\)$/, "$1");
				test = test.quizTrim();
			}

			// Passende Fragen im aktuellen Textabsatz gefunden?
			if (daten.antworten.length > 0) {
				// Ja! Frage mit dazu ...
				daten.frage = test;
				daten.original = f; // Referenz zum ursprünglichen Textabsatz

				// ... und Daten ins Quiz übertragen
				quiz.fragen.push(daten);
			}
		});

		// Keine brauchbare Daten? -> Verwerfen!
		i = 0;
		q.each(quiz.fragen, function() {
			i++;
		});

		if (i < 1) {
			return false;
		}

		// Quiz in die Liste aufnehmen und initialisieren
		q.alleQuizze[quiz.name] = quiz;
		quiz.element.quiz = quiz;
		quiz.init();

		return true;
	},


	/* Diese Funktion erzeugt ein Schüttel-Quiz. Dazu braucht sie ein Elternelement mit dem
	CSS-Klassen-Präfix "schuettel", z.B. "schuettel-quiz", wenn "-quiz" das Suffix der Quiz.triggerClass ist.
	Die mit <strong>, <em>, <b> oder <i> ausgezeichneten Textstellen werden durch Drag&Drop-Felder ersetzt. Sollten
	Lösungshinweise in Klammern stehen, so werden die Textstellen durch Eingabefelder ersetzt. */

	schuettelQuiz : function (div) {
		var q = this,
			i, j, test, inhalt, daten;

		var quiz = {
			// Objekt-Gestalt eines Schüttel-Quizzes
			name : "Quiz-x", // Platzhalter - hier steht später etwas anderes.
			typ : "Schüttel-Quiz",
			loesungsClass : "luecke",
			element : div, // Referenz auf das DIV-Element, in welchem sich das Quiz befindet
			felder : new Array(), // Hier stehen später Referenzen auf die Text-Eingabefelder und ihre Lösungen
			auswertungsButton : null, // Hier steht später das HTML-Element des Auswertungs-Buttons.
			versuche : 0, // Speichert die Anzahl Versuche, die für die Lösung gebraucht wurden.
			sprache : (div.lang && div.lang != "") ? div.lang : "de", // deutsche Meldungen als Voreinstellung

			// Funktion zum Auswerten der Lösungen
			auswerten : function (klick) {
				var t = this,
					loesungen, ok;

				if (klick) {
					// Auswertungs-Button wurde geklickt! Auswerten!
					ok = true; // Mal davon ausgehen, dass alles richtig ist...

					// Anzahl Lösungsversuche um eins erhöhen
					t.versuche++;

					q.each(q.domSelect("."+t.loesungsClass, t.element), function(f) {
						var eingabe = q.domSelect("input", f),
							nummer;

						// bereits als richtig ausgewertete Felder enthalten kein Input-Element mehr!
						if (eingabe.length > 0) {
							nummer = eingabe[0].id.replace(/^.*_(\d+)$/, "$1");

							if (eingabe[0].value.toLowerCase() == t.felder[nummer].loesung.toLowerCase()) {
								// Eingabefeld wurde richtig ausgefüllt!
								f.innerHTML = t.felder[nummer].loesung;

							} else {
								// Eingabefeld wurde falsch ausgefüllt! -> leeren
								eingabe[0].value = "";
								ok = false;
							}
						}
					});

					if (ok) {
						// Quiz wurde korrekt gelöst! -> Erfolgsmeldung ausgeben
						t.element.appendChild(q.domCreate({
							tagName : "p",
							className : q.bewertungsClass,
							text : q.meldungen[t.sprache]["lob" + (t.versuche > 2 ? 3 : t.versuche)]
								+ " "
								+ q.meldungen[t.sprache][
									"ergebnis" + (t.versuche > 2 ? 3 : t.versuche)
								].replace(/%n/i, t.versuche)
						}));

						t.solved = true;
						t.element.className += " " + q.fertigClass;
					}
				}

				// Auswertungsbutton entfernen, falls vorhanden
				if (t.auswertungsButton.parentNode) {
					t.auswertungsButton.parentNode.removeChild(t.auswertungsButton);
				}

				// Eingabefelder überprüfen
				loesungen = q.domSelect("input", t.element);
				ok = loesungen.length > 0; // Mal davon ausgehen, dass alle ausgefüllt sind... wenn es welche gibt!

				q.each(loesungen, function(l) {
					if (l.value == "") {
						ok = false; // Feld war leer!
					}
				});

				// Sind alle Eingabefelder ausgefüllt?
				if (ok) {
					// Ja. -> Button ins Dokument schreiben
					t.element.appendChild(t.auswertungsButton);
				}
			},

			// Funktion zum Umwandeln der Wörter zu Engabefeldern
			init : function () {
				var t = this,
					luecke;

				// Spracheinstellungen auf deutsch zurück korrigieren, falls entsprechende Sprachdaten fehlen
				if (!q.meldungen[t.sprache]) {
					t.sprache = "de";
				}

				/* Jeder markierte Textabschnitt (zum Markieren dienen die Elemente <i>, <b>, <em> und <strong>) wird durch ein
				SPAN-Element, in welchem sich ein Input-Element mit einer Lösucngsvorgabe in Klammern befindet, ersetzt.
				Es erhält die CSS_Klasse, die in quiz.loesungsClass definiert wurde.

				Beispiel: <p>Eine <i>Henne</i> legt ein.</p>
				wird zu
				<p>Eine <span class="luecke"><input id="......" /> (eeHnn)</span> legt ein Ei.</p>

				Die ID eines solchen Input-Elements korrespondiert mit der laufenden Nummer des Daten-Eintrages in
				"quiz.felder". */

				for (i = 0; i < t.felder.length; i++) {
					// Lücke mit Eingabe-Element vorbereiten
					luecke = q.domCreate({
						tagName : "span",
						className : t.loesungsClass,
						text : " ("
							+ t.felder[i].loesung.toLowerCase().split("").shuffle().join("")
							+ ")"
					});

					luecke.insertBefore(
						q.domCreate({
							tagName : "input",
							type : "text",
							name : t.name + "_" + i,
							id : t.name + "_" + i,
							onkeyup : function () { t.auswerten(); }
						}),
						luecke.firstChild
					);

					t.felder[i].element = luecke;
				}

				// Alle im Dokument markierten Wörter in Eingabefelder umwandeln
				q.each(t.felder, function (f) {
					f.original.parentNode.insertBefore(f.element, f.original);
					f.original.parentNode.removeChild(f.original);
				});

				// ID für das umgebende DIV-Element vergeben
				t.element.id = t.name;

				// Auswertungs-Button erzeugen
				t.auswertungsButton = q.domCreate({
					tagName : "p",
					className : "auswertungs-button",
					text : q.meldungen[t.sprache].pruefen,
					onclick : function () { t.auswerten(1); }
				});
			}
		};

		// Laufende Nummer ermitteln -> Quiz-Name wird "quiz" + laufende Nummer
		i = 0;
		q.each(q.alleQuizze, function () {
			i++;
		});

		quiz.name = "quiz" + i;

		// Gibt es Quiz-Daten?
		daten = {
			bolds : q.domSelect("b", div),
			italics : q.domSelect("i", div),
			strongs : q.domSelect("strong", div),
			ems : q.domSelect("em", div)
		}

		// keine potentiellen Daten gefunden? -> abbrechen!
		if (daten.bolds.length < 1
			&& daten.italics.length < 1
			&& daten.strongs.length < 1
			&& daten.ems.length < 1
		) {
			return false;
		}

		// Daten sind also vorhanden? -> Auswerten
		q.each(daten, function (d) {
			q.each(d, function (f) {
				// Lösungsinhalt "säubern"
				quiz.felder.push({
					element : null,
					original : f,
					loesung : f.innerHTML.replace(
							/[\t\r\n]/g, " "
						).replace(
							/^<\/?[^>]+>$/, ""
						).replace(
							/(nbsp; | &nbsp;)/, " "
						).replace(
							/ +/, " "
						).quizTrim()
				});
			});
		});

		// Brauchbare Daten?
		i = 0;
		q.each(quiz.felder, function () {
			i++;
		});

		if (i < 1) {
			return false;
		}

		// Quiz in die Liste aufnehmen und initialisieren
		q.alleQuizze[quiz.name] = quiz;
		quiz.element.quiz = quiz;
		quiz.init();

		return true;
	},


	/* Diese Funktion erzeugt ein Kreuzwort-Quiz. Dazu braucht sie ein Elternelement mit dem
	CSS-Klassen-Präfix "kreuzwort", z.B. "kreuzwort-quiz", wenn "-quiz" das Suffix der Quiz.triggerClass ist.
	Die Daten für das Quiz müssen in einer zweispaltigen Tabelle stehen:
	1. Zelle enthält das Lösungswort,
	2. Zelle enthält eine Lösungshilfe
	*/

	kreuzwortQuiz : function (div) {
		var q = this,
			i, tabelle;

		var quiz = {
			// Objekt-Gestalt eines Kreuzwort-Quizzes
			name : "Quiz-x", // Platzhalter - hier steht später etwas anderes.
			typ : "Kreuzwort-Quiz",
			loesungsClass : "feld",
			loesungsClass2 : "eingabe-feld",
			element : div, // Referenz auf das DIV-Element, in welchem sich das Quiz befindet
			eingabe : q.domCreate({ tagName : "div" }), // Eingabebereich
			tabelle : null, // Referenz auf das HTML-Element, in dem das Kreuzworträtsel angezeigt wird
			daten : new Array(), // Hier stehen später Objekte, die die Quiz-Daten enthalten.
			auswertungsButton : null, // Hier steht später das HTML-Element des Auswertungs-Buttons.
			versuche : 0, // Speichert die Anzahl Versuche, die für die Lösung gebraucht wurden.
			sprache : (div.lang && div.lang != "") ? div.lang : "de", // deutsche Meldungen als Voreinstellung

			// Funktion zum Auswerten der Lösungen
			auswerten : function (werte) {
				/* "werte" hat folgende Struktur: {
					wort: <String>,
					quizItem: {
						wort: <String>,
						x: <Number>,
						y: <Number>,
						hilfe: <String>,
						richtung: "waagrecht|senkrecht",
						name: <String>
					},
					form: <HTMLFormObject>
				} */
				var t = this,
					test = true,
					i, p, button, zelle, alleZellen, forms;

				if (werte.wort && werte.quizItem) {
					// Es wurde ein Button geklickt... Eintragen!
					p = {
						wort : werte.quizItem.wort,
						x : werte.quizItem.x,
						y : werte.quizItem.y,
						richtung : werte.quizItem.richtung
					};

					alleZellen = t.findeZellen(p);

					for (i = 0; i < alleZellen.length; i ++) {
						if (werte.wort.length > i) {
							// Buchstabe in die Zelle eintragen
							zelle = q.domSelect("."+t.loesungsClass2, alleZellen[i]); // span-Element für Buchstaben finden

							if (zelle.length > 0) {
								zelle[0].firstChild.nodeValue = werte.wort.substr(
									i, 1
								).replace(
									/ /, String.fromCharCode(160)
								);
							}
						}
					}

					// Eingabeformular(e) entfernen/aktualisieren
					werte.form.parentNode.removeChild(werte.form);

					forms = q.domSelect("form", t.eingabe);
					if (forms.length > 0) {
						// weitere Eingabe(n) möglich -> Formular(e) neu aufbauen
						p = new Array();

						q.each(forms, function (f) {
							p.push({
								wort : f.quizDaten.wort,
								x : f.quizDaten.x,
								y : f.quizDaten.y,
								hilfe : f.quizDaten.hilfe,
								richtung : f.quizDaten.richtung
							});
						});

						// Formulare neu erstellen lassen
						return t.eintragen(p);

					} else {
						// keine weiteren Eingaben mehr zu tätigen -> weg damit oder Auswertungsbutton anzeigen?
						q.each(q.domSelect("."+t.loesungsClass2, t.tabelle), function (a) {
							if (!a.lastChild.nodeValue
								|| a.lastChild.nodeValue == ""
								|| a.lastChild.nodeValue == String.fromCharCode(160)
							) {
								test = false;
							}
						});

						if (test) {
							// Alles ausgefüllt! -> Auswertungs-Button anzeigen!
							q.each(q.domSelect("p", t.eingabe), function (a) {
								a.style.display = "none";
							});

							t.eingabe.insertBefore(t.auswertungsButton, t.eingabe.lastChild);

						} else {
							// weg damit!
							t.eingabe.style.display = "none";
						}
					}

					return false;
				}

				// Auswertungsbutton geklickt?
				if (werte == "auswertungs-button") {
					// Auswerten!
					t.versuche++;
					test = true;

					q.each(q.domSelect("."+t.loesungsClass2, t.tabelle), function (a) {
						if (a.firstChild.nodeValue != a.parentNode.id.replace(
							/^.*(\w)$/, "$1"
						).replace(
							/_/g, " "
						)) {
							// Falsche Eingabe! -> Löschen
							a.firstChild.nodeValue = String.fromCharCode(160);
							test = false;
						}
					});

					if (test) {
						// Alles richtig!
						t.eingabe.parentNode.insertBefore(
							q.domCreate({
								tagName : "p",
								className : q.bewertungsClass,
								text: q.meldungen[t.sprache]["lob" + (t.versuche > 2 ? 3 : t.versuche)]
									+ " "
									+ q.meldungen[t.sprache][
										"ergebnis" + (t.versuche > 2 ? 3 : t.versuche)
									].replace(/%n/i, t.versuche)
							}),
							t.eingabe
						);

						// Auswertungs-Button und alle Eventhandler entfernen
						t.eingabe.parentNode.removeChild(t.eingabe);
						t.element.onmousedown = null;
						t.element.onmouseup = null;
						t.solved = true;
						t.element.className += " " + q.fertigClass;

					} else {
						// zurück zum Ausfüllen
						q.each(q.domSelect("p", t.eingabe), function (a) {
							a.style.display = "";
						});

						t.eingabe.style.display = "none";
					}
				}

				return false;
			},

			// Funktion zum Eintragen von Kreuzwort-Wörtern
			eintragen : function (werte) {
				/* "werte" hat folgende Struktur: Array[
					{
						wort: <String>,
						x: <Number>,
						y: <Number>,
						hilfe: <String>,
						richtung: "waagrecht|senkrecht"
					}  // eventuell ein weiteres Objekt:
					,{
						wort: <String>,
						x: <Number>,
						y: <Number>,
						hilfe: <String>,
						richtung: "waagrecht|senkrecht"
					}
				] */
				var t = this,
					i, p, w, test, text, eingabefeld, zellen;

				// Auswertungsbutton entfernen falls vorhanden
				if (t.auswertungsButton.parentNode == t.eingabe) {
					t.eingabe.removeChild(t.auswertungsButton);
				}

				while (q.domSelect("form", t.eingabe).length > 0) {
					t.eingabe.removeChild(q.domSelect("form", t.eingabe)[0]);
				}

				// Formular erstellen - für jeden Suchbegriff eines
				q.each(werte, function (wert) {
					wert.name = t.name;

					eingabefeld = q.domCreate({
						tagName : "form",
						quizDaten : wert,
						onsubmit : function () {
							var werte = {
									wort : "",
									quizItem : this.quizDaten,
									form: this
								};

							q.each(
								q.domSelect("span", q.domSelect(".eingabezeile", this)[0]),
								function (s) {
									werte.wort += s.innerHTML.replace(/&nbsp;/g, " ").quizTrim();
								}
							);

							return t.auswerten(werte);
						}
					});
					t.eingabe.appendChild(eingabefeld);

					// Textabsatz mit Lösungshinweis erstellen
					p = q.domCreate({
						tagName: "p",
						// die eigentliche Lösungshilfe
						text : wert.hilfe.replace(/^\d+ */, "")
					});

					// Die Richtung (mehrsprachig!) in einem extra <span>-Element
					p.insertBefore(
						q.domCreate({
							tagName : "span",
							className : "richtung",
							text: q.meldungen[t.sprache][wert.richtung] + ":"
						}),
						p.firstChild
					);

					// Nummer auch in einem extra <span>-Element
					p.insertBefore(
						q.domCreate({
							tagName : "span",
							className : "nummer",
							text: wert.hilfe.replace(/^(\d+).*$/, "$1")
						}),
						p.firstChild
					);

					eingabefeld.appendChild(p);

					// korrespondierende Zellen ermitteln, um bereits Eingetragenes mit anzubieten
					zellen = t.findeZellen({
						wort : wert.wort,
						x : wert.x,
						y : wert.y,
						richtung : wert.richtung
					});

					// Textabsatz als Eingabezeile erstellen, in welchem die Eingaben in <span>-Elementen stehen
					p = q.domCreate({
						tagName : "p",
						className : "eingabezeile"
					});
					eingabefeld.appendChild(p);

					// <span>-Elemente erstellen
					for (w = 0; w < wert.wort.length; w++) {
						// bereits vorhandenen Zelleninhalt vorbereiten
						test = zellen[w].innerHTML.replace(
							// HTML-Tags entfernen
							/<\/?[^>]+>/g, ""
						).replace(
							// Leerzeichen
							/&nbsp;/g, " "
						).replace(
							// nur letztes Zeichen nehmen (es könnte ja auch eine Eingabeziffer darin stehen)
							/.*(.)$/, "$1"
						).quizTrim();

						// Zelleninhalt voreintragen
						p.appendChild(q.domCreate({
							tagName : "span",
							text : (test.length > 0 ? test : String.fromCharCode(160)),
							// dem versteckten Textinput den Focus geben
							onmouseup : function () {
								q.each(q.domSelect("span", this.parentNode), function (s) {
									s.className = "";
								});

								this.className = "aktiv";
								q.domSelect(".texteingabefeld", this.parentNode)[0].focus();
							}
						}));
					}

					// Submit-Button braucht keinen Eventhandler, da das Formular onsubmit geprüft wird.
					p.appendChild(q.domCreate({
						tagName : "input",
						type : "submit",
						value : q.meldungen[t.sprache].eintragen
					}));

					// Das versteckte Textinputfeld, das nach jedem Tastendruck ausgelesen wird.
					p.appendChild(q.domCreate({
						tagName : "input",
						type : "text",
						className : "texteingabefeld",
						// Eventhandler für jeden Tastenanschlag
						onkeyup : function (e) {
							return t.tasteAuswerten({
								obj: this,
								e: e
							});
						},
						// Eventhandler für das Verlieren des Focus
						onblur : function () {
							q.each(q.domSelect("span", this.parentNode), function(s) {
								s.className = "";
							});
						}
					}));

					// Erstes Eingabefeld aktiv setzen und den Fokus auf das versteckte Eingabefeld legen:
					window.setTimeout(function () {
						t.eingabefeldAktivieren({
							eingabezeile: q.domSelect(".eingabezeile", t.eingabe)[0],
							feldnummer: 0, // null für erstes Feld
						});
					}, 300);
				});

				t.eingabe.style.display = "block";

				return false;
			},

			// Eingabefeld aktivieren
			eingabefeldAktivieren : function (werte) {
				/* "werte " hat folgende Struktur:  {
					eingabezeile: <HTMLParagraphElement>,
					feldnummer: <Number> (Wert beginnend bei 0!)
				} */
				var spans = q.domSelect("span", werte.eingabezeile);

				q.each(spans, function (s) {
					s.className = "";
				});

				if (werte.feldnummer < spans.length) {
					spans[werte.feldnummer].className = "aktiv";
				}

				q.domSelect(".texteingabefeld", werte.eingabezeile)[0].focus();
			},

			tasteAuswerten : function (werte) {
				// "werte" hat folgende Struktur; { obj: <input>-Element, e: event}
				var t = this,
					spans = q.domSelect("span", werte.obj.parentNode),
					gefunden = false,
					i, j, z;

				werte.e = werte.e || window.event;

				// aktuelles aktives Eingabefeld ermitteln
				for (i = 0; i < spans.length; i++) {
					if (spans[i].className == "aktiv") {
						gefunden = i;
					}
				}


				switch (werte.e.keyCode) {
					case 35: // End (Ende)
						// letztes Feld!
						t.eingabefeldAktivieren({
							eingabezeile: werte.obj.parentNode,
							feldnummer: spans.length -1
						});
					break;
					case 36: // Home (Pos1)
						// erstes Feld!
						t.eingabefeldAktivieren({
							eingabezeile: werte.obj.parentNode,
							feldnummer: 0
						});
					break;
					case 37: // Cursor left
					case 8: // Backspace
						// ein Feld zurück!
						if (gefunden !== false) {
							gefunden = gefunden > 0 ? gefunden -1 : 0;

						} else {
							// letztes Feld anwählen, da gerade keines aktiv war
							gefunden = spans.length -1;
							/* eventuell eingegebene Zeichen im <input>-Element entfernen,
								da diese sonst jetzt automatisch eingetragen werden! */
							werte.obj.value = "";
						}

						// bei Backspace Feld leeren!
						if (werte.e.keyCode == 8) {
							spans[gefunden].innerHTML = String.fromCharCode(160);
						}

						t.eingabefeldAktivieren({
							eingabezeile: werte.obj.parentNode,
							feldnummer: gefunden
						});
					break;
					case 39: // Cursor right
						// ein Feld vor!
						if (gefunden !== false) {
							gefunden = gefunden < spans.length -2 ? gefunden +1 : spans.length -1;

							t.eingabefeldAktivieren({
								eingabezeile: werte.obj.parentNode,
								feldnummer: gefunden
							});
						}
					break;
				}

				if (werte.obj.value.length > 0) {
					z = q.wandleZeichen(werte.obj.value.substr(0, 1));
					// bisherige Eingaben wieder löschen, da immer nur erster Buchstabe genommen wird
					werte.obj.value = "";

					if (z.length > 0) {
						j = false;
						for (i = 0; i < spans.length; i++) {
							if (spans[i].className && spans[i].className == "aktiv") {
								j = i;
							}
						}

						// eventuell sollen mehrere Zeichen eingetragen werden (z.B. bei Ligaturen oder Umlauten)
						for (i = 0; i < z.length; i++) {
							if (spans[j + i]) {
								spans[j + i].innerHTML = z.substr(i, 1);
							}
						}

						t.eingabefeldAktivieren({
							eingabezeile : spans[0].parentNode,
							feldnummer : j + i
						});
					}
				}
			},

			/* Funktion zum Ermitteln aller HTML-Elemente (td), in die ein Lösungswort
				geschrieben werden muss */
			findeZellen : function (werte) {
				/* "werte" hat folgende Struktur: {
					wort: <String>,
					x: <Number>,
					y: <Number>,
					richtung: "waagrecht|senkrecht"
				} */
				var t = this,
					zellen = new Array(),
					zelle, x, y, i;

				for (i = 0; i < werte.wort.length; i++) {
					zelle = werte.richtung == "waagrecht" ?
						q.domSelect("tr", t.tabelle)[werte.y] :
						q.domSelect("tr", t.tabelle)[werte.y + i];

					if (zelle) {
						zelle = werte.richtung == "waagrecht" ?
							q.domSelect("td", zelle)[werte.x + i] :
							q.domSelect("td", zelle)[werte.x];
					}

					if (zelle) {
						zellen.push(zelle);
					}
				}

				return zellen;
			},

			// Funktion zum Errichten der Tabelle des Kreuzwort-Quiz und zum Einrichten der Eventhandler
			init : function () {
				var t = this,
					kreuzwortGitter, tr, td, a, x, y;

				// Spracheinstellungen auf deutsch zurück korrigieren, falls entsprechende Sprachdaten fehlen
				if (!q.meldungen[t.sprache]) {
					t.sprache = "de";
				}

				/* Wörtergitter erzeugen, sodass nach Möglichkeit keine alleinstehenden Wörter
					im Gitter enthalten sind */
				kreuzwortGitter = q.erstelleWoerterGitter(
					t.daten,
					true, // true für "alle verbunden"
					false // false für "keine diagonalen Wörter"
				);

				// Daten und Gitter abspeichern
				t.daten = kreuzwortGitter.woerter;
				t.grid = kreuzwortGitter.gitter;

				// Tabelle befüllen
				for (y = 0; y < t.grid.length; y++) {
					tr = t.tabelle.insertRow(
						t.tabelle.rows.length <= 0 ? 0 : t.tabelle.rows.length
					);

					for (x = 0; x < this.grid[0].length; x++) {
						td = q.domCreate({
							tagName : "td",
							id : t.name + "_" + x + "_" + y
						});

						if (t.grid[y][x]) {
							td.id += "_" + t.grid[y][x];
							td.className = t.loesungsClass;
						}

						// Zelleninhalt
						if (t.grid[y][x]) {
							td.appendChild(q.domCreate({
								tagName : "span",
								className : t.loesungsClass2,
								text : String.fromCharCode(160)
							}));

						} else {
							td.innerHTML = String.fromCharCode(160);
						}

						// Zelle in Zeile einhängen
						tr.appendChild(td);
					}
				}

				// Einfügemarken und Eventhandler einrichten
				a = 1;
				q.each(t.daten, function (d) {
					var nummer = a, // Nummer der aktuellen Einfügemarke merken
						marke;

					x = d.x;
					y = d.y;

					if (td = t.tabelle.rows[y] && t.tabelle.rows[y].cells[x]) {
						// bereits eine Einfügemarke vorhanden?
						td.style.cursor = "pointer";

						if (!td.nummer) {
							// Nein! -> Einfügemarke erstellen
							marke = q.domCreate({
								tagName : "span",
								className : "einfuegemarke",
								text : nummer
							});

							td.insertBefore(marke, td.firstChild);
							td.nummer = nummer;
							a++; // Ziffer der Einfügemarke erhöhen

						} else {
							// Nummer der vorhandenen Einfügemarke merken
							nummer = td.nummer;
						}

						// Lösungshilfe mit Nummer der Einfügemarke versehen
						d.hilfe = nummer + " " + d.hilfe;

						// Eventhandler einrichten / erweitern
						td.daten = td.daten || new Array();
						td.daten.push(d); // auszuwertende Daten für Eingabedialog hinzufügen

						if (typeof(td.onclick) != "function") {
							td.onclick = function () {
								t.eintragen(this.daten);
							};
						}
					}
				});

				// Eingabebereich erstellen
				t.eingabe.className = "eingabe " + q.draggableClass;

				// Header des Eingabebereichs
				t.eingabe.appendChild(q.domCreate({
					tagName : "div",
					className : "eingabe-header"
				}));

				// "schließen"-Schaltfläche
				t.eingabe.lastChild.appendChild(q.domCreate({
					tagName : "span",
					className : "schliessen-button",
					onclick : function () {
						this.parentNode.parentNode.style.display = "";
					}
				}));

				t.eingabe.lastChild.lastChild.style.cursor = "pointer";

				// Textabsatz für einen Eingabehinweis erstellen, der ein verdecktes <span>-Element enthält
				t.eingabe.appendChild(q.domCreate({
					tagName : "p",
					className : "eingabehinweis",
					// Anzeigen des verdeckten <span>-Elementes bei Hover (für IE notwendig)
					onmouseover : function () {
						this.childNodes[0].style.display = "block";
					},
					// Verbergen des verdeckten <span>-Elementes beim Verlassen
					onmouseout : function () {
						this.childNodes[0].style.display = "";
					}
				}));

				// Eingabehinweis
				t.eingabe.lastChild.appendChild(q.domCreate({
					tagName : "span",
					text : q.meldungen[t.sprache].eingabehinweis
				}));

				t.tabelle.parentNode.insertBefore(t.eingabe, t.tabelle.nextSibling);

				// Eingabefeld durch Eventhandler für bewegliche Felder zu einem Fensterimitat machen
				t.element.onmousedown = q.startDrag;
				t.element.onmouseup = q.stopDrag;

				// Auswertungsbutton erstellen
				t.auswertungsButton = q.domCreate({
					tagName : "p",
					className : "auswertungs-button",
					text : q.meldungen[t.sprache].pruefen,
					onclick : function () { t.auswerten("auswertungs-button"); }
				});

				// ID für das umgebende DIV-Element vergeben
				t.element.id = t.name;

				// Für die Druckausgabe eine Liste der Lösungshilfen ausgeben
				t.element.appendChild(q.domCreate({
					tagName : "div",
					className : "uebersicht"
				}));

				// Listen ausgeben
				q.each(["senkrecht", "waagrecht"], function (r) {
					// Liste erzeugen
					var dl = q.domCreate({ tagName : "dl" });

					dl.appendChild(q.domCreate({
						tagName : "dt",
						text : q.meldungen[t.sprache][r]
					}));

					// passende Lösungshilfen ausfiltern
					q.each(t.daten, function (d) {
						if (d.richtung == r) {
							dl.appendChild(q.domCreate({
								tagName : "dd",
								text : d.hilfe.replace(/^\d+(.*)/, "$1")
							}));

							dl.lastChild.appendChild(q.domCreate({
								tagName : "span",
								text : d.hilfe.replace(/^(\d+).*/, "$1")
							}));
						}
					});

					t.element.lastChild.appendChild(dl);
				});
			}
		};

		// Laufende Nummer ermitteln -> Quiz-Name wird "quiz" + laufende Nummer
		i = 0;
		q.each(q.alleQuizze, function () {
			i++;
		});
		quiz.name = "quiz" + i;

		// Gibt es Quiz-Daten?
		tabelle = q.domSelect("table", div);

		if (tabelle.length < 1) {
			return false;
		}

		// Daten sind also vorhanden? -> Tabellenzeilen nach Daten durchforsten
		q.each(tabelle[0].rows, function (tr) {
			var gefunden = new Array();

			if (tr.cells.length > 1) {
				// "Müll" entfernen
				gefunden[0] = tr.cells[0].innerHTML.replace(
					/<\/?[^>]+>/g, ""
				).replace(
					/&amp;/g, "&"
				).replace(
					/&nbsp;/g, " "
				).replace(/ /g, "_");

				gefunden[1] = tr.cells[1].innerHTML.replace(
					/<\/?[^>]+>/g, ""
				).replace(
					/&amp;/g, "&"
				).replace(/&nbsp;/g, " ");

				// Lösungswort in reine Großbuchstaben umwandeln
				gefunden[0] = q.wandleZeichen(gefunden[0]).toUpperCase();

				if (gefunden[0] != "" && gefunden[1] != "") {
					quiz.daten.push({
						wort : gefunden[0].quizTrim(),
						x : -1,
						y : -1,
						hilfe : gefunden[1].quizTrim()
					});
				}
			}
		});

		// Keine brauchbare Daten? -> Verwerfen!
		if (quiz.daten.length < 1) {
			return false;
		}

		// originale Tabelle durch leere Tabelle ersetzen
		quiz.tabelle = document.createElement("table");
		quiz.tabelle.className = "gitter";
		tabelle[0].parentNode.insertBefore(quiz.tabelle, tabelle[0].nextSibling);
		tabelle[0].parentNode.removeChild(tabelle[0]);

		// Quiz in die Liste aufnehmen und initialisieren
		q.alleQuizze[quiz.name] = quiz;
		quiz.element.quiz = quiz;
		quiz.init();

		return true;
	},

	erstelleWoerterGitter : function (woerter, alleVerbunden, diagonaleWoerter, keineFreienZwischenRaeume) {
		/* übergebene Parameter
			@woerter:
				Ein Array mit Wort-Objekten. Ein Wort-Objekt hat mindestens diese Struktur:
				wort = {
					wort : (String),
					hilfe : (String), // nur bei Aufruf aus dem Kreuzworträtsel-Quiz heraus
					wortOriginal : (String) // nur bei Aufruf aus dem Suchsel-Quiz heraus
				}
				Nach dieser Funktion kann ein Wort-Objekt dann auch so aussehen
				wort = {
					wort : (String),
					x : (Integer),
					y : (Integer),
					richtung : (String), "waagrecht|senkrecht"
					hilfe : (String), // nur bei Aufruf aus dem Kreuzworträtsel-Quiz heraus
					wortOriginal : (String) // nur bei Aufruf aus dem Suchsel-Quiz heraus
				}
			@alleVerbunden (true|false):
				Wenn true, werden bis zu 10 Versuche unternommen, ein Gitter zu erstellen,
				bei dem alle Begriffe miteinander verbunden sind.
			@diagonaleWoerter (true|false):
				Wenn true, werden Wörter auch diagonal eingepasst. Dabei ist die
				Leserichtung immer von links nach rechts, egal ob das Wort von links
				oben nach rechts unten, oder von links unten nach rechts oben verläuft.
		*/
		var q = this;
		var fertige = new Array(); // Array mit fertigen Gittern
		var makel = 1, maxVersuche = alleVerbunden ? 10 : 1;
		var richtungen = diagonaleWoerter ?
			["waagrecht", "senkrecht", "diagonal-loru", "diagonal-luro"]
			:
			["waagrecht", "senkrecht"];
		var grid, abgelegte, erfolglose, test, zufall, i, wort, a,
			eingepasst, x, y, nummer, p, button, input, buchstaben, b, d, moeglicheRichtungen, r;

		// Gitter erzeugen, falls das nicht ohne Makel gelingt, bis zu 10x
		while (makel > 0 && fertige.length < maxVersuche) {
			makel = 0; // zuerst davon ausgehen, dass ein perfektes Gitter entstehen wird
			abgelegte = new Array(); // es wurde noch nichts abgelegt
			erfolglose = new Array(); // es gibt noch keine erfolglos eingepassten Wörter

			// Grid aufbauen
			test = 0;
			q.each(woerter, function (w) {
				test += w.wort.length; // Anzahl Buchstaben insgesamt
			});

			grid = new Array(test);
			for (i = 0; i < test; i++) {
				grid[i] = new Array(test);
			}

			// Wörter in zufälliger Reihenfolge ins Gitter einpassen - wenn es gelingt
			while (abgelegte.length < woerter.length) {

				test = true; // neue Zufallszahl erzwingen
				while (test) {
					zufall = Math.floor(Math.random() * woerter.length);
					test = false; // annehmen, dass die Zufallszahl noch nicht benutzt wurde

					// Wort bereits abgelegt?
					q.each(abgelegte, function (a) {
						if (a.wort == woerter[zufall].wort) {
							test = true;
						}
					});

					if (erfolglose.length > 0) {
						// bereits erfolglos probierte Wörter ausschließen
						q.each(erfolglose, function (e) {
							if (woerter[zufall] == e) {
								test = true;
							}
						});
					}
				}

				// Jetzt haben wir ein Wort zum Einpassen in das Gitter
				wort = woerter[zufall];
				wort.x = -1;
				wort.y = -1;

				// geeignete Stelle finden, um es einzupassen
				if (abgelegte.length > 0) {

					// weiteres Wort einfügen -> bereits eingesetzte Wörter der Reihe nach durchgehen
					for (a = 0; a < abgelegte.length; a++) {

						// schon eine passende Stelle zum Einpassen ermittelt?
						if (wort.x >= 0 && wort.y >= 0)
							break; // Ja! -> abbrechen!

						// zufälligen Buchstaben des Wortes nehmen und nach Übereinstimmungen mit eingepasstem Wort suchen
						buchstaben = new Array(); // benutzte Buchstaben leeren
						for (b = 0; b < wort.wort.length; b++) {

							// schon eine passende Stelle zum Einpassen ermittelt?
							if (wort.x >= 0 && wort.y >= 0)
								break; // Ja! -> abbrechen!

							test = true; // neue Zufallszahl erzwingen
							while (test) {
								zufall = Math.floor(Math.random() * wort.wort.length);
								test = buchstaben[zufall];
							}

							buchstaben[zufall] = true; // Buchstaben als benutzt markieren

							// Buchstabe in beiden Wörtern vorhanden?
							if (abgelegte[a].wort.indexOf(wort.wort.substr(zufall, 1)) >= 0) {

								// Ja! -> jeden Buchstaben des bereits eingepassten Wortes durchgehen
								for (eingepasst = 0; eingepasst < abgelegte[a].wort.length; eingepasst++) {

									// Wort bereits erfolgreich eingepasst?
									if (wort.x >= 0 && wort.y >= 0)
										break; // Ja! -> abbrechen

									if (abgelegte[a].wort.substr(eingepasst, 1) == wort.wort.substr(zufall, 1)) {
										// übereinstimmender Buchstabe ermittelt! -> Wort testweise ins Gitter einpassen
										test = true; // davon ausgehen, dass das Wort passt...

										// Position des Buchstabens im Gitter ermitteln
										if (abgelegte[a].richtung == "waagrecht") {
											x = abgelegte[a].x + eingepasst;
											y = abgelegte[a].y;
										}
										if (abgelegte[a].richtung == "senkrecht") {
											x = abgelegte[a].x;
											y = abgelegte[a].y + eingepasst;
										}
										if (abgelegte[a].richtung == "diagonal-loru") {
											x = abgelegte[a].x + eingepasst;
											y = abgelegte[a].y + eingepasst;
										}
										if (abgelegte[a].richtung == "diagonal-luro") {
											x = abgelegte[a].x + eingepasst;
											y = abgelegte[a].y - eingepasst;
										}

										// mögliche Richtungen für neu einzupassendes Wort ermitteln
										moeglicheRichtungen = [];
										for (i = 0; i < richtungen.length; i++) {
											if (richtungen[i] != abgelegte[a].richtung) {
												moeglicheRichtungen.push(richtungen[i]);
											}
										}
										moeglicheRichtungen.shuffle();

										while (moeglicheRichtungen.length) {
											// Richtung des einzupassenden Wortes festlegen
											wort.richtung = moeglicheRichtungen.pop();

											// im Gitter die Startposition des einzupassenden Wortes ermitteln
											if (wort.richtung == "senkrecht") {
												y = y - zufall; // "zufall" ist der Abstand des entsprechenden Buchstabens zum Wortbeginn
											}
											if (wort.richtung == "waagrecht") {
												x = x - zufall;
											}
											if (wort.richtung == "diagonal-loru") {
												x = x - zufall;
												y = y - zufall;
											}
											if (wort.richtung == "diagonal-luro") {
												x = x - zufall;
												y = y + zufall;
											}

											// zu belegende Felder im Gitter prüfen
											for (i = 0; i < wort.wort.length; i++) {

												if (wort.richtung == "waagrecht") {
													if (grid[y][x + i] && grid[y][x + i] != wort.wort.substr(i, 1)) {
														test = false;
													}

													// nebenan frei? (Kosmetik)
													if (!keineFreienZwischenRaeume) {
														/* alle bereits abgelegten Wörter daraufhin prüfen, ob sie im
														Bereich des Wortes parallel in einer Nachbarzeile verlaufen */
														q.each(abgelegte, function (a) {
															if (a.richtung == "waagrecht"
																&& (a.y + 1 == y
																|| a.y -1 == y)
															) {
																if (// Nachbarwort länger?
																	(a.x <= x &&
																	a.wort.x + a.wort.length >= x + wort.wort.length)
																	||
																	// Nachbarwort überlappt Anfang
																	(a.x <= x
																	&& a.x + a.wort.length >= x)
																	||
																	// Nachbarwort beginnt mitten im Wort
																	(a.x > x
																	&& a.x <= x + wort.wort.length)
																) {
																	test = false; // ja -> verwerfen
																}
															}
															// beginnt ein senkrechtes Wort direkt unterhalb?
															if (a.richtung == "senkrecht" && a.y - 1 == y) {
																if (a.x >= x && a.x <= x + wort.wort.length) {
																	test = false; // ja -> verwerfen
																}
															}
														});
													}
												}
												if (wort.richtung == "senkrecht") {
													if (grid[y + i][x] && grid[y + i][x] != wort.wort.substr(i, 1)) {
														test = false;
													}

													// nebenan frei? (Kosmetik)
													if (!keineFreienZwischenRaeume) {
														/* alle bereits abgelegten Wörter daraufhin prüfen, ob sie im
														Bereich des Wortes parallel in einer Nachbarspalte verlaufen */
														q.each(abgelegte, function (a) {
															if (a.richtung == "senkrecht"
																&& (a.x == x + 1
																|| a.x == x - 1)
															) {
																if (// Nachbarwort länger?
																	(a.y <= y &&
																	a.wort.y + a.wort.length >= y + wort.wort.length)
																	||
																	// Nachbarwort überlappt Anfang
																	(a.y <= y
																	&& a.y + a.wort.length >= y)
																	||
																	// Nachbarwort beginnt mitten im Wort
																	(a.y > y
																	&& a.y <= y + wort.wort.length)
																) {
																	test = false; // leider nein
																}
															}
															// verläuft ein waagrechtes Wort direkt nebenan?
															if (a.richtung == "waagrecht" &&
																(a.x == x + 1 || a.x == x - wort.wort.length - 1)
															) {
																if (a.y >= y && a.y <= y + wort.wort.length) {
																	test = false; // ja -> verwerfen
																}
															}
														});
													}
												}
												if (wort.richtung == "diagonal-loru") {
													if (grid[y + i][x + i] && grid[y + i][x + i] != wort.wort.substr(i, 1)) {
														test = false;
													}
												}
												if (wort.richtung == "diagonal-luro") {
													if (grid[y - i][x + i] && grid[y - i][x + i] != wort.wort.substr(i, 1)) {
														test = false;
													}
												}
											}

											// Ist vor und nach dem Wort noch Platz? (Kosmetik)
											if (wort.richtung == "waagrecht") {
												if (grid[y][x - 1] || grid[y][x + wort.wort.length])
													test = false;
											}
											if (wort.richtung == "senkrecht") {
												if (grid[y - 1][x] || grid[y + wort.wort.length][x])
													test = false;
											}
											if (wort.richtung == "diagonal-loru") {
												if (grid[y - 1][x - 1] || grid[y + wort.wort.length][x + wort.wort.length])
													test = false;
											}
											if (wort.richtung == "diagonal-luro") {
												if (grid[y + 1][x - 1] || grid[y - wort.wort.length][x + wort.wort.length])
													test = false;
											}

											if (test) {
												// hat gepasst! -> Wort übernehmen lassen!
												wort.x = x;
												wort.y = y;
												erfolglose = new Array(); // erfolglos eingepasste Wörter wieder versuchen
												break; // weitere Tests abbrechen
											}
										}

										if (test)
											break; // weitere Tests abbrechen
									}
								}
							}
						}
					}

					if (wort.x < 0 && wort.y < 0) {
						// hat nicht gepasst! -> merken
						erfolglose.push(wort);

						if (erfolglose.length == (woerter.length - abgelegte.length)) {
							// anscheinend gibt es für die restlichen Wörter überhaupt keine geeignete Stelle... -> ein freies Plätzchen für aktuelles Wort finden! -> oben (0), links(1), unten(2) oder rechts(3)
							makel ++;

							zufall = Math.floor(Math.random() * 4);

							if (zufall & 1 == 1) {
								// links / rechts
								y = Math.floor(grid.length / 2) - Math.floor(wort.wort.length / 2);
								x = (zufall & 2) == 2 ? 0 : grid[0].length; // Wert muss unter- bzw. überboten werden, daher ist er zu klein/groß

							} else {
								// oben / unten
								x = Math.floor(grid[0].length / 2);
								y = (zufall & 2) == 2 ? 0 : grid.length;
							}

							wort.richtung = (zufall & 1) == 0 ? "waagrecht" : "senkrecht";

							// Koordinaten der abgelegten Wörter durchgehen, um freie Stelle zu ermitteln
							q.each(abgelegte, function (a) {
								if ((zufall & 1) == 1) {
									// links / rechts einschränken
									if ((zufall & 2) == 0 && a.x < x)
										x = a.x;

									if ((zufall & 2) == 2) {
										test = a.x;
										if (a.richtung == "waagrecht")
											test += a.wort.length;

										if (test > x)
											x = test;
									}

								} else {
									// oben / unten einschränken
									if ((zufall & 2) == 0 && a.y < y)
										y = a.y;

									if ((zufall & 2) == 2) {
										test = a.y;
										if (a.richtung == "senkrecht")
											test += a.wort.length;

										if (test > y)
											y = test;
									}
								}
							});

							// geeignete Position zum Einpassen gefunden!
							wort.x = (zufall & 2) == 0 ? x - 2 : x + 2;
							wort.y = (zufall & 2) == 0 ? y - 2 : y + 2;

							erfolglose = [];
						}
					}

				} else {
					// es ist das erste Wort -> direkt (senkrecht) einpassen
					wort.x = Math.floor(grid[0].length / 2);
					wort.y = Math.floor(grid.length / 2) - Math.floor(wort.wort.length / 2);
					wort.richtung = "senkrecht";
				}

				// abspeichern wenn Wort erfolgreich eingepasst werden konnte
				if (wort && wort.x >= 0 && wort.y >= 0) {
					abgelegte.push(wort);

					// Buchstaben in das Gitter eintragen
					for (i = 0; i < wort.wort.length; i++) {
						if (wort.richtung == "waagrecht") {
							grid[wort.y][wort.x + i] = wort.wort.substr(i, 1);
						}
						if (wort.richtung == "senkrecht") {
							grid[wort.y + i][wort.x] = wort.wort.substr(i, 1);
						}
						if (wort.richtung == "diagonal-loru") {
							grid[wort.y + i][wort.x + i] = wort.wort.substr(i, 1);
						}
						if (wort.richtung == "diagonal-luro") {
							grid[wort.y - i][wort.x + i] = wort.wort.substr(i, 1);
						}
					}
				}
			}

			// fertig erstelltes und bestücktes Gitter abspeichern
			fertige.push({
				gitter : grid,
				daten : abgelegte,
				makel : makel
			});
		}

		// eventuell wurden nun mehrere Gitter erstellt
		if (makel > 0) {

			// anscheinend wurde kein perfektes Gitter erstellt -> das beste aus den maximal zehn erstellten aussuchen
			test = false;
			q.each(fertige, function (f) {
				if (!test || f.makel < test.makel)
					test = f;
			});

			// bester Versuch wurde ermittelt -> nehmen
			grid = test.gitter;
			abgelegte = test.daten;

		}

		// ausgewähltes Gitter beschneiden
		a = {
			x : {
				min : grid[0].length,
				max : 0
			},

			y : {
				min : grid.length,
				max : 0
			}
		};

		for (y = 0; y < grid.length; y++) {
			for (x = 0; x < grid[0].length; x++) {
				// Zelle befüllt? -> Koordinaten benutzen!
				if (grid[y][x]) {

					// min-Werte bei Bedarf verkleinern!
					a.x.min = (a.x.min > x) ? x : a.x.min;
					a.y.min = (a.y.min > y) ? y : a.y.min;

					// max-Werte  bei Bedarf erhöhen
					a.x.max = (a.x.max < x) ? x : a.x.max;
					a.y.max = (a.y.max < y) ? y : a.y.max;
				}
			}
		}

		// min/max-Maße ermittelt -> Gitterinhalt in beschnittenes Gitter übertragen
		test = new Array(a.y.max - a.y.min + 1);

		for (y = 0; y < (a.y.max - a.y.min + 1); y++) { // zeilenweise
			test[y] = new Array(a.x.max - a.x.min + 1);
			for (x = 0; x < (a.x.max - a.x.min + 1); x++) { // spaltenweise
				if (grid[y + a.y.min][x + a.x.min])
					test[y][x] = grid[y + a.y.min][x + a.x.min]; // Inhalt übertragen
			}
		}

		grid = test; // altes Gitter durch neues ersetzen

		// eingetragene Koordinaten der Wörter korrigieren
		for (i = 0; i < abgelegte.length; i++) {
			abgelegte[i].x = abgelegte[i].x - a.x.min;
			abgelegte[i].y = abgelegte[i].y - a.y.min;
		}

		return { gitter : grid, woerter : abgelegte };
	},


	/* Diese Funktion erzeugt ein Suchsel-Quiz. Dazu braucht sie ein Elternelement mit dem
	CSS-Klassen-Präfix "suchsel", z.B. "suchsel-quiz", wenn "-quiz" das Suffix der Quiz.triggerClass ist.
	Die Daten für das Quiz müssen in einer einspaltigen Tabelle stehen.
	*/

	suchselQuiz : function (div) {
		var q = this,
			i, tabelle;

		var quiz = {
			// Objekt-Gestalt eines Suchsel-Quizzes
			name : "Quiz-x", // Platzhalter - hier steht später etwas anderes.
			typ : "Suchsel-Quiz",
			element : div, // Referenz auf das DIV-Element, in welchem sich das Quiz befindet
			tabelle : null, // Referenz auf das HTML-Element, in dem das Suchsel angezeigt wird
			daten : new Array(), // Hier stehen später Objekte, die die Quiz-Daten enthalten.
			versuche : 0, // Speichert die Anzahl Versuche, die für die Lösung gebraucht wurden.
			sprache : (div.lang && div.lang != "") ? div.lang : "de", // deutsche Meldungen als Voreinstellung
			loesungsliste : null, // Referenz auf ein <ol>-Objekt, in dem bereits gefundene Wörter angezeigt werden
			markierungStart : null, // Referenz auf das erste markierte <td>-Element
			markierungEnde : null, // Referenz auf das letzte markierte <td>-Element

			// Funktion zum Auswerten der Lösungen
			auswerten : function () {
				var t = this,
					el = q.domSelect(".markiert", t.tabelle),
					betroffene = [],
					felder = [];

				if (el.length > 1) {
					t.versuche++;

					// Koordinaten der markierten Felder ermitteln
					q.each(el, function (f) {
						felder.push({
							buchstabe : f.innerHTML,
							x : f.id.replace(/^quiz\d+_(\d+)_.*/i, "$1"),
							y : f.id.replace(/.*_(\d+)$/i, "$1")
						});
					});

					// Jedes Lösungswort prüfen, ob sein Anfangsbuchstabe markiert wurde
					q.each(t.daten, function (d) {
						q.each(felder, function (f) {
							if (d.x == f.x && d.y == f.y) {
								// Lösungswort merken
								betroffene.push(d);
							}
						});
					});

					// Jedes betroffene Lösungswort prüfen, ob es vollständig markiert wurde
					q.each(betroffene, function (b) {
						var erfolg;

						// stimmt die Anzahl markierter Felder exakt?
						if (b.wort.length == felder.length) {
							// prüfen, ob alle markierten Felder auch die richtigen Felder sind
							erfolg = b; // mal davon ausgehen, dass alles passt

							q.each(felder, function (f) {
								if (b.richtung == "senkrecht") {
									// x-Werte immer identisch!
									if (f.x != b.x || f.y < b.y
										|| f.y > b.y + b.wort.length -1
									) {
										erfolg = false;
									}
								}

								if (b.richtung == "waagrecht") {
									// y-Werte immer identisch
									if (f.y != b.y || f.x < b.x
										|| f.x > b.x + b.wort.length -1
									) {
										erfolg = false;
									}
								}

								if (b.richtung == "diagonal-loru") {
									if (f.x - f.y != b.x - b.y
										|| f.x < b.x
										|| f.x > b.x + b.wort.length -1
										|| f.y < b.y
										|| f.y > b.y + b.wort.length -1
									) {
										erfolg = false;
									}
								}

								if (b.richtung == "diagonal-luro") {
									if (Math.abs(f.x) + Math.abs(f.y) != b.x + b.y
										|| f.x < b.x
										|| f.x > b.x + b.wort.length -1
										|| f.y > b.y
										|| f.y < b.y - b.wort.length -1
									) {
										erfolg = false;
									}
								}
							});

							if (erfolg) {
								// "erfolg" enthält das Datenobjekt der Lösung
								q.each(el, function(f) {
									// Markierungen dauerhaft machen
									f.className = f.className.replace(/ markiert/, "") + " aufgedeckt";
								});

								// Fund in die Liste eintragen
								erfolg.eingetragen = false;
								el = q.domSelect("li", t.loesungsliste);

								q.each(el, function (li) {
									// Wort bereits gefunden worden?
									if (li.innerHTML == erfolg.wortOriginal) {
										erfolg.eingetragen = true;
									}

									if (!erfolg.eingetragen &&
										(!li.className || li.className != "ausgefuellt")
									) {
										li.innerHTML = erfolg.wortOriginal;
										li.className = "ausgefuellt";

										erfolg.eingetragen = true;

										if (q.domSelect(
												".ausgefuellt", t.loesungsliste
											).length == el.length
										) {
											// letztes Wort wurde gefunden!
											t.beenden();
										}
									}
								});
							}
						}
					});
				}

				return false;
			},

			// entferne alle Markierungen
			alleMarkierungenEntfernen : function (mitHover) {
				var t = this;

				q.each(q.domSelect(".markiert", t.tabelle), function (f) {
					f.className = f.className.replace(/(^| )markiert/, "");
				});

				if (mitHover) {
					q.each(q.domSelect(".hover", t.tabelle), function (f) {
						f.className = f.className.replace(/(^| )hover/, "");
					});
				}
			},

			// Felder markieren, die die gegenwärtige Auswahl darstellen
			auswahlMarkieren : function () {
				var t = this,
					richtung = "",
					el, ende, start, steigung, x, y;

				/* In welche Richtung geht die Markierung denn?
					-> Zeilenweise die Tabelle durchlaufen,
					um X- und Y-Koordinaten der Markierungsenden zu ermitteln */
				for (y = 0; y < t.tabelle.rows.length; y++) {
					for (x = 0; x < t.tabelle.rows[y].cells.length; x++) {
						if (t.tabelle.rows[y].cells[x] == t.markierungStart) {
							start = { x : x, y : y };
						}

						if (t.tabelle.rows[y].cells[x] == t.markierungEnde) {
							ende = { x : x, y : y };
						}
					}
				}

				// Fehler passiert? -> beenden
				if (!start || !ende) {
					return false;
				}

				// Steigung bestimmen, in der die Markierung erfolgen soll
				if ((ende.y - start.y) === 0) {
					// Division by Zero!
					steigung = 2; // hier genügt ein Wert > 1.5
				} else {
					// Quotient ist "legal"
					steigung = (ende.x - start.x) / (ende.y - start.y);
				}

				// Richtung aus der Steigung und der Koordinaten bestimmen
				if (Math.abs(steigung) >= 0.5 && Math.abs(steigung) <= 1.5) {
					// diagonal
					richtung = steigung > 0 ? "nw-so" : "no-sw";
				} else {
					// waagrecht/senkrecht
					richtung = Math.abs(steigung) > 1 ? "w-o" : "n-s";
				}

				// alle zu markierenden Felder ermitteln und markieren
				x = start.x;
				y = start.y;
				el = t.tabelle.rows[y].cells[x];

				while (el) {
					el.className = el.className.replace(/(^| )markiert/, "") + " markiert";
					// "richtung" enthält nun einen String (n-s|w-o|nw-so|no-sw)
					switch (richtung) {
						case "n-s":
							// nur y-Wert weiterzählen
							if (start.y > ende.y && y > ende.y) {
								y--;
							}

							if (start.y < ende.y && y < ende.y) {
								y++;
							}
						break;

						case "w-o":
							// nur x-Wert weiterzählen
							if (start.x > ende.x && x > ende.x) {
								x--;
							}

							if (start.x < ende.x && x < ende.x) {
								x++;
							}
						break;

						case "nw-so":
							if (start.x > ende.x && x > ende.x
								&&
								start.y > ende.y && y > ende.y
							) {
								x--;
								y--;
							}

							if (start.x < ende.x && x < ende.x
								&&
								start.y < ende.y && y < ende.y
							) {
								x++;
								y++;
							}
						break;

						case "no-sw":
							if (start.x > ende.x && x > ende.x
								&&
								start.y < ende.y && y < ende.y
							) {
								x--;
								y++;
							}

							if (start.x < ende.x && x < ende.x
								&&
								start.y > ende.y && y > ende.y
							) {
								x++;
								y--;
							}
						break;
					}

					// aufhören, wenn kein neues Feld zu markieren ist
					el = (el != t.tabelle.rows[y].cells[x]) ?
						t.tabelle.rows[y].cells[x] : false;
				}
			},

			// Quiz wurde erfolgreich gelöst -> Meldung ausgeben
			beenden : function () {
				var t = this;

				t.element.appendChild(q.domCreate({
					tagName : "p",
					className : q.bewertungsClass,
					text : q.meldungen[t.sprache]["lob" + (t.versuche > 2 ? 3 : t.versuche)]
						+ " "
						+ q.meldungen[t.sprache][
							"ergebnis" + (t.versuche > 2 ? 3 : t.versuche)
						].replace(/%n/i, t.versuche)
				}));

				// Auswertungs-Button und alle Eventhandler entfernen
				t.tabelle.onmousedown = null;
				t.tabelle.onmousemove = null;
				t.tabelle.onmouseover = null;
				t.tabelle.onmouseup = null;
				t.solved = true;
				t.element.className += " "+q.fertigClass;
			},

			// Funktion zum Errichten der Tabelle des Suchsel-Quiz und zum Einrichten der Eventhandler
			init : function () {
				var t = this,
					kreuzwortGitter, platzhalter, tr, x, y;

				// Spracheinstellungen auf deutsch zurück korrigieren, falls entsprechende Sprachdaten fehlen
				if (!q.meldungen[t.sprache]) {
					t.sprache = "de";
				}

				// Gitter erzeugen
				kreuzwortGitter = q.erstelleWoerterGitter(
					t.daten,
					true, // true für "alle Wörter verbunden"
					true  // true für "diagonale Wörter möglich"
				);

				// Daten und Gitter abspeichern
				t.daten = kreuzwortGitter.woerter;
				t.grid = kreuzwortGitter.gitter;

				// Lösungsliste befüllen
				platzhalter = 0;
				q.each(t.daten, function (d) {
					if (platzhalter < d.wortOriginal.length) {
						platzhalter = d.wortOriginal.length;
					}
				});

				platzhalter = new Array(platzhalter +3).join("_");

				q.each(t.daten, function (d) {
					t.loesungsliste.appendChild(q.domCreate({
						tagName : "li",
						text : platzhalter
					}));
				});

				// Tabelle befüllen
				for (y = 0; y < t.grid.length; y++) {
					tr = t.tabelle.insertRow(
						t.tabelle.rows.length <= 0 ? 0 : t.tabelle.rows.length
					);

					for (x = 0; x < t.grid[0].length; x++) {
						// Zelleninhalt vorbereiten
						tr.appendChild(q.domCreate({
							tagName : "td",
							id : t.name + "_" + x + "_" + y,
							text : t.grid[y][x] ?
								t.grid[y][x] : String.fromCharCode(
									65 + Math.floor(Math.random() * 26)
								).toUpperCase()
						}));
					}
				}

				// ID für das umgebende DIV-Element vergeben
				t.element.id = t.name;

				// Markierungsmechanismus einrichten
				t.tabelle.onmousedown = function (e) {
					var el = q.eventElement(e);

					if (el.tagName && el.tagName.match(/^td$/i)) {
						el.className = el.className.replace(/(^| )hover/, "") + " markiert";

						// Beginn der Markierung merken
						t.markierungStart = el;

						// Markiermodus einschalten
						t.markiermodus = true;

						// Markierungseffekt im IE unterbinden
						q.antiMarkierungsModusFuerIE(true);

						// Markierungseffekt in W3C-konformen Browsern unterbinden
						if (window.getSelection) {
							window.getSelection().removeAllRanges();
						}
					}
					e.preventDefault();
					return true;
				};
				t.tabelle.addEventListener("touchstart",t.tabelle.onmousedown);
				t.tabelle.onmouseover = function (e) {
                    var el = q.eventElement(e);


					if (el.tagName && el.tagName.match(/^td$/i) && t.markiermodus) {
						t.markierungEnde = el;
						// bestehende Markierungen entfernen
						t.alleMarkierungenEntfernen();

						// neue Markierungen setzen
						t.auswahlMarkieren();
					}
                    e.preventDefault();

					return true;
				};

				t.tabelle.onmousemove = function (e) {
					var el = q.eventElement(e);

					if (!t.markiermodus) {
						t.alleMarkierungenEntfernen(true); // mit Hover

						// setze hover-Markierung für aktuelles Element
						if (el.tagName && el.tagName.match(/^td$/i)) {
							el.className += " hover";
						}

					} else {
						// Markierungseffekt in W3C-konformen Browsern unterbinden
						if (window.getSelection) {
							window.getSelection().removeAllRanges();
						}
					}

					return true;
				};
                t.tabelle.addEventListener("touchmove",t.tabelle.onmouseover);
                t.tabelle.addEventListener("touchmove",t.tabelle.onmousemove);

				t.element.onmouseup = function (e) {
					// markierte Felder auswerten
					t.auswerten();

					// alle Markierungen entfernen
					t.alleMarkierungenEntfernen();

					// Beende Markiermodus
					t.markiermodus = false;

					// Markierungseffekt im IE wieder erlauben
					q.antiMarkierungsModusFuerIE();

					return true;
				};
                t.element.addEventListener("touchend",t.element.onmouseup);
                t.element.addEventListener("touchcancel",t.element.onmouseup);

				t.tabelle.onmouseout = function (e) {
					if (!t.markiermodus) {
						// entferne alle Markierungen (samt hover)
						t.alleMarkierungenEntfernen(true);
					}
				};
			}
		};

		// Laufende Nummer ermitteln -> Quiz-Name wird "quiz" + laufende Nummer
		i = 0;
		q.each(q.alleQuizze, function() {
			i++;
		});
		quiz.name = "quiz" + i;

		// Gibt es Quiz-Daten?
		tabelle = q.domSelect("table", div);

		if (tabelle.length < 1) {
			return false;
		}

		// Daten sind also vorhanden? -> Auswerten
		q.each(tabelle[0].rows, function (tr) {
			var gefunden;

			if (tr.cells.length > 0) {
				// "Müll" entfernen
				gefunden = tr.cells[0].innerHTML.replace(
					/<\/?[^>]+>/g, ""
				).replace(
					/&amp;/g, "&"
				).replace(
					/&nbsp;/g, " "
				).replace(
					/ /g, "_"
				).quizTrim();

				if (gefunden != "") {
					quiz.daten.push({
						// Lösungswort in reine Großbuchstaben umwandeln
						wort : q.wandleZeichen(gefunden).toUpperCase(),
						wortOriginal : gefunden,
						x : -1,
						y : -1
					});
				}
			}
		});

		// Keine brauchbare Daten? -> Verwerfen!
		if (quiz.daten.length < 1) {
			return false;
		}

		// originale Tabelle durch leere Tabelle ersetzen
		quiz.tabelle = q.domCreate({
			tagName : "table",
			className : "gitter"
		});
		tabelle[0].parentNode.insertBefore(quiz.tabelle, tabelle[0].nextSibling);
		tabelle[0].parentNode.removeChild(tabelle[0]);

		// Liste mit gefundenen Lösungen erstellen
		quiz.loesungsliste = q.domCreate({
			tagName : "ol",
			className : "liste"
		});
		div.appendChild(quiz.loesungsliste);

		// Quiz in die Liste aufnehmen und initialisieren
		q.alleQuizze[quiz.name] = quiz;
		quiz.element.quiz = quiz;
		quiz.init();

		return true;
	},


	/* Diese Funktion erzeugt ein Quiz, das man auch als Hangman-Quiz kennt. Es müssen die Buchstaben
	eines Wortes geraten werden, um zu einer Lösung zu geraten. Zu viele Fehlversuche führen zum Verlieren
	des Spiels. */

	buchstabenratenQuiz : function (div) {
		var q = this,
			i, tabelle, test, daten, gefunden;

		var quiz = {
			// Objekt-Gestalt eines Suchsel-Quizzes
			name : "Quiz-x", // Platzhalter - hier steht später etwas anderes.
			typ : "Buchstabenraten-Quiz",
			element : div, // Referenz auf das DIV-Element, in welchem sich das Quiz befindet
			feld : null, // Referenz auf das HTML-Element, in dem das eigentliche Spiel angezeigt wird
			daten : new Array(), // Hier stehen später Objekte, die die Quiz-Daten enthalten.
			versuche : 0, // Speichert die Anzahl Versuche, die für die Lösung gebraucht wurden.
			sprache : (div.lang && div.lang != "") ? div.lang : "de", // deutsche Meldungen als Voreinstellung
			erkannteWoerter : new Array(), // speichert die bereits erratenen Wörter
			gestartet : false, // Steuert, ob Tastatureingaben überhaupt ausgewertet werden
			bilder : new Array(
				/* Hier stehen die Bilddateien für die verschiedenen Stadien der Grafik, die das drohende
				Spielende darstellt. Dabei gilt die erste Grafik als Spielende und die letzte Grafik als Spielstart. */
				"blume00.gif",
				"blume01.gif",
				"blume02.gif",
				"blume03.gif",
				"blume04.gif",
				"blume05.gif",
				"blume06.gif",
				"blume07.gif",
				"blume08.gif",
				"blume09.gif",
				"blume10.gif"
			),

			// Funktion zum Auswerten der Lösungen
			auswerten : function (keyCode) {
				var t = this,
					c = q.wandleZeichen(String.fromCharCode(keyCode)),
					schonGeraten, treffer, ul, li;

				if (c) {
					ul = q.domSelect(".geratene-buchstaben ul", t.element)[0]; // Element muss vorhanden sein

					// testen, ob dieser Buchstabe bereits geraten worden war
					q.each(ul.childNodes, function (li) {
						if (li.firstChild.data == c) {
							schonGeraten = true;
						}
					});
					if(schonGeraten)
						return;
					// noch nicht geraten worden? -> auf Treffer testen
					if (!schonGeraten) {
						li = q.domCreate({
							tagName : "li",
							text : c
						});

						ul.appendChild(li);

						// Ist der Buchstabe im Lösungswort enthalten?
						ul = q.domSelect(".ratewort ", t.element)[0]; // Element ist garantiert vorhanden

						q.each(ul.childNodes, function (l) {
							if (l.buchstabe == c) {
								treffer = true;
								l.className = "erraten";
								l.firstChild.data = l.buchstabe;
								li.className = "treffer";
							}
						});
					}

					// Ergebnis?
					if (!treffer) {
						t.versuche++;

						// Statusbild aktualisieren
						q.domSelect(".statusbild img", t.feld)[0].src = q.baseURL
							+ "/images/"
							+ t.bilder[t.bilder.length - 1 - t.versuche];

						// Spiel zu Ende?
						if (t.versuche == t.bilder.length - 1) {
							t.beenden();
						}

					} else {
						// Wort komplett erkannt?
						q.each(ul.childNodes, function (li) {
							// ul ist #ratewort! Prüfen ob alle Felder einen Buchstaben enthalten
							if (li.firstChild.data == String.fromCharCode(160)) {
								treffer = false; // nicht alle Buchstaben sind schon erkannt
							}
						})

						if (treffer) {
							// nächstes Wort erraten lassen
							t.erkannteWoerter.push(t.daten[t.erkannteWoerter.length]);

							if (t.versuche > 0) {
								t.versuche--;
							}

							window.setTimeout(
								function () {
									t.wortAbfragen();
								},
								2000
							);
						}
					}
				}
			},

			// Funktion zum starten des Quiz-Vorgangs
			wortAbfragen : function () {
				var t = this,
					platzhalter, i;

				// "Spielfeld" aufbauen
				while (t.feld.firstChild) {
					t.feld.removeChild(t.feld.firstChild);
				}

                var input = document.createElement("input");
                t.feld.appendChild(input);
                input.style.width=0;
                input.style.height=0;
                input.style.opacity=0;
                input.focus();
                t.feld.addEventListener("click",function(){input.focus()});
                input.addEventListener("keyup",function(e){
                    if (q.aktivesQuiz === t && !t.solved && t.gestartet) {
                        var str=this.value;
                    	t.auswerten(str.charCodeAt(str.length - 1));
                    	this.value="";
                    }
				});

				if (t.erkannteWoerter.length < t.daten.length) {
					// Statusbild einfügen
					t.feld.appendChild(q.domCreate({
						tagName : "p",
						className : "statusbild"
					}));

					t.feld.lastChild.appendChild(q.domCreate({
						tagName : "img",
						src : q.baseURL + "images/" + t.bilder[t.bilder.length - 1 - t.versuche]
					}));

					// Eingabehinweis
					t.feld.appendChild(q.domCreate({
						tagName : "p",
						className : "eingabehinweis",
						// Anzeigen des verdeckten <span>-Elementes bei Hover (für IE notwendig)
						onmouseover : function () {
							this.childNodes[0].style.display = "block";
						},
						// Verbergen des verdeckten <span>-Elementes beim Verlassen
						onmouseout : function () {
							this.childNodes[0].style.display = "";
						}
					}));

					t.feld.lastChild.appendChild(q.domCreate({
						tagName : "span",
						text : q.meldungen[t.sprache].eingabehinweis_buchstabenraten
					}));

					// Leerfelder für das zu erratende Wort aufbauen
					t.feld.appendChild(q.domCreate({
						tagName : "ul",
						className : "ratewort",
						wort : t.daten[t.erkannteWoerter.length].wort
					}));

					q.each(t.daten[t.erkannteWoerter.length].wort.split(""), function (c) {
						t.feld.lastChild.appendChild(q.domCreate({
							tagName : "li",
							text: String.fromCharCode(160),
							buchstabe : q.wandleZeichen(c)
						}));
					});
				}

				// Liste bereits gefundener Wörter erstellen
				platzhalter = 0;
				q.each(t.daten, function (d) {
					if (platzhalter < d.wort.length) {
						platzhalter = d.wort.length;
					}
				});

				platzhalter = new Array(platzhalter +3).join("_");

				t.feld.appendChild(q.domCreate({
					tagName : "div",
					className : "erkannte-woerter"
				}));

				t.feld.lastChild.appendChild(q.domCreate({
					tagName : "p",
					text: q.meldungen[t.sprache].erkannteWoerter
				}));

				t.feld.lastChild.appendChild(q.domCreate({
					tagName : "ol"
				}));

				for (i = 0; i < t.daten.length; i++) {
					t.feld.lastChild.lastChild.appendChild(q.domCreate({
						tagName : "li",
						className : t.erkannteWoerter[i] ? "erkannt" : "",
						text : t.erkannteWoerter[i] ?
							t.erkannteWoerter[i].wortOriginal : platzhalter
					}));
				}

				if (t.erkannteWoerter.length < t.daten.length) {
					// Liste bereits geratener Buchstaben erstellen
					t.feld.appendChild(q.domCreate({
						tagName : "div",
						className : "geratene-buchstaben"
					}));

					t.feld.lastChild.appendChild(q.domCreate({
						tagName : "p",
						text: q.meldungen[t.sprache].gerateneBuchstaben
					}));

					t.feld.lastChild.appendChild(q.domCreate({
						tagName : "ul"
					}));

					// Tastatureingabe einschalten
					t.gestartet = true;

				} else {
					// Quiz schon zu ende gespielt?
					t.beenden();
				}
			},

			// Meldung zu Spielende ausgeben + Neustart-Button
			beenden : function () {
				var t = this;

				// erneutes Spiel anbieten
				t.feld.appendChild(t.startLink);
				t.startLink.firstChild.data = q.meldungen[t.sprache].erneut;

				t.solved = true;
				t.element.className += " "+q.fertigClass;
			},

			// Quiz initialisieren
			init : function () {
				var t = this;

				// ID für das umgebende DIV-Element vergeben
				t.element.id = t.name;

				// Start-Link erzeugen
				t.startLink = q.domCreate({
					tagName : "p",
					className : "start-link",
					text : q.meldungen[t.sprache].quizStarten,
					onclick : function () {
						t.solved = false;
						t.element.className = t.element.className.replace(
							new RegExp(" ?" + q.fertigClass), ""
						);
						t.daten.shuffle();
						t.versuche = 0;
						t.erkannteWoerter = new Array();
						t.wortAbfragen();
					}
				});

				t.feld.appendChild(t.startLink);


			}
		};

		// Laufende Nummer ermitteln -> Quiz-Name wird "quiz" + laufende Nummer
		i = 0;
		q.each(q.alleQuizze, function () {
			i++;
		});
		quiz.name = "quiz" + i;

		// Gibt es Quiz-Daten?
		tabelle = q.domSelect("table", div);

		if (tabelle.length < 1) {
			return false;
		}

		// Daten sind also vorhanden? -> Auswerten
		q.each(tabelle[0].rows, function (tr) {
			var gefunden;

			if (tr.cells.length > 0) {
				// "Müll" entfernen
				gefunden = tr.cells[0].innerHTML.replace(
					/<\/?[^>]+>/g, ""
				).replace(
					/&amp;/g, "&"
				).replace(
					/&nbsp;/g, " "
				).replace(
					/ /g, "_"
				).quizTrim();

				if (gefunden != "") {
					quiz.daten.push({
						// Lösungswort in reine Großbuchstaben umwandeln
						wort : q.wandleZeichen(gefunden).toUpperCase(),
						wortOriginal : gefunden,
						x : -1,
						y : -1
					});
				}
			}
		});

		// Keine brauchbare Daten? -> Verwerfen!
		if (quiz.daten.length < 1) {
			return false;
		}

		// originale Tabelle entfernen
		tabelle[0].parentNode.removeChild(tabelle[0]);

		// "Spielfeld" erstellen und ins Dokument schreiben
		quiz.feld = q.domCreate({ tagName : "div" });
		quiz.element.appendChild(quiz.feld);

		// Quiz in die Liste aufnehmen und initialisieren
		q.alleQuizze[quiz.name] = quiz;
		quiz.element.quiz = quiz;
		quiz.init();

		return true;
	},


/*
==================
 weitere Funktionen
==================
 */
	// Zeichen in eintragbare Buchstaben umwandeln: "s" ist ein String
	wandleZeichen : function (s) {
		var q = this,
			r = "",
			z, i, j;

		for (i = 0; i < s.length; i++) {
			if (s[i] == String.fromCharCode(160) || s[i] == String.fromCharCode(32)) {
				r += String.fromCharCode(160);

			} else {
				for (z in q.codeTabelle) {
					if (z.match(/^[A-Z][A-Z]?$/)) {
						for (j = 0; j < q.codeTabelle[z].length; j++) {
							if (s.substr(i, 1) == q.codeTabelle[z][j]) {
								r += z;
							}
						}
					}
				}
			}
		}

		return r;
	},

	initQuizze : function () {
		var q = this;

		// deutsche Sprachausgabe als Default
		if (!q.meldungen) {
			q.meldungen = {};
		}

		if (!q.meldungen.de) {
			// Voreinstellungen für Mehrsprachigkeit
			q.meldungen.de = {
				pruefen : 'prüfen!',
				lob1 : 'Ausgezeichnet!',
				lob2 : 'Gut gemacht!',
				lob3 : 'Das war nicht schlecht!',
				ergebnis1 : 'Die Aufgabe wurde gleich beim ersten Versuch erfolgreich gelöst!',
				ergebnis2 : 'Die Aufgabe wurde nach nur zwei Versuchen erfolgreich gelöst!',
				ergebnis3 : 'Die Aufgabe wurde nach %n Versuchen erfolgreich gelöst!',
				alleGefunden : 'Alle Sets gefunden!', // memo-quiz - Es können auch Triplets, Quartette und mehr gefunden werden müssen
				erneut : 'Wie wär\'s mit einer neuen Runde?',
				ergebnisProzent : 'Die Antworten sind zu %n% richtig.', // Multiple-Choice-Quiz
				senkrecht : 'Senkrecht', // Kreuzworträtsel
				waagrecht : 'Waagrecht',
				eingabehinweis : 'Klicken Sie auf ein gr\u00fcnes Feld, um einen Buchstaben einzugeben!',
				eingabehinweis_buchstabenraten : 'Benutzen Sie die Tastatur zur Eingabe! Eventuell m\u00fcssen Sie erst in das Quiz klicken, um es zu aktivieren.'
			};
		}

		// prüfen, ob Code-Tabelle für UTF-8-Normalisierung und Mehrsprachenunterstützung geladen wurden
		if (!q.codeTabelle || !q.meldungen.en || !q.domSelect) {
			window.setTimeout(q.initQuizze, 100);
			return false;
		}

		// Initialisierung der Quizze
		var quizBereiche = new Array(),
			muster = new RegExp(q.triggerClass),
			i, j, a, gefunden, typ, ok, css;

		// Alle DIVs daraufhin überprüfen, ob sie eine CSS-Klasse haben, die auf ein Quiz schließen lässt
		q.each(q.domSelect("div"), function (d) {
			if (d.className && d.className.match(muster)) {
				quizBereiche.push(d);
			}
		});

		// Alle Quiz-Bereiche gefunden -> Initialisieren
		if (quizBereiche.length > 0) {
			q.each(quizBereiche, function (d) {
				var typ = d.className.replace(/([^ ,]+)-quiz/, "$1"),
					gefunden, ok; // Initialisierung ok?

				if (typeof(q[typ + "Quiz"]) == "function") {
					ok = q[typ + "Quiz"](d); // entsprechende Quiz-Funktion zum Erstellen aufrufen
				}

				// Initialisierung OK? -> Warnungen entfernen
				if (ok) {
					q.each(q.domSelect(".js-hinweis", d), function (j) {
						j.parentNode.removeChild(j);
					});
				}
			});
		}

		// Wenn mindestens ein Quiz initialisiert wurde, dann Seite "bestücken".
		if (q.alleQuizze.quiz0) {
			// CSS für Quizbereiche einbinden
			q.domSelect("head")[0].appendChild(
				q.domCreate({
					tagName : "link",
					rel : "stylesheet",
					type : "text/css",
					media : "screen, projection",
					href : q.baseURL + "css/quiz.css"
				})
			);

			// Print-CSS für Quizbereiche einbinden
			q.domSelect("head")[0].appendChild(
				q.domCreate({
					tagName : "link",
					rel : "stylesheet",
					type : "text/css",
					media : "print",
					href : q.baseURL + "css/quiz-print.css"
				})
			);

			// IE-spezifische Stylesheets einbinden
			/*@cc_on
				@if (@_jscript_version == 5.6)
					// zusätzliches Stylesheet für IE6 einbinden
					q.domSelect("head")[0].appendChild(
						q.domCreate({
							tagName : "link",
							rel : "stylesheet",
							type : "text/css",
							media : "screen, projection",
							href : q.baseURL + "css/quiz-ie6.css"
						})
					);
				@end

				@if (@_jscript_version == 5.7)
					// zusätzliches Stylesheet für IE7 einbinden
					q.domSelect("head")[0].appendChild(
						q.domCreate({
							tagName : "link",
							rel : "stylesheet",
							type : "text/css",
							media : "screen, projection",
							href : q.baseURL + "css/quiz-ie7.css"
						})
					);
				@end
			@*/

			// Links innerhalb eines Quizzes solange deaktivieren, bis es gelöst ist:
			q.each(q.alleQuizze, function (a) {
				if (a.felder) {
					q.each(a.felder, function (f) {
						gefunden = [];

						if (f.getElementsByTagName) {
							gefunden = f.getElementsByTagName("a");
						}

						if (f.element && f.element.getElementsByTagName) {
							gefunden = f.element.getElementsByTagName("a");
						}

						q.each(gefunden, function (g) {
							g.quiz = a;
							g.oldOnClick = g.onclick;
							g.onclick = q.linkOnClick; // neue onclick-Funktion, die Klicks blocken kann
						});
					});
				}

				// onclick-EventHandler für jedes <div> eines Quizzes setzen
				if (typeof a.element.onclick == "function") {
					a.element.oldOnClick = a.element.onclick;
				}

				a.element.onclick = function (e) {
					q.aktivesQuiz = this.quiz;
					if (typeof this.oldOnClick == "function") {
						this.oldOnClick(e);
					}
					return true;
				};
			});
		}
	},

	// neue onclick-Funktion für Links
	linkOnClick : function (e) {
		if (this.quiz.typ == "Multiple Choice - Quiz"
			|| this.quiz.typ == "Buchstabenraten-Quiz"
			|| this.quiz.solved
		) {
			if (typeof this.oldOnClick == "function") {
				this.oldOnClick(e);
			}

			return true;
		}

		return false;
	},

	/* Funktionen für Drag&Drop-Mechanismus */
	eventElement : function (e) {
		// ermittle aktuelles Element unter dem Mauszeiger
		e = e || window.event;
        if (e.touches) {
            var changedTouch = e.touches[0];
            return document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
        }
		return e.target || e.srcElement; // W3C DOM <-> IE
	},

	auswahl : function (element, ziel) {
		if (!Quiz.baseURL)
			Quiz.init();

		if (ziel) {
			// Drag&Drop hat stattgefunden!
			Quiz.aktivesQuiz.dragNDropAuswerten(element, ziel);
		}

		// User-Eingabe war "nur ein Klick"...
		return false;
	},

	startDrag : function (e) {
		var q = Quiz,
			muster = new RegExp("(^|\\s)" + q.draggableClass + "(\\s|$)"),
			test;
		q.dragElm = q.eventElement(e);

		test = q.dragElm;

		/* Nur bei Klick auf ein entsprechend ausgezeichnetes Element
			(oder eines seiner Nachfahren-Elemente) Drag&Drop-Verhalten zeigen! */
		while (test != document.body
			&& (!test.className
				|| !test.className.match(muster)
		)) {
			test = test.parentNode;
		}

		if (test != document.body && test.className.match(muster)) {
			q.dragElm = test;
			q.dragMode = true;

			q.dragElm.className = q.dragElm.className.replace(
				new RegExp(q.draggedClass, "g"),
				""
			).trim();

			q.dragElm.className += " " + q.draggedClass;

			e.preventDefault();

			// aktives Quiz eintragen
			q.aktivesQuiz = q.alleQuizze[q.dragElm.id.replace(/_.+/, "")];
		}

		return !q.dragMode;
	},
	touchStart : function (e) {
        var left = e.touches[0].clientX;
        var top = e.touches[0].clientY;
        Quiz.lastCoords.left = left;
        Quiz.lastCoords.top = top;
    },
    whileMove : function (e) {
        var q = Quiz;
		var left = e.clientX;
		var top = e.clientY;

		if(e.touches) {
            left = e.touches[0].clientX;
            top = e.touches[0].clientY;
        }

        dx = q.lastCoords.left - left;
        dy = q.lastCoords.top - top;

        // Mauskoordinaten speichern
        q.lastCoords.left = left;
        q.lastCoords.top = top;

        // falls gerade kein Element gezogen wird, hier beenden
        if (!q.dragElm || !q.dragMode) {
            return true;
        }

        // zu ziehendes Element bewegen
        q.dragElm.style.visibility='';
        q.dragElm.style.position='relative';

        q.dragged = true;

        e.preventDefault();

        // Abstand zu den letzten Mauskoordinaten berechnen
        var lastLeft=0;
        var lastTop=0;

        if(q.dragElm.style.left) {
            lastLeft = parseFloat(q.dragElm.style.left);
            lastTop = parseFloat(q.dragElm.style.top);
        }
        q.dragElm.style.left = lastLeft - dx + "px";
        q.dragElm.style.top = lastTop - dy  + "px";

		q.highlightTarget();
        return true;
    },
    highlightTarget : function () {
        var q = Quiz;
        var rectDrag=q.dragElm.getBoundingClientRect();
        var elements=q.aktivesQuiz.element.getElementsByClassName(q.aktivesQuiz.loesungsClass);
        q.highlightElm=null;
        q.each(elements,function(element){
            var rect=element.getBoundingClientRect();
            element.className = element.className.replace(q.highlightClass,"").trim();
            if(rect.top<q.lastCoords.top &&
				rect.left<q.lastCoords.left &&
				rect.bottom>q.lastCoords.top &&
				rect.right>q.lastCoords.left){
            	element.className += " "+q.highlightClass;
            	q.highlightElm=element;
			}

        });

    },

	stopDrag : function (e) {
		var q = Quiz,
			returnVal;

		if (!q.dragElm || !q.dragElm.className) {
			return false;
		}

		// Anti-Markier-Effekt in IE beenden
		q.antiMarkierungsModusFuerIE();

		if (q.dragged) {
			// eventuelle aktive Eingabefelder deaktivieren - aber nur wenn Drag&Drop stattgefunden hat!
			q.each(q.domSelect("input"), function (i) {
				try { i.blur(); }
				catch (e) { }

				try { i.onblur(); }
				catch (e) { }
			});
		}

		// bewegtes Element wieder eingliedern
		q.dragElm.className = q.dragElm.className.replace(
			new RegExp(q.draggedClass, "g"),
			""
		).trim();

		// Sichtbarkeit wurde nur verändert, wenn das Element wirklich gezogen wurde...
		if (q.dragged) {
			q.dragElm.style.visibility = q.dragElmOldVisibility;
			q.dragElmOldVisibility = "";
		}

		// Position (nur!) bei Feldern wieder zurückstellen
		if (q.dragElm.className.match(new RegExp("(^|\\s)" + q.feldClass + "(\\s|$)"))
			&& q.dragged
		) {
			q.dragElm.style.top = "";
			q.dragElm.style.left = "";
		}

		// Rückgabewert bereitstellen
		returnVal = q.dragged ?
			// für Drag&Drop
			q.auswahl(q.dragElm, q.highlightElm) :
			// für einen simplen Klick (zweiter Parameter false!)
			q.auswahl(q.dragElm, false);

		// Variablen wieder löschen
		q.dragElm = null;
		q.dragged = false;
		q.dragMode = false;

		// gehighlightetes Element wieder abstellen
		if (q.highlightElm) {
			q.highlightElm.className = q.highlightElm.className.replace(
				new RegExp(" ?" + q.highlightClass), ""
			);
			q.highlightElm = null;
		}

		return returnVal;
	},

	einBlender : function (e) {
		var q = Quiz;

		if (q.dragElm) {
			q.dragElm.style.visibility = q.dragElmOldVisibility;
		}

		return true;
	},

	antiMarkierungsModusFuerIE : function (schalter) {
		var q = this;

		if (schalter) {
			// Anti-Markierungs-Effekt für IE einschalten
			q.oldDocOnSelectStart = document.onselectstart;
			q.oldDocOnDragStart = document.ondragstart;
			document.onselectstart = function () { return false;};
			document.ondragstart = function () { return false;};

		} else {
			// Anti-Markier-Effekt für IE beenden
			if (q.oldDocOnSelectStart
				|| typeof(document.onselectstart) == "function"
			) {
				document.onselectstart = q.oldDocOnSelectStart;
			}

			if (q.oldDocOnDragStart
				|| typeof(document.ondragstart) == "function"
			) {
				document.ondragstart = q.oldDocOnDragStart;
			}
		}
	}

};

/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

					/* falls through */
				case "last":
					while ( (node = node.nextSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
if (!window.Quiz)
	window.Quiz = new Object();

window.Quiz.domSelect = Sizzle;

})();

// initialisieren
Quiz.init();
