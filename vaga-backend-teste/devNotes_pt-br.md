# Notas de desenvolvimento

## Introdução

Pokémon GO é um jogo mobile feito pela Niantic, em conjunto com a Nintendo e The Pokémon Company, que traz a renomada série dos consoles para a plataforma móvel e, apesar das diferenças em mecânicas de gameplay (devido a sua reimaginação com fatores técnicos próprios dos smartphones, como acelerômetro, touchscreen, realidade aumentada, entre outros), apresenta uma boa familiaridade com vários elementos dos lançamentos originais.

As análises a seguir vão tentar ambientar o leitor quanto o que os dados iniciais representam, mas sem se aprofundar em detalhes (termos inicialmente apresentados entre aspas, por exemplo, tem uma definição específica para o ambiente da série). Recomenda-se estudo de campo com ambos o Pokémon GO e os jogos da série seja este o caso.

## Entendendo a base de dados

A base de dados representa todos os Pokémons presente na série de jogos, sendo que nem todos se encontram presentes em Pokémon GO (no momento da redação deste arquivo). O arquivo Pokemon Go.xlsx contém 822 entradas, cada uma com 30 índices:

- *Row*: O número da linha, ou entrada
- *Name*: O nome do Pokémon
- *Pokedex Number*: O número de registro no Pokémon na Pokedex, que é a lista de 'espécies' de Pokemon. Note que algumas entradas são da mesma 'espécie' mesmo que sejam, tecnicamente, Pokémons diferentes.
- *Img name*: O nome da imagem do Pokémon que se encontra nos arquivos do jogo. Igualmente, cada Pokémon diferente tem uma imagem, nomeada por seu número de entrada na Pokedex, seguida de uma palavra que represente sua variação de espécie, caso a denominação seja necessária.
- *Generation*: A 'geração' de um Pokémon. Em geral, a Nintendo lança cerca de 3 a 6 jogos por 'geração', adicionando novos Pokémon para cada uma.
- *Evolution Stage*: O estágio de 'evolução' de um Pokémon. Um Pokémon pode 'evoluir', ou seja mudar para uma forma mais forte, conforme este ganha experiência. Nota-se que, para denotar os estágios de evolução, são utilizados tanto valores inteiros, apontando o nível da evolução, quanto strings, denotando se o Pokémon está em uma fase baixa de evolução ('lower', se aplica geralmente a Pokémons que evolvem mais de uma vez) ou sua fase final ('evolved', idem).
- *Evolved*: Denota se esse Pokémon se encontra em sua evolução final. Caso sim, este está em sua forma mais forte, e não poderá mais evoluir. Nota-se que, a partir da geração 4, os valores passam a ser nulos para todos os Pokémons, possívelmente sem ser utilizado pelo jogo para estes.
- *FamilyID*: O ID da 'família' do Pokémon. Uma família, neste caso, é definida por todas as formas de 'evolução' atingidas por um dado Pokémon, desde sua forma mais fraca até sua 'evolução' final. Nota-se que nem todos os Pokémons contém um ID de família.
- *Cross Gen*: Denota se um Pokémon pertence a mais de uma geração. Conforme novos Pokémons são adicionados por geração, alguns são retroativamente adicionado à famílias de Pokémons já existentes.
- *Type 1; Type 2*: O tipo, ou tipos, do Pokémon. Cada Pokémon possui um ou dois 'tipos' que definem as características de seus ataques (como fogo, água, inseto, psíquico, por exemplo).
- *Weather 1; Weather 2*: O clima, ou climas, no qual o Pokémon possa aparecer no ambiente de jogo para os usuários. Enquanto o clima em jogo é definido pela previsão do tempo local de um dado usuário, Pokémons são exclusivo para certas condições climáticas.
- *STAT TOTAL; ATK; DEF; STA*: Os 'stats' do Pokémon. São os pontos que defininem as abilidades de um Pokémon quanto a ataque (ATK), defesa (DEF) e energia (STA, *stamina*), com *STAT TOTAL* sendo a soma dos três valores.
- *Legendary*: Denota se o Pokémon é 'lendário'. Alguns Pokémons terão o status de lendário por serem raros de se encontrar em jogo, seja por condições específicas de captura (eventos sazonais, por exemplo; estes são marcados por '2' na base de dados) ou probabilidades baixas de encontro em geral (marcados por '1').
- *Aquirable*: Denota se o Pokémon é obtível em jogo. A Niantic gradualmente lança Pokémons inéditos ao Pokémon GO, e marca estes como 'obtíveis' conforme são adicionados. Nota-se que esta classe não é binária, pois existem diversas classes para representar um Pokémon adquirível (Pokémons recentemente adicionados ao jogo tem uma classe maior de aquisição, por exemplo).
- *Spawns*: Denote se o Pokémon pode aparecer no campo de jogo para o usuário. Geralmente, Pokémons de estágio de evolução altos ou lendários podem aparecer para jogadores com probabilidades muito baixas de 'spawn' (aparição), ou nem estarem disponíveis desta forma. 
- *Regional*: Denota se um Pokémon é regional, ou seja, limitado a uma região.
- *Raidable*: Denota se um Pokémon pode aparecer como chefe de uma batalha do tipo 'raid', assim como a qual nível este pertence. 
- *Hatchable*: Denota se um Pokémon pode ser obtido por Pokémon Eggs (Ovos Pokémon), assim como suas probabilidades de ser obtido desse modo.
- *Shiny*: Denota se um Pokémon pode ser 'shiny' (brilhante). Um Pokémon 'shiny' é uma variação mais rara de um dado Pokémon, com cores e stats especiais.
- *Nest*: Denota se um Pokémon pode aparecer em um ninho de Pokémons, uma localidade no campo de jogo (que não seja confundida por 'spawn', que são aparições de Pokémon diretamente no campo de jogo).
- *New*: Denota se um Pokémon é novo em Pokémon.
  - Isso é uma suposição, mas sua definição não é pertinente ao problema dado. Caso alguém possa confirmar ou corrigir, seja bem-vindo para fazê-lo.
- *Not-Gettable*: Denota se um Pokémon não pode ser capturado por Pokébolas (Pokéballs). Pokémons 'lendários', por exemplo, exigem que o jogador os derrotem em batalhas 'raid' para obté-los.
- *Future Evolve*: Denota se esse estágio de evolução do Pokémon será obtível em um futuro update do jogo.
- *100% CP @ 40; 100% CP @ 39*: Os 'pontos de combate' (CP) máximos de um Pokémon para um dado treinador de nível 40 ou 39.

## Modelo Relacional

Na fase inicial do modelo relacional teve como objetivo primário criar tabelas que agregassem valores em comum, por meio de um modelo centralizado no conceito do 'Pokémon', uma vez que cada entrada se refere a um Pokémon diferente. Para tal objetivo, criou-se uma tabela primária - Pokémon - a qual reune os atributos que brevemente definem o Pokémon e, a partir desta, foram criadas tabelas secundárias com as agregações de atribuitos que fossem mais convenientes e que tivessem alguma relação com a tabela primária.

A partir disto, obteve-se o seguinte modelo, que reune as seguintes tabelas:
![alt text]( )
- *Pokémon*: Tabela primária deste modelo, que reunem os atributos que brevemente define um Pokémon. O atributo *Pokémon* serve como número-chave nas tabelas secundárias.
- *Pokédex*: Tabela secundária referente ao registro do Pokémon na Pokédex.
- *Generation*: Tabela referente às gerações de Pokémon.
- *Pokémon Family*: Tabela referente à família do Pokémon, reunindo informações sobre seu dados de evolução.
- *Types*: Tabela referente aos tipos do Pokémon.
- *Weather*: Tabela referente aos climas nos quais o Pokémon está presente.
- *Stats*: Tabela referentes aos stats do Pokémon.
- *Capture Qualities*: Tabela referente aos atributos de qualidades do Pokémon.
- *Capture Availability*: Tabela referente aos atributos de disponibilidade do Pokémon.
- *Capture Methods*: Tabela referente aos métodos de captura do Pokémon.
- *Max CP Points*: Tabela referente aos pontos de combate máximos do Pokémon.

Com a agregação de valores, foram feitos ajustes que parecessem adequados para a construção do modelo da base de dados, assim como a adição de cardinalidades:
![alt text]( )
- *Pokédex Registration*: Um *Pokédex Number* pode armazenar mais de um Pokémon.
- *Generation*: Uma geração de Pokémons contém multiplos elementos.
- *Pokémon Family:* Uma família de Pokémons contém todos os estágios evolutivos de um Pokémon, assim como seus níveis evolutivos e status de Evolved. Na ausência de um ID, sua informações são salvas em uma lista de índice de Family ID vazio.
- *Types*, *Weather*: As informações dos tipos e climas de um Pokémon são salvas em uma lista.
- *Stats*: Os stats de um Pokémon são salvos em uma trupla (ATK, DEF, STA).

Note que houve a adição de uma relação *evolves*, que seria uma tabela que faria a relação em um Pokémon e suas possíveis evoluções, caso este as possua. Neste exercício, esta tabela permanecerá vazia, porém é uma alternativa á adaptação dos valores na Tabela *Pokémon Family*, caso seja necessário a manutenção dos valores desta como estão. Porém, devido a sua inconsistência em seu estado original, todos os métodos relativos a evolução neste projeto serão realizadas somente para famílias com IDs e elementos definidos, sem discrição entre entradas com ruídos ou outliers.

## Ferramentas de trabalho

(Python, MySQL)

## Criação da base de dados

(conversão xlsx para csv)
(mysql, criação de tabelas)
- (pokedex)
- (generations)
- (pokemon_family)
- (pokemon_list)
- (types)
- (weather_list)
- (cap_qualities)
- (cap_availability)
- (cap_methods)
- (max_cp)
- (evolutions)
(data import)

## Criação do app template

(html/css/bootstrap)
(index.html)

## (mySQL / Node.js)
(mysql_data/app)
(mysql server setup root, pass)
(node.js)
