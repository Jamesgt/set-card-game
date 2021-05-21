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
    this.cards = _.shuffle(
      Array.from(
        { length: 81 },
        (_, i) => {
          return new Card(
            1 + i % 3,
            ['diamond', 'squiggle', 'oval'][Math.floor(i / 3) % 3],
            ['empty', 'half', 'full'][Math.floor(i / 9) % 3],
            ['red', 'green', 'blue'][Math.floor(i / 27) % 3],
          )
        }
      )
    )
    /** @type {Card[]} */
    this.playing = []

    this.draw(12)
  }

  /**
   * Draw cards
   * @param {number} n=3 The number of cards to draw, default is 3.
   */
  draw(n = 3) {
    // this.playing = [...this.playing, ...this.cards.splice(0, n)] would be much more readable, but it is slower
    this.playing.push.apply(this.playing, this.cards.splice(0, n))
  }

}

const deck = new Deck()
