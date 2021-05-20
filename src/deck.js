class Card {
  /**
   * @param {number} number
   * @param {string} shape
   * @param {string} fill
   * @param {string} color
   */
  constructor(number, shape, fill, color) {
    this.number = number
    this.shape = shape
    this.fill = fill
    this.color = color
  }
}

class Deck {

  constructor() {
    this.cards = Array.from({ length: 81 }, (_, i) => {
      return new Card(
        1 + i % 3,
        ['diamond', 'squiggle', 'oval'][Math.floor(i / 3) % 3],
        ['empty', 'half', 'full'][Math.floor(i / 9) % 3],
        ['red', 'green', 'blue'][Math.floor(i / 27) % 3],
      )
    })
  }

}
