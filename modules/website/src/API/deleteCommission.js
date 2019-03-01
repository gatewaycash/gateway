const deleteCommission = (key, commissionID) => {
  return fetch(
    `${
      process.env.REACT_APP_GATEWAY_BACKEND
    }/v2/commissions?APIKey=${key}&commissionID=${commissionID}`,
    {
      method: 'DELETE'
    }
  )
}
export default deleteCommission
