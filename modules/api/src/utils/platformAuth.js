/**
 * Ensures a given user has access to view and change platform information
 * @author The Gateway Project Developers <hello@gateway.cash>
 * @file Defines a function for authenticating user access to platform info
 * @param {number} userIndex - The index in the users table of the user
 * @param {string} platformID - The ID of the platform to check
 * @param {object} res - Optional express result object for error messages
 * @return The platformIndex of the platform or false of unauthorized
 */
import { mysql, handleError } from 'utils'

export default async (userIndex, platformID, res) => {
  // ensure a platform ID was given
  if (!platformID) {
    return handleError(
      'Platform ID Required',
      'A Platform ID is required',
      res
    )
  }

  // discover the platform index
  let platform = await mysql.query(
    `SELECT *
      FROM platforms
      WHERE
      platformID = ?
      AND
      ownerUserIndex = ?
      LIMIT 1`,
    [platformID, userIndex]
  )

  // fail if not found
  if (platform.length !== 1) {
    return handleError(
      'Platform Not Found',
      'Either the platform ID is invalid or you are not the owner of the platform',
      res
    )
  }

  // return the index of the platform
  return platform[0].tableIndex
}
