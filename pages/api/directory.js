export default async function handler(req, res) {
  const queryString = new URLSearchParams(req.query).toString()
  const [countResponse] = await Promise.all([
    // fetch(`https://dittofi.com/409/iapi/v1/SearchDirectory2?${queryString}`),
    fetch(`https://dittofi.com:/409/iapi/v1/DirectoryCount?${queryString}`),
  ])
  // const dirResponseJson = await dirResponse.json()
  const countResponseJson = await countResponse.json()
  // dirResponseJson.count = countResponseJson.data.length
  res.status(200).json(countResponseJson)
}
