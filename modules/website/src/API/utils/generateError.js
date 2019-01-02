export default (title, description) => {
  return {
    status: 'error',
    error: title,
    description: description
  }
}
