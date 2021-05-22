/**
 * @typedef Card
 * @property {number} number
 * @property {string} shape
 * @property {string} fill
 * @property {string} color
 * @property {number} index
 * @property {boolean} [selected]
 * @property {boolean} [new]
 */

const STORAGE_KEY = 'playerNames'

/** @returns {string[]} */
const getPlayerNames = () => {
  const defaultNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4']
  try {
    return JSON.parse(localStorage[STORAGE_KEY]) ?? defaultNames
  } catch {
    return defaultNames
  }
}

// ! Alipne.js has issues with classes
// ! https://github.com/alpinejs/alpine/issues/270
const getGame = () => ({
  cards: _.shuffle(
    Array.from(
      { length: 81 },
      (_, i) => ({
        number: 1 + i % 3,
        shape: ['diamond', 'squiggle', 'oval'][Math.floor(i / 3) % 3],
        fill: ['empty', 'half', 'full'][Math.floor(i / 9) % 3],
        color: ['red', 'green', 'blue'][Math.floor(i / 27) % 3],
      })
    )
  ),
  /** @type {Card[]} */
  cardsOnTable: [],
  /** @type {'init' | 'playing' | 'pick' | 'valid' | 'invalid'} */
  state: 'init',
  players: getPlayerNames().map((name) => ({ name, score: 0 })),

  action() {
    if (this.state === 'playing') return this.pick()
    if (this.state !== 'init') return

    this.state = 'playing'
    this.draw(12)
  },
  /**
   * Draw cards
   * @param {number} n=3 The number of cards to draw, default is 3.
   */
  draw(n = 3) {
    const newCards = this.cards.splice(0, n).map((card, i) => ({
      ...card,
      index: this.cardsOnTable.length + i,
      new: true,
    }))
    // this.cardsOnTable = [...this.cardsOnTable, ...newCards] would be much more readable, but it is slower
    this.cardsOnTable.push.apply(this.cardsOnTable, newCards)
  },
  /**
   * @param {number} i
   */
  drawOneAt(i) {
    const newCard = this.cards.pop()

    if (!newCard) {
      this.cardsOnTable.splice(i, 1)
      return
    }

    this.cardsOnTable[i] = { ...newCard, index: i, new: true }
  },
  /**
   * @param {number} i the player index
   * @param {string} name the new name
   */
  setPalyerName(i, name) {
    this.players[i].name = name
    localStorage[STORAGE_KEY] = JSON.stringify(this.players.map((player) => player.name))
  },
  pick() {
    this.state = 'pick'
  },
  getSelectedCards() {
    return this.cardsOnTable.filter((card) => card.selected)
  },
  /**
   * @param {Card} card
   */
  selectCard(card) {
    if (this.state !== 'pick') return

    card.selected = !card.selected
    const selectedCards = this.getSelectedCards()

    if (selectedCards.length < 3) return

    this.state = this.check(selectedCards) ? 'valid' : 'invalid'
  },
  /**
   * @param {Card[]} selectedCards
   * @returns {boolean} `true` if the set is valid
   */
  check(selectedCards) {
    return (['number', 'shape', 'fill', 'color']).every((propertyName) =>
      // @ts-ignore
      new Set(selectedCards.map((card) => card[propertyName])).size !== 2
    )
  },
  /**
   * @param {number} i the player index
   * @param {number} change score change
   */
  score(i, change) {
    this.players[i].score = Math.max(0, this.players[i].score + change)
    const selectedCards = this.getSelectedCards()
    selectedCards.forEach((card) => card.selected = false)
    if (this.state === 'valid') {
      if (this.cardsOnTable.length === 12) {
        selectedCards.forEach(card => this.drawOneAt(card.index))
      } else {
        this.cardsOnTable = _.xor(this.cardsOnTable, selectedCards).map((card, i) => ({ ...card, index: i }))
      }
    }
    this.state = 'playing'
  },
})

// TODO: add tests
