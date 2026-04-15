
        class ColorMatchGame {
            constructor() {
                this.score = 0;
                this.level = 1;
                this.movesLeft = 10;
                this.colors = ['red', 'blue', 'yellow', 'purple', 'green'];
                this.colorNames = {
                    red: '🔴', blue: '🔵', yellow: '🟡', 
                    purple: '🟣', green: '🟢'
                };
                this.dropZones = [];
                this.gems = [];
                this.gameBoard = document.getElementById('dropZones');
                this.gemsContainer = document.getElementById('gemsContainer');
                this.init();
            }

            init() {
                this.createDropZones();
                this.generateGems();
                this.updateUI();
                this.attachEventListeners();
            }

            createDropZones() {
                this.gameBoard.innerHTML = '';
                this.dropZones = [];
                
                // Create drop zones based on level
                const numZones = Math.min(3 + this.level, 5);
                for (let i = 0; i < numZones; i++) {
                    const zone = document.createElement('div');
                    zone.className = 'drop-zone';
                    zone.dataset.color = this.colors[i % this.colors.length];
                    zone.textContent = this.colorNames[this.colors[i % this.colors.length]];
                    zone.id = `zone-${i}`;
                    this.gameBoard.appendChild(zone);
                    this.dropZones.push(zone);
                }
            }

            generateGems() {
                this.gemsContainer.innerHTML = '';
                this.gems = [];
                
                // Generate gems based on level difficulty
                const numGems = 5 + this.level * 2;
                for (let i = 0; i < numGems; i++) {
                    const gem = document.createElement('div');
                    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                    gem.className = `gem ${color}`;
                    gem.dataset.color = color;
                    gem.textContent = this.colorNames[color];
                    gem.draggable = true;
                    this.gemsContainer.appendChild(gem);
                    this.gems.push(gem);
                }
            }

            attachEventListeners() {
                // Drag events for gems
                this.gems.forEach(gem => {
                    gem.addEventListener('dragstart', this.handleDragStart.bind(this));
                    gem.addEventListener('dragend', this.handleDragEnd.bind(this));
                });

                // Drop events for zones
                this.dropZones.forEach(zone => {
                    zone.addEventListener('dragover', this.handleDragOver.bind(this));
                    zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
                    zone.addEventListener('drop', this.handleDrop.bind(this));
                    zone.addEventListener('dragenter', this.handleDragEnter.bind(this));
                });
            }

            handleDragStart(e) {
                e.target.classList.add('dragging');
            }

            handleDragEnd(e) {
                e.target.classList.remove('dragging');
            }

            handleDragOver(e) {
                e.preventDefault();
                e.currentTarget.classList.add('valid');
            }

            handleDragEnter(e) {
                e.preventDefault();
                e.currentTarget.classList.add('valid');
            }

            handleDragLeave(e) {
                e.currentTarget.classList.remove('valid', 'invalid');
            }

            handleDrop(e) {
                e.preventDefault();
                const draggingGem = document.querySelector('.dragging');
                const zoneColor = e.currentTarget.dataset.color;
                const gemColor = draggingGem.dataset.color;

                e.currentTarget.classList.remove('valid');

                if (zoneColor === gemColor) {
                    // Correct drop - score points!
                    this.score += 100 * this.level;
                    e.currentTarget.classList.add('filled');
                    e.currentTarget.appendChild(draggingGem);
                    draggingGem.style.margin = '0';
                    
                    // Celebration effect
                    this.createParticles(e.currentTarget);
                    
                    // Remove gem from original container
                    draggingGem.remove();
                    
                    this.checkWinCondition();
                } else {
                    // Wrong drop
                    e.currentTarget.classList.add('invalid');
                    setTimeout(() => {
                        e.currentTarget.classList.remove('invalid');
                    }, 300);
                }

                this.movesLeft--;
                this.updateUI();
            }

            createParticles(element) {
                const rect = element.getBoundingClientRect();
                const particleCount = 12;
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    const angle = (i / particleCount) * Math.PI * 2;
                    const velocity = 100 + Math.random() * 100;
                    particle.style.left = rect.left + rect.width / 2 + 'px';
                    particle.style.top = rect.top + rect.height / 2 + 'px';
                    particle.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
                    particle.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
                    particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
                    
                    document.body.appendChild(particle);
                    
                    setTimeout(() => {
                        particle.remove();
                    }, 600);
                }
            }

            checkWinCondition() {
                const filledZones = this.dropZones.filter(zone => zone.children.length > 0);
                if (filledZones.length === this.dropZones.length && this.gemsContainer.children.length === 0) {
                    setTimeout(() => {
                        this.nextLevel();
                    }, 1000);
                }
            }

            nextLevel() {
                this.level++;
                this.movesLeft = 10 + this.level;
                this.createDropZones();
                this.generateGems();
                this.attachEventListeners();
                this.updateUI();
            }

            updateUI() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('level').textContent = this.level;
                document.getElementById('moves').textContent = this.movesLeft;

                if (this.movesLeft <= 0) {
                    alert(`Game Over! Final Score: ${this.score}\nRefresh to play again!`);
                }
            }
        }

        // Global functions
        let game;

        function initGame() {
            game = new ColorMatchGame();
        }

        function newGame() {
            game = new ColorMatchGame();
        }

        function nextLevel() {
            if (game) {
                game.nextLevel();
            }
        }

        // Start the game
        window.addEventListener('load', initGame);
   