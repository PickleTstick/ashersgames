document.addEventListener('DOMContentLoaded', () => {
    const gameOutput = document.getElementById('gameOutput');
    const gameControls = document.getElementById('gameControls');
    const charName = document.getElementById('charName');
    const charClass = document.getElementById('charClass');
    const charHealth = document.getElementById('charHealth');
    const charAttack = document.getElementById('charAttack');
    const charGold = document.getElementById('charGold');
    const charPortrait = document.getElementById('charPortrait');
    const inventoryList = document.getElementById('inventoryList');
    const backgroundMusic = document.getElementById('backgroundMusic');

    let player = {
        name: '',
        class: '',
        health: 100,
        attackPower: 10,
        gold: 200,
        inventory: [],
        weapons: [],
        portrait: 'default-portrait.png'
    };

    let gameState = {
        phase: 'characterCreation'
    };

    function startBackgroundMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(error => {
                console.error('Failed to play background music:', error);
            });
        }
    }

    document.addEventListener('click', startBackgroundMusic);
    document.addEventListener('keydown', startBackgroundMusic);

    function updateGameOutput(message, delay = 3000) {
        const p = document.createElement('p');
        p.textContent = message;
        p.style.opacity = '0';
        p.style.transition = 'opacity 1s';
        gameOutput.appendChild(p);
        setTimeout(() => {
            p.style.opacity = '1';
        }, 100);
        gameOutput.scrollTop = gameOutput.scrollHeight;

        setTimeout(() => {
            const firstChild = gameOutput.firstChild;
            if (firstChild) {
                firstChild.style.opacity = '0';
                setTimeout(() => {
                    if (firstChild.parentNode) {
                        firstChild.parentNode.removeChild(firstChild);
                    }
                }, 1000);
            }
        }, delay + 3000); // Keep the text visible for delay + 3 seconds
    }

    function clearGameControls() {
        while (gameControls.firstChild) {
            gameControls.removeChild(gameControls.firstChild);
        }
    }

    function updateCharacterStats() {
        charName.textContent = `Name: ${player.name}`;
        charClass.textContent = `Class: ${player.class}`;
        charHealth.textContent = `Health: ${player.health}`;
        charAttack.textContent = `Attack: ${player.attackPower}`;
        charGold.textContent = `Gold: ${player.gold}`;
        charPortrait.src = player.portrait;
    }

    function updateInventory() {
        inventoryList.innerHTML = '';
        player.inventory.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            inventoryList.appendChild(li);
        });
        player.weapons.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;
            inventoryList.appendChild(li);
        });
    }

    function saveGame() {
        const gameStateData = {
            player: player,
            gameState: gameState,
            gameOutput: gameOutput.innerHTML
        };
        localStorage.setItem('rpgGameState', JSON.stringify(gameStateData));
        updateGameOutput("Game saved!");
    }

    function loadGame() {
        const savedState = JSON.parse(localStorage.getItem('rpgGameState'));
        if (savedState) {
            player = savedState.player;
            gameState = savedState.gameState;
            gameOutput.innerHTML = savedState.gameOutput;
            updateCharacterStats();
            updateInventory();
            updateGameOutput("Game loaded!");
        } else {
            updateGameOutput("No saved game found.");
        }
    }

    function startGame() {
        loadGame();
        if (!player.name) {
            updateGameOutput("Welcome to The Rusty Anchor Tavern! Let's start by creating your character.");
            createCharacter();
        } else {
            continueGame();
        }
    }

    function createCharacter() {
        updateGameOutput("Please enter your character's name:");
        const input = document.createElement('input');
        const button = document.createElement('button');
        button.textContent = 'Submit';
        button.addEventListener('click', () => {
            player.name = input.value;
            gameState.phase = 'chooseClass';
            saveGame();
            chooseClass();
        });
        gameControls.appendChild(input);
        gameControls.appendChild(button);
    }

    function chooseClass() {
        clearGameControls();
        updateGameOutput("Choose your class:");
        displayOptions([
            { text: 'Warrior', action: () => setClass('Warrior', 120, 12, 'warrior-portrait.png') },
            { text: 'Mage', action: () => setClass('Mage', 80, 15, 'mage-portrait.png') },
            { text: 'Rogue', action: () => setClass('Rogue', 90, 10, 'rogue-portrait.png') }
        ]);
    }

    function setClass(cls, health, attack, portrait) {
        player.class = cls;
        player.health = health;
        player.attackPower = attack;
        player.portrait = portrait;
        updateCharacterStats();
        gameState.phase = 'customizeCharacter';
        saveGame();
        customizeCharacter();
    }

    function customizeCharacter() {
        clearGameControls();
        updateGameOutput("Customize your character. Choose a weapon:");
        displayOptions([
            { text: 'Sword', action: () => chooseWeapon('Sword', 10) },
            { text: 'Bow', action: () => chooseWeapon('Bow', 8) },
            { text: 'Dagger', action: () => chooseWeapon('Dagger', 6) }
        ]);
    }

    function chooseWeapon(weapon, damage) {
        player.weapons.push({ name: weapon, damage: damage });
        updateCharacterStats();
        updateInventory();
        gameState.phase = 'startAdventure';
        saveGame();
        startAdventure();
    }

    function addSaveButton() {
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Game';
        saveButton.addEventListener('click', saveGame);
        gameControls.appendChild(saveButton);
    }

    function startAdventure() {
        updateGameOutput("As you enter The Rusty Anchor Tavern, the atmosphere hits you immediately. The smell of salt and roasted meat fills the air, mingling with the sounds of laughter, clinking mugs, and murmured conversations. The dim lighting adds to the cozy, yet slightly shady ambiance.");
        updateGameOutput("In a corner booth, you spot a grizzled old pirate nursing a mug of ale. His weathered face, long grey beard, and eye patch give him an unmistakable look. This is Captain Marlowe, your contact. He waves you over with a gnarled hand.");
        updateGameOutput("'Ah, there ye are,' he says in a gravelly voice as you approach. 'I've been waitin' for ya. The job's simple, but risky. Lord Blackwater, that scoundrel, has somethin' precious in his vault – the Storm Crystal. It's said to hold the power to control the weather, and the old sea dog uses it to keep his ships safe while the rest of us suffer the tempests.'");
        updateGameOutput("He takes a long swig of his ale before continuing, 'Blackwater Manor is a fortress, but there’s a way in through the sewers. Nasty place, but it’ll get ya close. Once inside, you'll need to be quick and quiet. The guards are well-trained, and there are rumors of a guardian protectin' the vault. Get the crystal, bring it back here, and we’ll split the reward.'");
        updateGameOutput("Captain Marlowe slides a rough map of the manor across the table, showing the location of the manor, the entrance to the sewers, and a few key points inside the manor itself.");

        displayOptions([
            { text: 'Ask about the sewer entrance', action: askSewerEntrance },
            { text: 'Ask about the manor layout', action: askManorLayout },
            { text: 'Ask about the guards\' schedule', action: askGuardsSchedule },
            { text: 'Ask about Lord Blackwater', action: askLordBlackwater },
            { text: 'Prepare for the heist', action: prepareHeist }
        ]);
        addSaveButton();
    }

    function displayOptions(options) {
        clearGameControls();
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.addEventListener('click', option.action);
            gameControls.appendChild(button);
        });
    }

    function askSewerEntrance() {
        updateGameOutput("Marlowe's Response: 'The entrance is behind the old fish market. You'll need to be careful – the sewers are filled with traps and unsavory creatures.'");
    }

    function askManorLayout() {
        updateGameOutput("Marlowe's Response: 'Blackwater Manor is heavily guarded. The vault is in the basement, guarded by both men and magic. I heard there's a mechanical guardian as well.'");
    }

    function askGuardsSchedule() {
        updateGameOutput("Marlowe's Response: 'The guards change shifts every two hours. Best time to sneak in is during the changeover – fewer eyes watching.'");
    }

    function askLordBlackwater() {
        updateGameOutput("Marlowe's Response: 'Lord Blackwater is a paranoid and wealthy man. He’s made plenty of enemies, which is why he keeps the manor so well guarded. He’s not one to take lightly.'");
    }

    function prepareHeist() {
        updateGameOutput("You have a few hours before nightfall to gather any supplies or information you need. The market is bustling with vendors selling all manner of goods, from weapons to potions. The air is filled with the shouts of merchants and the smells of exotic spices and foods.");

        displayOptions([
            { text: 'Visit the Potion Seller', action: visitPotionSeller },
            { text: 'Visit the Tool Vendor', action: visitToolVendor },
            { text: 'Visit the Information Broker', action: visitInformationBroker },
            { text: 'Continue', action: enterSewers }
        ]);
    }

    function visitPotionSeller() {
        updateGameOutput("Potion Seller: 'Greetings! I have healing potions, antidotes, and even a few invisibility potions, if you have the coin.'");

        displayOptions([
            { text: 'Buy Healing Potion (50 gp)', action: () => buyItem('Healing Potion', 50) },
            { text: 'Buy Antidote (30 gp)', action: () => buyItem('Antidote', 30) },
            { text: 'Buy Invisibility Potion (150 gp)', action: () => buyItem('Invisibility Potion', 150) },
            { text: 'Back', action: prepareHeist }
        ]);
    }

    function visitToolVendor() {
        updateGameOutput("Tool Vendor: 'Looking for something to help with locks or traps? I've got the finest thieves' tools in the city.'");

        displayOptions([
            { text: 'Buy Thieves\' Tools (25 gp)', action: () => buyItem('Thieves\' Tools', 25) },
            { text: 'Buy Disguise Kit (20 gp)', action: () => buyItem('Disguise Kit', 20) },
            { text: 'Buy Climber\'s Kit (30 gp)', action: () => buyItem('Climber\'s Kit', 30) },
            { text: 'Back', action: prepareHeist }
        ]);
    }

    function visitInformationBroker() {
        updateGameOutput("Information Broker: 'Need to know something specific? Information isn't free, but I can help… for the right price.'");

        displayOptions([
            { text: 'Buy Guard Schedules (20 gp)', action: () => buyItem('Guard Schedules', 20, "The guards change shifts every two hours. Best time to sneak in is during the changeover – fewer eyes watching.") },
            { text: 'Buy Sewer Layout (15 gp)', action: () => buyItem('Sewer Layout', 15, "The sewers are dark and damp, with the entrance behind the old fish market. Watch out for traps and unsavory creatures.") },
            { text: 'Buy Blackwater’s Weaknesses (50 gp)', action: () => buyItem('Blackwater’s Weaknesses', 50, "Lord Blackwater is a paranoid man, but he has a soft spot for his pet cat. Distracting the cat might give you an edge.") },
            { text: 'Back', action: prepareHeist }
        ]);
    }

    function buyItem(item, cost, information = '') {
        if (player.gold >= cost) {
            player.gold -= cost;
            player.inventory.push(item);
            updateGameOutput(`You bought ${item} for ${cost} gp.`);
            if (information) {
                updateGameOutput(information);
            }
            updateCharacterStats();
            updateInventory();
        } else {
            updateGameOutput(`You don't have enough gold to buy ${item}.`);
        }
        prepareHeist();
    }

    function enterSewers() {
        updateGameOutput("As the sun sets, you make your way to the old fish market. The stench of rotting fish is overpowering, but behind the market, you find a rusted metal grate leading into the sewers. With a bit of effort, you manage to pry it open and slip inside.");
        updateGameOutput("The sewers are dark and damp, the sound of dripping water echoing off the stone walls. The air is thick with the smell of decay and stagnant water. You light your torches and press on, following the rough map Marlowe provided.");
        gameState.phase = 'navigateSewers';
        saveGame();
        navigateSewers();
    }

    function navigateSewers() {
        updateGameOutput("You need to navigate the sewers, dealing with traps and creatures.");
        displayOptions([
            { text: 'Look for traps', action: lookForTraps },
            { text: 'Continue forward', action: encounterRats }
        ]);
    }

    function lookForTraps() {
        const perceptionRoll = Math.floor(Math.random() * 20) + 1;
        if (perceptionRoll >= 15) {
            updateGameOutput("You notice a series of pressure plates on the floor. They look old, but who knows if they still work.");
            displayOptions([
                { text: 'Disarm the traps using Thieves\' Tools', action: disarmTraps },
                { text: 'Continue forward carefully', action: () => triggerTraps(false) }
            ]);
        } else {
            updateGameOutput("You fail to notice the traps and trigger them.");
            triggerTraps(true);
        }
    }

    function disarmTraps() {
        const dexRoll = Math.floor(Math.random() * 20) + 1;
        if (dexRoll >= 15) {
            updateGameOutput("You successfully disarm the traps.");
            saveGame();
            encounterRats();
        } else {
            updateGameOutput("You fail to disarm the traps and trigger them.");
            triggerTraps(false);
        }
    }

    function triggerTraps(failedToNotice) {
        const damage = Math.floor(Math.random() * 6) + 1;
        player.health -= damage;
        updateGameOutput(`You take ${damage} poison damage.`);
        if (player.health <= 0) {
            handleDeath();
        } else {
            updateCharacterStats();
            saveGame();
            encounterRats();
        }
    }

    function encounterRats() {
        updateGameOutput("Further along, you hear a growl echoing through the tunnels. Suddenly, a group of giant rats appears, their eyes glowing in the torchlight.");
        updateGameOutput("Combat: 4 Giant Rats (HP: 7 each, AC: 12, Attack: Bite +4 to hit, 1d4+2 piercing damage).");

        // Implement combat logic here
        combat('giant rats', [
            { name: 'Giant Rat', hp: 7, ac: 12, attack: 'Bite', attackBonus: 4, damage: '1d4+2' },
            { name: 'Giant Rat', hp: 7, ac: 12, attack: 'Bite', attackBonus: 4, damage: '1d4+2' },
            { name: 'Giant Rat', hp: 7, ac: 12, attack: 'Bite', attackBonus: 4, damage: '1d4+2' },
            { name: 'Giant Rat', hp: 7, ac: 12, attack: 'Bite', attackBonus: 4, damage: '1d4+2' }
        ]);
    }

    async function combat(enemyName, enemies) {
        let combatEnded = false;

        async function playerAttack(enemy) {
            const attackRoll = Math.floor(Math.random() * 20) + 1 + player.attackPower;
            if (attackRoll >= enemy.ac) {
                const weapon = player.weapons[0];
                const damage = Math.floor(Math.random() * weapon.damage) + 1;
                enemy.hp -= damage;
                updateGameOutput(`You hit the ${enemy.name} for ${damage} damage.`, 3000);
                await new Promise(resolve => setTimeout(resolve, 3000));
                if (enemy.hp <= 0) {
                    updateGameOutput(`The ${enemy.name} is defeated.`, 3000);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            } else {
                updateGameOutput(`You miss the ${enemy.name}.`, 3000);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        async function enemyAttack(enemy) {
            const attackRoll = Math.floor(Math.random() * 20) + 1 + enemy.attackBonus;
            if (attackRoll >= player.ac) {
                const damage = Math.floor(Math.random() * 4) + 2; // assuming 1d4+2 for enemy attack
                player.health -= damage;
                updateGameOutput(`The ${enemy.name} hits you for ${damage} damage.`, 3000);
                await new Promise(resolve => setTimeout(resolve, 3000));
                if (player.health <= 0) {
                    handleDeath();
                    combatEnded = true;
                }
            } else {
                updateGameOutput(`The ${enemy.name} misses you.`, 3000);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        while (enemies.length > 0 && !combatEnded) {
            const enemy = enemies[0];
            await playerAttack(enemy);
            if (enemy.hp > 0) {
                await enemyAttack(enemy);
            } else {
                enemies.shift(); // remove defeated enemy
            }
        }

        if (player.health > 0) {
            updateGameOutput("You have defeated all enemies.", 3000);
            await new Promise(resolve => setTimeout(resolve, 3000));
            exploreSewers();
        }
    }

    function exploreSewers() {
        updateGameOutput("You explore the sewers and might find useful items or clues.");
        const investigationRoll = Math.floor(Math.random() * 20) + 1;
        if (investigationRoll >= 13) {
            const items = [
                "a rusted but usable short sword",
                "a small stash of coins, 10 gp in total",
                "a discarded journal detailing part of the sewer layout"
            ];
            const foundItem = items[Math.floor(Math.random() * items.length)];
            updateGameOutput(`You find ${foundItem}.`);
            player.inventory.push(foundItem);
            updateCharacterStats();
            saveGame();
        } else {
            updateGameOutput("You find nothing of interest.");
        }
        navigateToManor();
    }

    function navigateToManor() {
        updateGameOutput("You finally reach a ladder leading up to a grate. Above, you can see faint light and hear distant voices. This must be the basement of Blackwater Manor.");
        updateGameOutput("The basement is dimly lit by flickering torches. You see rows of wine barrels and crates of goods, with a single door leading further into the manor.");
        gameState.phase = 'insideManor';
        saveGame();
        insideManor();
    }

    function insideManor() {
        updateGameOutput("You need to avoid patrolling guards and explore the basement for useful items or clues.");
        displayOptions([
            { text: 'Sneak past the guards', action: sneakPastGuards },
            { text: 'Search the area', action: searchArea }
        ]);
    }

    function sneakPastGuards() {
        const stealthRoll = Math.floor(Math.random() * 20) + 1;
        if (stealthRoll >= 13) {
            updateGameOutput("You successfully avoid detection by the patrolling guards.");
            saveGame();
            findVault();
        } else {
            updateGameOutput("You are spotted by the guards and have to fight.");
            // Implement guard combat logic here
            combat('guards', [
                { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' },
                { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' }
            ]);
            findVault();
        }
    }

    function searchArea() {
        const investigationRoll = Math.floor(Math.random() * 20) + 1;
        if (investigationRoll >= 15) {
            const items = [
                "a crate containing a few healing potions",
                "a scrap of paper with a crude map of the manor",
                "an old servant’s uniform, which might be useful for disguises"
            ];
            const foundItem = items[Math.floor(Math.random() * items.length)];
            updateGameOutput(`You find ${foundItem}.`);
            player.inventory.push(foundItem);
            updateCharacterStats();
            saveGame();
        } else {
            updateGameOutput("You find nothing of interest.");
        }
        findVault();
    }

    function findVault() {
        updateGameOutput("You find the vault door, a massive iron door with a complex lock mechanism.");
        updateGameOutput("Players need to unlock the door (DC 18 Dexterity (Thieves' Tools)). If failed, it triggers an alarm (1d4 guards arrive in 1d4 rounds).");
        const dexRoll = Math.floor(Math.random() * 20) + 1;
        if (dexRoll >= 18) {
            updateGameOutput("You successfully unlock the door.");
            saveGame();
            retrieveStormCrystal();
        } else {
            updateGameOutput("You fail to unlock the door and trigger the alarm.");
            // Implement alarm and guard arrival logic here
            combat('guards', [
                { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' },
                { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' },
                { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' }
            ]);
            retrieveStormCrystal();
        }
    }

    function retrieveStormCrystal() {
        updateGameOutput("In the center of the vault, on a pedestal, lies the Storm Crystal. It's a beautiful, shimmering gem that seems to pulse with energy.");
        updateGameOutput("The pedestal is trapped (DC 16 Perception to notice, DC 16 Dexterity (Thieves' Tools) to disarm).");
        const perceptionRoll = Math.floor(Math.random() * 20) + 1;
        if (perceptionRoll >= 16) {
            updateGameOutput("You notice the trap.");
            const dexRoll = Math.floor(Math.random() * 20) + 1;
            if (dexRoll >= 16) {
                updateGameOutput("You successfully disarm the trap and take the Storm Crystal.");
            } else {
                updateGameOutput("You trigger the trap and take 3d6 lightning damage.");
                player.health -= Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
                if (player.health <= 0) {
                    handleDeath();
                } else {
                    updateCharacterStats();
                }
            }
        } else {
            updateGameOutput("You fail to notice the trap and trigger it, taking 3d6 lightning damage.");
            player.health -= Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
            if (player.health <= 0) {
                handleDeath();
            } else {
                updateCharacterStats();
            }
        }
        saveGame();
        escapeManor();
    }

    function escapeManor() {
        updateGameOutput("With the Storm Crystal in hand, you need to make your escape. The manor is on high alert now, and guards are searching the premises.");
        displayOptions([
            { text: 'Sneak out', action: sneakOut },
            { text: 'Fight your way out', action: fightOut }
        ]);
    }

    function sneakOut() {
        const stealthRoll = Math.floor(Math.random() * 20) + 1;
        if (stealthRoll >= 15) {
            updateGameOutput("You successfully sneak out of the manor.");
            saveGame();
            returnToTavern();
        } else {
            updateGameOutput("You are spotted by the guards and have to fight.");
            // Implement guard combat logic here
            combat('guards', [
                { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' },
                { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' },
                { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' }
            ]);
            returnToTavern();
        }
    }

    function fightOut() {
        updateGameOutput("You decide to fight your way out.");
        // Implement guard combat logic here
        combat('guards', [
            { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' },
            { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' },
            { name: 'Guard', hp: 11, ac: 16, attack: 'Spear', attackBonus: 3, damage: '1d6+1' }
        ]);
        returnToTavern();
    }

    function returnToTavern() {
        updateGameOutput("Back at The Rusty Anchor, Captain Marlowe waits anxiously. When you present the Storm Crystal, his eyes widen in amazement.");
        updateGameOutput("'Ye did it!' he exclaims. 'Well done! Here’s your share of the reward, as promised.'");
        updateGameOutput("He hands you a pouch of gold and raises his mug in a toast. 'To a job well done!'");
        // Give rewards here
        player.gold += 100;
        updateCharacterStats();
        // Level up players or any additional rewards
        updateGameOutput("You receive 100 gold pieces each and enough experience to level up.");
        gameState.phase = 'completed';
        saveGame();
        updateGameOutput("Would you like to start a new adventure?");
        displayOptions([
            { text: 'Yes', action: resetGame },
            { text: 'No', action: () => updateGameOutput("Thank you for playing!") }
        ]);
    }

    function handleDeath() {
        updateGameOutput("You have fallen in battle. After a long rest, you wake up back at The Rusty Anchor Tavern, fully healed but with the memory of your failure fresh in your mind.");
        player.health = 100; // Reset health to full
        gameState.phase = 'startAdventure'; // Set the game phase back to the tavern
        saveGame();
        updateCharacterStats();
        updateGameOutput("After resting, you are ready to attempt the heist once more.");
    }

    function resetGame() {
        localStorage.removeItem('rpgGameState');
        window.location.reload();
    }

    document.getElementById('homeButton').addEventListener('click', resetGame);

    function continueGame() {
        switch (gameState.phase) {
            case 'characterCreation':
                createCharacter();
                break;
            case 'chooseClass':
                chooseClass();
                break;
            case 'customizeCharacter':
                customizeCharacter();
                break;
            case 'startAdventure':
                startAdventure();
                break;
            case 'navigateSewers':
                navigateSewers();
                break;
            case 'insideManor':
                insideManor();
                break;
            case 'completed':
                returnToTavern();
                break;
            default:
                startGame();
        }
    }

    startGame();
});

