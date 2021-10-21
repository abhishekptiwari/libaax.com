const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: { type: Number, required: true },
          size: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
    address: {
      details: [
        {
          phone_number: {
            type: String,
          },
          pin_code: {
            type: String,
          },
          area: {
            type: String,
          },
          flat: {
            type: String,
          },
          landmark: {
            type: String,
          },
          city: {
            type: String,
          },
          state: {
            type: String,
          },
        },
      ],
    },
  },
  { timestamps: true }
);
// how to get the selected radio button in nodejs
userSchema.methods.addToCart = function (product, selected_size, price) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    // console.log(cp);
    return (
      cp.productId.toString() === product._id.toString() &&
      cp.size === selected_size
    );
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (
    cartProductIndex >= 0 &&
    updatedCartItems[cartProductIndex].size === selected_size
  ) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
      size: selected_size,
      price: price,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function () {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.quantity !== 0;
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

// Add Address or Overwrite Address
userSchema.methods.addAddress = function (
  phone_number,
  pin_code,
  area,
  flat,
  landmark,
  city,
  state
) {
  const updateAddress = [...this.address.details];
  // console.log('Want' + updateAddress);
  let newUser = {
    phone_number: phone_number,
    pin_code: pin_code,
    area: area,
    flat: flat,
    landmark: landmark,
    city: city,
    state: state,
  };
  updateAddress.splice(0, 2, newUser);
  const detaily = {
    details: updateAddress,
  };

  this.phone_number = phone_number;
  this.address = detaily;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
