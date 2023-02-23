/* eslint-disable no-console */
import { connection } from "../boot.js"

class Seeder {
  static async seed() {
    console.log("Done!")
    await connection.destroy()
  }
}

export default Seeder