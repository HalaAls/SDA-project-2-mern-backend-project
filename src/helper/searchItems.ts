interface SearchOptions {
  search: string
  minPrice?: number
  maxPrice?: number
  categoryId?: string
}

export const searchItems = ({ search, minPrice, maxPrice, categoryId }: SearchOptions) => {
  const searchRegExpr = new RegExp('.*' + search + '.*', 'i')

  let searchObject: any = {
    // search about any item by name or description
    $or: [{ name: { $regex: searchRegExpr } }, { description: { $regex: searchRegExpr } }],
  }

  // filter products by price
  if (minPrice !== undefined && maxPrice !== undefined) {
    searchObject.price = {
      $gte: minPrice,
      $lte: maxPrice,
    }
  }

  // filter products by category
  if (categoryId) {
    searchObject.category = categoryId
  }

  console.log('min price is : ', minPrice, 'max price is : ', maxPrice, 'category id :', categoryId)
  return searchObject
}
