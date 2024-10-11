const Product = require('../models/Product');
const { cloudinary } = require('../utils/cloudinary');

exports.createOrUpdateProduct = async (req, res) => {
    try {
        let images = [];

        // Check if files are uploaded
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path);
                return { url: result.secure_url };
            });
            images = await Promise.all(uploadPromises);
        }

        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            originalPrice: req.body.originalPrice,
            category: req.body.category,
            stock: req.body.stock,
            sold: req.body.sold || 0,
            images: images.length ? images : req.body.images, // Use new images if available
        };

        if (req.params.id) {
            // Update existing product
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
            return res.status(200).json(updatedProduct);
        } else {
            // Create new product
            const newProduct = await Product.create(productData);
            return res.status(201).json(newProduct);
        }
    } catch (error) {
        console.log("error =>",error);
        
        return res.status(500).json({ error: 'Failed to create/update product' });
    }
};

// Get All Products with Filters, Sorting, Pagination, and Search
exports.getAllProducts = async (req, res) => {
    try {
        // Destructure query parameters from the request
        const { page = 1, limit = 10, sortBy = 'latest', minPrice = 0, maxPrice = 5000, category, search } = req.query;

        // Define sorting logic
        let sortOption;
        switch (sortBy) {
            case 'priceLowToHigh':
                sortOption = { price: 1 }; // Sort by price ascending
                break;
            case 'priceHighToLow':
                sortOption = { price: -1 }; // Sort by price descending
                break;
            case 'newArrivals':
                sortOption = { createdAt: -1 }; // Sort by newest arrivals
                break;
            default:
                sortOption = { createdAt: -1 }; // Default to latest products
        }

        // Pagination logic
        const itemsPerPage = parseInt(limit);
        const skipItems = (parseInt(page) - 1) * itemsPerPage;

        // Create filter object based on query parameters
        let filter = {};

        // If search query is provided, filter products by search terms
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } }, // Case-insensitive search in product name
                { description: { $regex: search, $options: 'i' } } // Case-insensitive search in product description
            ];
        } else {
            // If no search term, apply other filters
            filter.price = { $gte: minPrice, $lte: maxPrice }; // Filter by price range

            // If category is provided, add it to the filter
            if (category) {
                filter.category = category; // Assuming category is stored as an ID (ObjectId) in the product schema
            }
        }

        // Fetch filtered and sorted products
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skipItems)
            .limit(itemsPerPage);

        // Get total product count for pagination purposes
        const totalProducts = await Product.countDocuments(filter);

        const hasMore = skipItems + products.length < totalProducts;

        // Send products with pagination info
        res.status(200).json({
            products,
            currentPage: parseInt(page),
            totalProducts,
            totalPages: Math.ceil(totalProducts / itemsPerPage),
            hasMore
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};





// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

// Get New Arrivals
exports.getNewArrivals = async (req, res) => {
    try {
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(10); // Example: Limit to the latest 10 products
        res.status(200).json(newArrivals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching new arrivals' });
    }
};

// Get Best Selling Products
exports.getBestSelling = async (req, res) => {
    try {
        const bestSelling = await Product.find().sort({ sold: -1 }).limit(10); // Example: Sorting based on 'sold' field
        res.status(200).json(bestSelling);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching best-selling products' });
    }
};

// Get Related Products by Category
exports.getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const relatedProducts = await Product.find({ category: product.category }).limit(4);
        res.json({ products: relatedProducts });
      } catch (err) {
        res.status(500).json({ message: 'Error fetching related products' });
      }
    
};

// Delete a category (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        // Fetch the product by id
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the product using findByIdAndDelete
        await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete Product', error });
    }
};

// In controllers/productController.js
exports.searchProducts = async (req, res) => {
    try {
      const { query } = req.query;
      const searchRegex = new RegExp(query, 'i'); // Case-insensitive search
      const products = await Product.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
        ],
      });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products', error });
    }
  };