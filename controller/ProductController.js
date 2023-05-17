import Product from "../model/ProductModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";
import bodyParser from "body-parser";
import cloudinary from "cloudinary";
import User from "../model/userModel.js";

// Get all products
export const getAllProducts = asyncHandler(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query.clone();

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;

  filteredProductsCount = products.length; // Update the filteredProductsCount after pagination

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get single product by ID
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json({
      success: true,
      product,
    });
  } else {
    return new ErrorHandler("Product Not Found", 404);
  }
});

//create Product

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category || !stock) {
    res.status(400);
    return new ErrorHandler("Please fill all fields", 400);
  }
  let images = [...req.body.images];

  const uploadedImages = [];
  // try {
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });
    uploadedImages.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  // } catch (error) {
  // return new ErrorHandler(error, 400);
  // }
  req.body.images = uploadedImages;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Update an existing product
export const updateProduct = asyncHandler(async (req, res) => {
  let  product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Images Start Here
  let images = [...req.body.images];

  // if (typeof req.body.images === "string") {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }

  if (images !== undefined) {

    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {

      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }else{
    req.body.images = product?.images;
    
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });


  res.status(200).json({
    success: true,
    product,
  });
});

// Delete an existing product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  // Check if product is null before calling the remove function
  if (product) {

    await Product?.findByIdAndDelete(product);
  }

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

//  create Product review(
export const updateReviews = asyncHandler(async (req, res, next) => {
  const { rating, comment, id } = req.body;


  const user = await User.findById(req.user?._id);
  const name = user?.firstName + " " + user?.lastName;

  const review = {
    user: req.user._id,
    name: name,
    rating: Number(rating),
    comment,
    id,
    url: user?.avatar.url,
  };


  const product = await Product.findById(id);
  
  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
    return;
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((value) => {
      if (value.user.toString() === req.user._id.toString()) {
        value.rating = Number(rating);
        value.comment = comment;
        value.url = user?.avatar.url;
      }

    });
  } else {

    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg =
    product.reviews.reduce((total, review) => total + review.rating, 0) /
    product.reviews.length;
  product.ratings = avg;


  await product.validate();
  await product.save();
  res.status(200).json({
    success: true,
  });
});

// Get All Reviews

export const getAllReviewsOfSingleProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
    return;
  }
  const totalReviews = product.numOfReviews;
  const ratings = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  product.reviews.forEach((review) => {
    ratings[review.rating] += 1;
  });
  const review = product.reviews;
  const rating = product.ratings;
  res.status(200).json({
    success: true,
    review,
    totalReviews,
    ratings,
    rating,
  });
});

// Delete Reviews
export const deleteReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.id,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// getAverageOfReviews

export const getAdminProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});
