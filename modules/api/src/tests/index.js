var assert = require('assert')
import dotenv from 'dotenv'
import axios from 'axios'
import { mysql } from 'mysql'
dotenv.config()

const BASE = 'http://localhost:' + process.env.WEB_PORT

export default async () => {
  describe('Gateway API Server', async () => {
    it('Should be reachable from the testing environment', async () => {
      let response = await axios.get(BASE)
      assert.equal(response.status, 200)
    })
  })
}
