/* all 35 cards of The Elemental Five, with the short texts Ariën approved */
const DATA = {
  "intro": [
    "Dit is een spel waarmee jij jezelf op een nieuwe manier leert kennen. Vanuit je gevoel. Vanuit hoe je beweegt. Een spel die je richting en groei kan geven. En die je kan helpen om de mensen om je heen beter te begrijpen. En wellicht beter met ze om te kunnen gaan.",
    "The elemental five is ontwikkeld vanuit the big 5. Dit is het meest onderzochte en wetenschappelijk onderbouwde persoonlijkheidsmodel. Zeer functioneel, maar wel heel erg vanuit het hoofd. En puur kijkend naar je gedrag, dus niet hoe het voor je voelt!",
    "Om die reden hebben wij de eeuwenoude tradities van de 5 elementen gebruikt. Deze archetypen zijn diep in onze cultuur en gevoel ingesleten en vormen zo een nieuwe toegangsweg naar jouw big 5.",
    "Het spel is zowel 1-op-1 te spelen als in groepen. Bij individueel spelen leest iemand de kaarten voor aan de speler, die vervolgens keuzes moet maken. Groepen kunnen gebruik maken van de vloertegels, die als een opstelling helpen bij het kiezen. Meer informatie vind je op www.innergames.nl. Heel veel ontdekkingen en speelplezier toegewenst!"
  ],
  "elements": [
    {
      "id": "vuur",
      "name": "Vuur",
      "cards": [
        {
          "n": 1,
          "title": "Vuur",
          "text": [
            "Vuur staat voor warmte, voor energie. Vuur staat voor raken, inspireren en anderen in beweging brengen.",
            "Vuur is krachtig. Vuur kan snel zijn, fel en onvoorspelbaar. Het kan knetteren, oplaaien en soms ook pijn doen.",
            "Maar vuur brengt leven. Het geeft richting, passie en de moed om te beginnen."
          ],
          "pause": "Probeer te voelen hoe het vuur in jou brandt. Neem hier even de tijd voor.",
          "q": "Hoe vurig ben jij?",
          "short": "Warmte, energie, passie. Vuur zet dingen in beweging, soms fel en knetterend.",
          "shortPause": "Voel even hoe het vuur in jou brandt."
        },
        {
          "n": 2,
          "title": "Uitstralen",
          "text": [
            "Uitstralen staat voor mensen raken, inspireren en in beweging brengen.",
            "Uitstralen betekent niet wachten, maar meteen ergens mee beginnen. Uitstralen betekent dat het vuur dat in jou brandt, naar buiten wil gaan, en alles om je heen wil verwarmen."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jij wacht niet, jij begint. Jouw vuur wil naar buiten en alles om je heen verwarmen.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 3,
          "title": "Ontvangen",
          "text": [
            "Ontvangen betekent dat je geraakt wordt door mensen. Dat mensen en dingen je kunnen inspireren en dat dit je diep kan raken.",
            "Ontvangen betekent ook dat je soms liever wilt wachten om te kijken wat een situatie brengt. Om het te wegen en beter te voelen.",
            "Die inspiratie van buitenaf kan het vuur in jouzelf sterker maken zodat je diep binnenin jouzelf mooie dingen kunt laten groeien."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jij laat je raken door mensen en ideeën. Eerst voelen en wegen, dan groeit het vuur van binnen.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 4,
          "title": "Schitteren",
          "text": [
            "Met jouw vuur raak je de ander, inspireer je en straal je vanuit positieve energie. Anderen kunnen jou bewonderen om het initiatief dat jij durft te nemen, de ideeën die jij hebt en de kracht om het voortouw te nemen.",
            "Niet omdat jij die aandacht nodig hebt, maar omdat jij de energie hebt om anderen te verlichten of in beweging te krijgen. Dit hoeven niet alleen maar grote dingen te zijn, maar zit soms in hele kleine dingen. Net dat ene zetje."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jij neemt het voortouw en geeft anderen net dat ene zetje. Niet voor de aandacht, gewoon omdat je energie hebt.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 5,
          "title": "Knetteren",
          "text": [
            "Jouw vuur kan soms knetteren. Schuren of wringen. Met de buitenwereld, of juist in jezelf.",
            "Maar die schuring kan de boel wel in beweging zetten. En dat vind je belangrijk. Anderen kunnen soms moeite met je hebben, omdat je niet altijd voor de makkelijke weg kiest.",
            "Blijf jezelf afvragen of je iets voor jezelf doet of voor de buitenwereld, zodat alles de goede kant op beweegt!"
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jouw vuur schuurt soms een beetje. Lastig voor anderen, maar zo komt er wel beweging in.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 6,
          "title": "Open",
          "text": [
            "Je voelt je verwarmd door alle mooie dingen om je heen die je laat binnenkomen. Ze inspireren jou, ze raken jou.",
            "Open betekent dat je geïnspireerd kunt raken van van alles. Ook dingen die heel anders zijn dan wat jij normaal zou verzinnen.",
            "Die mooie dingen koester je, en gebruik je om mooie diamanten in jezelf te laten groeien."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Alles kan jou inspireren, ook dingen die heel anders zijn dan jij. Je koestert het en laat het groeien.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 7,
          "title": "Gesloten",
          "text": [
            "Diep van binnen bewaar jij de schatten die zo mooi en waardevol zijn dat je niet zeker weet of je ze wel wil delen. Gesloten betekent dat je vooral geïnspireerd kunt raken van dingen die passen bij jouw wereldbeeld.",
            "De manier waarop jij in de wereld kijkt is dat er best wel wat mensen en plekken zijn die jou angst inboezemen. Gebeurtenissen kunnen jou diep raken en van jouw stuk brengen. Het vuur kan zich tegen jou keren."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jouw schatten bewaar je diep van binnen. Je laat vooral binnen wat bij jouw wereld past.",
          "shortPause": "Voel even: beweeg jij zo?"
        }
      ]
    },
    {
      "id": "lucht",
      "name": "Lucht",
      "cards": [
        {
          "n": 1,
          "title": "Lucht",
          "text": [
            "Luchtig. De energie van lucht gaat over vrijheid. Het gaat over vrij rondzweven. Het gaat over fantasie. Je kunt verzinnen en dromen wat je wilt.",
            "Het gaat ook over grappig zijn, grapjes maken, humor. En het gaat over jouw dromen, jouw ideeën en jouw creativiteit."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Hoe luchtig ben jij?",
          "short": "Vrijheid, fantasie en humor. Lucht zweeft waar het wil en droomt wat het wil.",
          "shortPause": "Voel even hoe luchtig jij je voelt."
        },
        {
          "n": 2,
          "title": "Uitwaaien",
          "text": [
            "Jouw energie is overal. Het is net alsof je op honderd plekken tegelijk kunt zijn.",
            "Jouw ideeën en jouw dromen brengen jou op allerlei plekken, in het echt of alleen in jouw fantasie."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jouw energie is overal tegelijk. Je ideeën nemen je mee naar honderd plekken.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 3,
          "title": "Gericht",
          "text": [
            "Jouw ideeën zijn meer als een strakke bries die duidelijk één kant op waait.",
            "De dingen die je doet en denkt hebben meestal een duidelijke richting, een duidelijk doel en nut."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jij bent een strakke bries: één richting, een duidelijk doel.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 4,
          "title": "Vrij",
          "text": [
            "Je voelt je vrij om overal en nergens te zijn, om over van alles te denken wat je wilt, en dat misschien ook gewoon te doen.",
            "Of misschien ook niet — dat is ook prima, je bent vrij."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Overal en nergens zijn, denken wat je wilt. Of juist niet. Jij bent vrij.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 5,
          "title": "Dwarrelen",
          "text": [
            "Je beweegt je overal en nergens naartoe en je denkt ook overal en nergens aan.",
            "Je merkt dat je je een beetje overgeleverd voelt, in plaats van dat je zelf nog de baas bent."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Je dwarrelt alle kanten op. Soms voelt het alsof de wind de baas is, en niet jij.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 6,
          "title": "Nuttig",
          "text": [
            "Het is belangrijk dat de dingen om je heen en de dingen die je doet nuttig zijn en zin hebben, dat ze praktisch zijn en doen waarvoor ze bedoeld zijn.",
            "Op die manier kun je dingen loslaten en vrij bewegen."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Het moet wel ergens goed voor zijn. Als iets praktisch klopt, voel jij je vrij.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 7,
          "title": "Vertrouwd",
          "text": [
            "Het is fijn wanneer je kunt bewegen, omringd met dingen die je kent en wanneer de dingen om je heen niet te veel veranderen.",
            "Dat geeft een gevoel van veiligheid en vertrouwen. Op die manier voel je je veilig en kun jij je vrij bewegen."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Je beweegt het liefst tussen dingen die je kent. Dat geeft rust en vertrouwen.",
          "shortPause": "Voel even: beweeg jij zo?"
        }
      ]
    },
    {
      "id": "aarde",
      "name": "Aarde",
      "cards": [
        {
          "n": 1,
          "title": "Aarde",
          "text": [
            "Wanneer je geaard bent, houd je ervan om met twee voeten op de grond te staan. Je houdt ervan om dingen vast te houden, om dingen concreet te maken.",
            "Je houdt ervan om te zien en te begrijpen hoe de werkelijkheid in elkaar zit. Het gaat erom hoe dingen echt zijn, niet wat ze zouden kunnen zijn."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Hoe geaard ben jij?",
          "short": "Twee voeten op de grond. Aarde wil vasthouden, begrijpen en concreet maken.",
          "shortPause": "Voel even hoe stevig jij staat."
        },
        {
          "n": 2,
          "title": "Vasthouden",
          "text": [
            "Je vindt het fijn om de dingen waarmee jij je omgeeft vast te kunnen houden, vast te pakken.",
            "Je vind het ook fijn om dingen te snappen, te structureren of er richting aan te geven."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jij pakt dingen graag stevig vast: snappen, ordenen, richting geven.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 3,
          "title": "Loslaten",
          "text": [
            "Je vindt het fijn om de werkelijkheid zoals die is te snappen, om het daarna weer een beetje los te kunnen laten.",
            "Dingen gewoon te laten zijn zoals ze zijn en door te gaan met dingen die jij leuk vindt."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Eerst snappen hoe het zit, dan lekker loslaten en doorgaan met wat jij leuk vindt.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 4,
          "title": "Stevig",
          "text": [
            "Je hebt de teugels stevig in handen. Je weet wat je doet. Je weet waarom je het doet.",
            "Dat geeft je een gevoel van stabiliteit en stevigheid."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jij hebt de teugels in handen. Je weet wat je doet en waarom. Dat voelt stevig.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 5,
          "title": "Grip",
          "text": [
            "Je wilt graag controle hebben over alles om je heen.",
            "Die controle voelt fijn, maar het kan soms te veel worden.",
            "Je kunt je overweldigd voelen, omdat je zoveel dingen tegelijk probeert vast te houden en te controleren."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Alles onder controle houden voelt fijn. Tot het je te veel wordt.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 6,
          "title": "Ontspannen",
          "text": [
            "Loslaten, ontspannen. Het voelt heerlijk en vrij om vanuit veiligheid te bewegen naar waar jij maar wil.",
            "Je weet hoe de wereld in elkaar zit, maar je doet lekker je eigen ding."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Je weet hoe de wereld werkt, en doet toch lekker je eigen ding. Heerlijk vrij.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 7,
          "title": "Ontwijken",
          "text": [
            "Ontwijken. De wereld staat soms misschien een beetje te vast.",
            "En dan wil je misschien het liefst loskomen van lastige dingen. Misschien lukt dat niet helemaal.",
            "Dan kijk je liever de andere kant op. Dat voelt beter."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Staat de wereld te vast? Dan kijk jij liever even de andere kant op.",
          "shortPause": "Voel even: beweeg jij zo?"
        }
      ]
    },
    {
      "id": "water",
      "name": "Water",
      "cards": [
        {
          "n": 1,
          "title": "Water",
          "text": [
            "Stromend water. Net als water stroom je overal doorheen en omheen. Water verbindt alles.",
            "Je voelt dat je met de mensen en dingen om je heen, samen één bent. Je bent verbonden.",
            "Je voelt dat je samen dingen doet, samen geïnspireerd kunt raken en samen mooie dingen kunt maken."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Hoe is de stroming bij jou?",
          "short": "Water stroomt overal doorheen en verbindt alles. Samen doen, samen maken.",
          "shortPause": "Voel even hoe het bij jou stroomt."
        },
        {
          "n": 2,
          "title": "Verbonden",
          "text": [
            "Je bent verbonden. Iedereen is verbonden.",
            "Je stroomt samen, je beweegt samen en je voelt de verbondenheid.",
            "Soms voel je je als één met z’n allen, soms voel je dat iedereen een individu is, maar wel verbonden met de ander."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jij voelt de stroom van de groep. Samen bewegen, ieder op een eigen manier.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 3,
          "title": "Begrensd",
          "text": [
            "Begrenzing is vaak nodig.",
            "Samen zijn is soms fijn, maar vaak ook niet.",
            "Het is veel belangrijker om een eigen plek te hebben van waaruit je jezelf kunt ontplooien en groeien."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Samen is fijn, maar een eigen plek is belangrijker. Van daaruit groei jij.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 4,
          "title": "Afgestemd",
          "text": [
            "Iedereen is afgestemd met zichzelf en op elkaar, en dat voelt fijn.",
            "Iedereen werkt samen op een manier waarop er ruimte is voor elk individu, maar ook op een manier waarop we echt samen kunnen zijn met z’n allen."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Iedereen klopt met zichzelf en met elkaar. Ruimte voor jou én voor de groep.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 5,
          "title": "Meegaand",
          "text": [
            "Je bent meegaand.",
            "Het voelt heerlijk om één te zijn met de groep.",
            "En waar iedereen naartoe beweegt, daar beweeg je met hen mee."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Eén zijn met de groep voelt heerlijk. Waar de stroom heen gaat, ga jij mee.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 6,
          "title": "Helder",
          "text": [
            "De grenzen zijn helder.",
            "Het is fijn dat iedereen weet waar je staat en wat belangrijk voor je is.",
            "Zo kunnen we allemaal de goede kant op gaan."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Duidelijke grenzen. Iedereen weet waar je staat, dus iedereen kan vooruit.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 7,
          "title": "Hard",
          "text": [
            "De grenzen zijn hard.",
            "Sommige dingen, sommige grenzen, zijn zo belangrijk voor je dat daar niet van afgeweken wordt, hoe hard iemand ook zijn best doet om dit te veranderen."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Sommige grenzen zijn van steen. Hoe hard iemand ook duwt, daar ga jij niet overheen.",
          "shortPause": "Voel even: beweeg jij zo?"
        }
      ]
    },
    {
      "id": "ether",
      "name": "Ether",
      "cards": [
        {
          "n": 1,
          "title": "Ether",
          "text": [
            "Elektriciteit, storm, bliksem. Er zit onrust in je. Je voelt dat de tegenstellingen in jou overweldigend kunnen zijn.",
            "Dit kan soms zo sterk zijn dat je misschien even niet meer helder kunt kijken, helder kunt denken of in het moment kunt zijn.",
            "Of misschien voel jij je juist meestal heel helder. Schoon. Hebt het overzicht en kijkt door alles heen."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Hoe onrustig ben je?",
          "short": "Storm, bliksem, elektriciteit. Onrust in je, of juist een heldere blik dwars door alles heen.",
          "shortPause": "Voel even hoeveel storm er in jou zit."
        },
        {
          "n": 2,
          "title": "Gespannen",
          "text": [
            "Je probeert gespannen jezelf staande te houden in de storm.",
            "Dat doe je door met grote kracht jezelf overeind te houden. Je probeert rechtop te blijven staan, ondanks alle krachten die je proberen neer te halen."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jij zet je schrap in de storm en houdt jezelf met alle kracht overeind.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 3,
          "title": "Ontladen",
          "text": [
            "Je hebt manieren om de spanning kwijt te raken. Om iets te doen wat ervoor zorgt dat er ruimte ontstaat.",
            "Je probeert om niet in een storm te blijven staan, maar iets anders te doen zodat je eruit kunt gaan. Zodat je de energie van de bliksem kunt afleiden."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jij zoekt een uitweg uit de storm. Je leidt de bliksem af en maakt ruimte.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 4,
          "title": "Alert",
          "text": [
            "Je bent alert. Je houdt je staande door de hele tijd in de gaten te hebben wat er gebeurt, bij wie en waar.",
            "Je kunt heel snel inspelen op veranderingen als dat nodig is, zodat jij bewegingsruimte hebt."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Jij ziet alles: wat, wie en waar. Zo kun je razendsnel bijsturen.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 5,
          "title": "Onrustig",
          "text": [
            "Je bent onrustig. De dingen worden je vaak te veel.",
            "De gebeurtenissen, de dingen die je zelf denkt, voelt en meemaakt, overweldigen je.",
            "Het is moeilijk voor je om dit vol te houden. Je zou dit graag samen willen doen."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Het wordt je soms te veel. Samen zou het makkelijker gaan.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 6,
          "title": "Opgelucht",
          "text": [
            "Je kunt iets anders doen waardoor jij je spanning los kunt laten. Je bent opgelucht.",
            "Een diepe zucht. Je voelt weer ruimte en lucht na de spanning."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Pfff. Je laat de spanning los en voelt weer lucht. Een diepe zucht.",
          "shortPause": "Voel even: beweeg jij zo?"
        },
        {
          "n": 7,
          "title": "Explosief",
          "text": [
            "Je maakt ruimte door te exploderen. Misschien door boos te worden, te roepen, ergens tegenaan te trappen of iets stuk te maken.",
            "Of misschien reageer je wat zachter, maar je doet wel iets abrupts."
          ],
          "pause": "Probeer te voelen of jij op deze manier beweegt. Neem hier even de tijd voor.",
          "q": "Kies jij voor deze kaart?",
          "short": "Boem. Jij maakt ruimte met een uitbarsting, hard of juist zacht maar plotseling.",
          "shortPause": "Voel even: beweeg jij zo?"
        }
      ]
    }
  ],
  "introShort": "Ontdek in een paar minuten welk element in jou leeft. Geen test, gewoon voelen en kiezen."
};
