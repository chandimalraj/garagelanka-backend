exports.searchQueryCreator = (queryParams) => {
  const {
    status,
    sold,
    price,
    priceLT,
    priceGT,
    discount,
    category,
    type,
    vehicleCategory,
    condition,
    make,
    model,
    year,
    yearLT,
    yearGT,
    province,
    district,
    city,
    fuel,
    transmission,
    mileage,
    mileageLT,
    mileageGT,
    color,
    ownership,
    negotiable,
  } = queryParams;

  const priceQuery = () => {
    let query = {};
    if (priceGT && !priceLT) {
      query = { $gte: +priceGT };
    }
    if (priceLT && !priceGT) {
      query = { $lte: +priceLT };
    }
    if (priceLT && priceGT) {
      query = { $gte: +priceGT, $lte: +priceLT };
    }
    if (price) {
      query = { $eq: +price };
    }
    return query;
  };
  const statusQuery = () => {
    let query = {};

    if (status) {
      query = { $eq: status };
    }
    return query;
  };
  const soldQuery = () => {
    let query = {};

    if (sold) {
      query = { $eq: sold };
    }
    return query;
  };
  const negotiableQuery = () => {
    let query = {};

    if (negotiable) {
      query = { $eq: negotiable };
    }
    return query;
  };
  const discountQuery = () => {
    let query = {};

    if (discount) {
      query = { $ne: 0 };
    }
    return query;
  };
  const categoryQuery = () => {
    let query = {};

    if (category) {
      query = { $elemMatch: { $eq: category } };
    }
    return query;
  };
  const typeQuery = () => {
    let query = {};
    if (type) {
      query = { $eq: type };
    }
    return query;
  };
  const vehicleCategoryQuery = () => {
    let query = {};
    if (vehicleCategory) {
      query = { $eq: vehicleCategory };
    }
    return query;
  };
  const conditionQuery = () => {
    let query = {};
    if (condition) {
      query = { $eq: condition };
    }
    return query;
  };
  const makeQuery = () => {
    let query = {};
    if (make) {
      query = { $eq: make };
    }
    return query;
  };
  const modelQuery = () => {
    let query = {};
    if (model) {
      query = { $eq: model };
    }
    return query;
  };
  const yearQuery = () => {
    let query = {};
    if (yearGT && !yearLT) {
      query = { $gte: yearGT };
    }
    if (yearLT && !yearGT) {
      query = { $lte: yearLT };
    }
    if (yearLT && yearGT) {
      query = { $gte: yearGT, $lte: yearLT };
    }
    if (year) {
      query = { $eq: year };
    }
    return query;
  };
  const mileageQuery = () => {
    let query = {};
    if (mileageGT && !mileageLT) {
      query = { $gte: mileageGT };
    }
    if (mileageLT && !mileageGT) {
      query = { $lte: mileageLT };
    }
    if (mileageLT && mileageGT) {
      query = { $gte: mileageGT, $lte: mileageLT };
    }
    if (mileage) {
      query = { $eq: mileage };
    }
    return query;
  };
  const provinceQuery = () => {
    let query = {};
    if (province) {
      query = { $eq: province };
    }
    return query;
  };
  const districtQuery = () => {
    let query = {};
    if (district) {
      query = { $eq: district };
    }
    return query;
  };
  const cityQuery = () => {
    let query = {};
    if (city) {
      query = { $eq: city };
    }
    return query;
  };
  const fuelQuery = () => {
    let query = {};
    if (fuel) {
      query = { $eq: fuel };
    }
    return query;
  };
  const transmissionQuery = () => {
    let query = {};
    if (transmission) {
      query = { $eq: transmission };
    }
    return query;
  };

  const colorQuery = () => {
    let query = {};
    if (color) {
      query = { $eq: color };
    }
    return query;
  };

  const ownershipQuery = () => {
    let query = {};
    if (ownership) {
      query = { $eq: ownership };
    }
    return query;
  };

  return {
    ...(status && { status: statusQuery() }),
    ...(sold && { sold: soldQuery() }),
    ...(negotiable && { negotiable: negotiableQuery() }),
    ...((price || priceLT || priceGT) && { price: priceQuery() }),
    ...(category && { addCategories: categoryQuery() }),
    ...(condition && { condition: conditionQuery() }),
    ...(province && { province: provinceQuery() }),
    ...(district && { district: districtQuery() }),
    ...(city && { city: cityQuery() }),
    ...(discount && { "discount.amount": discountQuery() }),
    ...(type && { "vehicle.type": typeQuery() }),
    ...(vehicleCategory && { "vehicle.category": vehicleCategoryQuery() }),
    ...(make && { "vehicle.make": makeQuery() }),
    ...(model && { "vehicle.model": modelQuery() }),
    ...((year || yearLT || yearGT) && { "vehicle.year": yearQuery() }),
    ...(fuel && { "vehicle.fuelType": fuelQuery() }),
    ...(transmission && { "vehicle.transmission": transmissionQuery() }),
    ...((mileage || mileageLT || mileageGT) && {
      "vehicle.odometer": mileageQuery(),
    }),
    ...(color && { "vehicle.color": colorQuery() }),
    ...(ownership && { "vehicle.ownership": ownershipQuery() }),
  };
};
